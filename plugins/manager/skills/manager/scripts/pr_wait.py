#!/usr/bin/env python3
"""Wait on one GitHub pull request and report a single verdict with a fixed exit code.

Usage: pr_wait.py PR [--repo OWNER/NAME] [--timeout SECONDS] [--interval SECONDS] [--once]
                  [--ignore-check NAME ...]

PR is a pull request URL, OWNER/NAME#N, or a bare number. Prints one JSON line:
{"verdict", "exit", "pr", "head", "reasons"}.

Exit codes: 0 READY or MERGED, 2 CONFLICT, 3 REVIEW, 4 CHECKS_FAILED, 5 TIMEOUT,
6 GATED, 7 QUERY_FAILED, 8 CLOSED, 9 PENDING (only with --once).

Only PENDING keeps polling; every other verdict returns at once. Defaults: --timeout 1800,
--interval 30 (seconds). --ignore-check NAME leaves a non-gating check out; it may repeat.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import subprocess
import sys
import time
from dataclasses import dataclass, field
from typing import Callable

QUERY = """
query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      number state isDraft mergeable mergeStateStatus reviewDecision headRefOid
      reviewThreads(first: 100) { pageInfo { hasNextPage } nodes { isResolved isOutdated } }
      commits(last: 1) { nodes { commit { statusCheckRollup { contexts(first: 100) {
        pageInfo { hasNextPage }
        nodes {
          __typename
          ... on CheckRun { name status conclusion startedAt isRequired(pullRequestNumber: $number) }
          ... on StatusContext { context state isRequired(pullRequestNumber: $number) }
        }
      } } } } }
    }
  }
}
"""

EXIT_CODES = {
    "READY": 0,
    "MERGED": 0,
    "CONFLICT": 2,
    "REVIEW": 3,
    "CHECKS_FAILED": 4,
    "TIMEOUT": 5,
    "GATED": 6,
    "QUERY_FAILED": 7,
    "CLOSED": 8,
    "PENDING": 9,
}
FAILED_CHECK_RUN = {"FAILURE", "TIMED_OUT", "CANCELLED", "ACTION_REQUIRED", "STARTUP_FAILURE", "STALE"}
FAILED_STATUS = {"FAILURE", "ERROR"}
PENDING_STATUS = {"PENDING", "EXPECTED"}
GATE_STATES = {"BLOCKED", "BEHIND", "DRAFT"}
MAX_CONSECUTIVE_QUERY_FAILURES = 3


class QueryError(Exception):
    pass


@dataclass
class Verdict:
    name: str
    reasons: list[str] = field(default_factory=list)
    head: str | None = None

    @property
    def exit_code(self) -> int:
        return EXIT_CODES[self.name]


@dataclass(frozen=True)
class PrRef:
    owner: str
    name: str
    number: int

    def __str__(self) -> str:
        return f"{self.owner}/{self.name}#{self.number}"


def _check_contexts(pr: dict) -> tuple[list[dict], bool]:
    commits = pr.get("commits", {}).get("nodes") or []
    rollup = commits[-1]["commit"].get("statusCheckRollup") if commits else None
    if not rollup:
        return [], False
    contexts = rollup["contexts"]
    return contexts["nodes"], contexts["pageInfo"]["hasNextPage"]


def _check_name(check: dict) -> str:
    return check.get("name") or check.get("context") or "unnamed check"


def _latest_runs(checks: list[dict]) -> list[dict]:
    latest: dict[str, dict] = {}
    statuses = []
    for check in checks:
        if check["__typename"] != "CheckRun":
            statuses.append(check)
            continue
        current = latest.get(check["name"])
        if current is None or _start_key(check) >= _start_key(current):
            latest[check["name"]] = check
    return [*latest.values(), *statuses]


def _start_key(run: dict) -> str:
    return run.get("startedAt") or "~not started"


def _is_failed(check: dict) -> bool:
    if check["__typename"] == "CheckRun":
        return check["status"] == "COMPLETED" and check.get("conclusion") in FAILED_CHECK_RUN
    return check.get("state") in FAILED_STATUS


def _is_pending(check: dict) -> bool:
    if check["__typename"] == "CheckRun":
        return check["status"] != "COMPLETED"
    return check.get("state") in PENDING_STATUS


def classify(pr: dict, ignored_checks: frozenset[str] = frozenset()) -> Verdict:
    head = pr.get("headRefOid")
    if pr["state"] == "MERGED":
        return Verdict("MERGED", head=head)
    if pr["state"] == "CLOSED":
        return Verdict("CLOSED", ["closed without merging"], head)

    all_checks, checks_truncated = _check_contexts(pr)
    checks = _latest_runs([c for c in all_checks if _check_name(c) not in ignored_checks])
    threads = pr["reviewThreads"]
    if checks_truncated or threads["pageInfo"]["hasNextPage"]:
        return Verdict("QUERY_FAILED", ["more than 100 checks or review threads; cannot judge the rest"], head)

    if pr.get("mergeable") == "CONFLICTING" or pr.get("mergeStateStatus") == "DIRTY":
        return Verdict("CONFLICT", ["merge conflict with the base branch"], head)

    failed = [_check_name(c) for c in checks if _is_failed(c)]
    if failed:
        return Verdict("CHECKS_FAILED", [f"failed: {name}" for name in failed], head)

    unresolved = sum(1 for t in threads["nodes"] if not t["isResolved"])
    if unresolved or pr.get("reviewDecision") == "CHANGES_REQUESTED":
        reasons = [f"{unresolved} unresolved review thread(s)"] if unresolved else []
        if pr.get("reviewDecision") == "CHANGES_REQUESTED":
            reasons.append("changes requested")
        return Verdict("REVIEW", reasons, head)

    pending = [_check_name(c) for c in checks if _is_pending(c)]
    if pending or "UNKNOWN" in (pr.get("mergeable"), pr.get("mergeStateStatus")):
        reasons = [f"pending: {name}" for name in pending] or ["GitHub is still computing mergeability"]
        return Verdict("PENDING", reasons, head)

    if pr.get("isDraft") or pr.get("mergeStateStatus") in GATE_STATES:
        reason = "draft" if pr.get("isDraft") else f"merge state {pr['mergeStateStatus']}"
        return Verdict("GATED", [reason], head)

    return Verdict("READY", head=head)


def wait(
    fetch: Callable[[], dict],
    timeout_s: float,
    interval_s: float,
    sleep: Callable[[float], None],
    monotonic: Callable[[], float],
    ignored_checks: frozenset[str] = frozenset(),
) -> Verdict:
    start = monotonic()
    failures = 0
    last = Verdict("PENDING", ["no successful query yet"])
    while True:
        try:
            last = classify(fetch(), ignored_checks)
            failures = 0
        except QueryError as error:
            failures += 1
            last = Verdict("QUERY_FAILED", [str(error)], last.head)
            if failures >= MAX_CONSECUTIVE_QUERY_FAILURES:
                return last
        else:
            if last.name != "PENDING":
                return last
        remaining = timeout_s - (monotonic() - start)
        if remaining <= 0:
            return Verdict("TIMEOUT", [f"still not terminal after {timeout_s:g}s", *last.reasons], last.head)
        sleep(min(interval_s, remaining))
        if monotonic() - start >= timeout_s:
            return Verdict("TIMEOUT", [f"still not terminal after {timeout_s:g}s", *last.reasons], last.head)


def parse_pr(text: str, repo: str | None) -> PrRef:
    url = re.fullmatch(r"https://github\.com/([^/]+)/([^/]+)/pull/(\d+)/?", text)
    if url:
        return PrRef(url[1], url[2], int(url[3]))
    short = re.fullmatch(r"([^/\s]+)/([^/#\s]+)#(\d+)", text)
    if short:
        return PrRef(short[1], short[2], int(short[3]))
    if re.fullmatch(r"[0-9]+", text):
        repo = repo or _current_repo()
        owner, _, name = repo.partition("/")
        if owner and name:
            return PrRef(owner, name, int(text))
    raise QueryError(f"cannot parse pull request reference: {text!r}")


def _gh(args: list[str]) -> str:
    try:
        result = subprocess.run(["gh", *args], capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired) as error:
        raise QueryError(f"gh failed: {error}") from error
    if result.returncode != 0:
        raise QueryError(f"gh exited {result.returncode}: {result.stderr.strip()[:300]}")
    return result.stdout


def _current_repo() -> str:
    return _gh(["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]).strip()


def fetch_pr(ref: PrRef) -> dict:
    raw = _gh([
        "api", "graphql",
        "-f", f"query={QUERY}",
        "-f", f"owner={ref.owner}",
        "-f", f"name={ref.name}",
        "-F", f"number={ref.number}",
    ])
    try:
        pr = json.loads(raw)["data"]["repository"]["pullRequest"]
    except (ValueError, KeyError, TypeError) as error:
        raise QueryError(f"unexpected GraphQL response: {raw[:300]}") from error
    if pr is None:
        raise QueryError(f"pull request {ref} not found")
    _require_shape(pr)
    return pr


def _require_shape(pr: object) -> None:
    def need(condition: bool, what: str) -> None:
        if not condition:
            raise QueryError(f"unexpected GraphQL response: {what}")

    need(isinstance(pr, dict), "pullRequest is not an object")
    for key in ("state", "mergeable", "mergeStateStatus", "headRefOid"):
        need(isinstance(pr.get(key), str), f"{key} missing")
    need(isinstance(pr.get("isDraft"), bool), "isDraft missing")
    need(pr.get("reviewDecision") is None or isinstance(pr["reviewDecision"], str), "reviewDecision malformed")
    threads = pr.get("reviewThreads")
    need(isinstance(threads, dict) and isinstance(threads.get("nodes"), list), "reviewThreads missing")
    need(isinstance(threads.get("pageInfo", {}).get("hasNextPage"), bool), "reviewThreads pageInfo missing")
    need(all(isinstance(t, dict) and isinstance(t.get("isResolved"), bool) for t in threads["nodes"]),
         "review thread malformed")
    commits = pr.get("commits")
    need(isinstance(commits, dict) and isinstance(commits.get("nodes"), list), "commits missing")
    for node in commits["nodes"]:
        need(isinstance(node, dict) and isinstance(node.get("commit"), dict), "commit malformed")
        rollup = node["commit"].get("statusCheckRollup")
        if rollup is None:
            continue
        contexts = rollup.get("contexts") if isinstance(rollup, dict) else None
        need(isinstance(contexts, dict) and isinstance(contexts.get("nodes"), list), "check contexts missing")
        need(isinstance(contexts.get("pageInfo", {}).get("hasNextPage"), bool), "check contexts pageInfo missing")
        for check in contexts["nodes"]:
            kind = check.get("__typename") if isinstance(check, dict) else None
            if kind == "CheckRun":
                need(isinstance(check.get("status"), str), "CheckRun status missing")
            else:
                need(kind == "StatusContext" and isinstance(check.get("state"), str), "check context malformed")


def _seconds(allow_zero: bool) -> Callable[[str], float]:
    def parse(text: str) -> float:
        value = float(text)
        if not math.isfinite(value) or value < 0 or (value == 0 and not allow_zero):
            raise argparse.ArgumentTypeError(f"expected a finite {'non-negative' if allow_zero else 'positive'} number of seconds")
        return value

    return parse


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("pr")
    parser.add_argument("--repo")
    parser.add_argument("--timeout", type=_seconds(allow_zero=True), default=1800)
    parser.add_argument("--interval", type=_seconds(allow_zero=False), default=30)
    parser.add_argument("--once", action="store_true")
    parser.add_argument("--ignore-check", action="append", default=[], metavar="NAME",
                        help="leave a non-gating check out of the verdict; may repeat")
    args = parser.parse_args(argv)

    label = args.pr
    ignored = frozenset(args.ignore_check)
    try:
        ref = parse_pr(args.pr, args.repo)
        label = str(ref)
        if args.once:
            verdict = classify(fetch_pr(ref), ignored)
        else:
            verdict = wait(lambda: fetch_pr(ref), args.timeout, args.interval, time.sleep, time.monotonic, ignored)
    except QueryError as error:
        verdict = Verdict("QUERY_FAILED", [str(error)])

    print(json.dumps({
        "verdict": verdict.name,
        "exit": verdict.exit_code,
        "pr": label,
        "head": verdict.head,
        "reasons": verdict.reasons,
    }))
    return verdict.exit_code


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
