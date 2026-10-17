import io
import json
import unittest
from unittest.mock import Mock, patch

import pr_wait


def make_pr(
    *,
    check_runs=(),
    status_contexts=(),
    threads=(),
    checks_truncated=False,
    threads_truncated=False,
    no_rollup=False,
    **fields,
):
    contexts = [
        {
            "__typename": "CheckRun",
            "name": "build",
            "status": "COMPLETED",
            "conclusion": "SUCCESS",
            "isRequired": True,
            **check,
        }
        for check in check_runs
    ] + [
        {
            "__typename": "StatusContext",
            "context": "legacy-ci",
            "state": "SUCCESS",
            "isRequired": True,
            **context,
        }
        for context in status_contexts
    ]
    rollup = None if no_rollup else {
        "contexts": {
            "pageInfo": {"hasNextPage": checks_truncated},
            "nodes": contexts,
        }
    }
    return {
        "number": 42,
        "state": "OPEN",
        "isDraft": False,
        "mergeable": "MERGEABLE",
        "mergeStateStatus": "CLEAN",
        "reviewDecision": None,
        "headRefOid": "a" * 40,
        "reviewThreads": {
            "pageInfo": {"hasNextPage": threads_truncated},
            "nodes": [
                {"isResolved": True, "isOutdated": False, **thread}
                for thread in threads
            ],
        },
        "commits": {
            "nodes": [{"commit": {"statusCheckRollup": rollup}}],
        },
        **fields,
    }


class ClassifyTests(unittest.TestCase):
    def test_merged(self):
        verdict = pr_wait.classify(make_pr(state="MERGED"))
        self.assertEqual((verdict.name, verdict.exit_code), ("MERGED", 0))

    def test_closed(self):
        verdict = pr_wait.classify(make_pr(state="CLOSED"))
        self.assertEqual((verdict.name, verdict.exit_code), ("CLOSED", 8))

    def test_truncated_lists(self):
        for field in ("checks_truncated", "threads_truncated"):
            with self.subTest(field=field):
                verdict = pr_wait.classify(make_pr(**{field: True}))
                self.assertEqual((verdict.name, verdict.exit_code), ("QUERY_FAILED", 7))

    def test_conflicting_mergeable(self):
        verdict = pr_wait.classify(make_pr(mergeable="CONFLICTING"))
        self.assertEqual((verdict.name, verdict.exit_code), ("CONFLICT", 2))

    def test_dirty_merge_state(self):
        verdict = pr_wait.classify(make_pr(mergeStateStatus="DIRTY"))
        self.assertEqual((verdict.name, verdict.exit_code), ("CONFLICT", 2))

    def test_failed_check_run(self):
        for conclusion in (
            "FAILURE", "TIMED_OUT", "CANCELLED", "ACTION_REQUIRED",
            "STARTUP_FAILURE", "STALE",
        ):
            for required in (True, False):
                with self.subTest(conclusion=conclusion, required=required):
                    verdict = pr_wait.classify(make_pr(check_runs=({
                        "name": "unit-tests",
                        "conclusion": conclusion,
                        "isRequired": required,
                    },)))
                    self.assertEqual((verdict.name, verdict.exit_code), ("CHECKS_FAILED", 4))
                    self.assertTrue(any("unit-tests" in reason for reason in verdict.reasons))

    def test_failed_status_context(self):
        for state in ("FAILURE", "ERROR"):
            for required in (True, False):
                with self.subTest(state=state, required=required):
                    verdict = pr_wait.classify(make_pr(status_contexts=({
                        "context": "external-ci",
                        "state": state,
                        "isRequired": required,
                    },)))
                    self.assertEqual((verdict.name, verdict.exit_code), ("CHECKS_FAILED", 4))
                    self.assertTrue(any("external-ci" in reason for reason in verdict.reasons))

    def test_unresolved_review_thread(self):
        for outdated in (True, False):
            with self.subTest(outdated=outdated):
                verdict = pr_wait.classify(make_pr(threads=({
                    "isResolved": False,
                    "isOutdated": outdated,
                },)))
                self.assertEqual((verdict.name, verdict.exit_code), ("REVIEW", 3))

    def test_changes_requested(self):
        verdict = pr_wait.classify(make_pr(reviewDecision="CHANGES_REQUESTED"))
        self.assertEqual((verdict.name, verdict.exit_code), ("REVIEW", 3))

    def test_pending(self):
        cases = (
            {"check_runs": ({"status": "QUEUED", "conclusion": None},)},
            {"check_runs": ({"status": "IN_PROGRESS", "conclusion": None},)},
            {"status_contexts": ({"state": "PENDING"},)},
            {"status_contexts": ({"state": "EXPECTED"},)},
            {"mergeable": "UNKNOWN"},
            {"mergeStateStatus": "UNKNOWN"},
        )
        for fields in cases:
            with self.subTest(fields=fields):
                verdict = pr_wait.classify(make_pr(**fields))
                self.assertEqual((verdict.name, verdict.exit_code), ("PENDING", 9))

    def test_gated(self):
        cases = (
            {"isDraft": True},
            {"mergeStateStatus": "BLOCKED"},
            {"mergeStateStatus": "BEHIND"},
            {"mergeStateStatus": "DRAFT"},
        )
        for fields in cases:
            with self.subTest(fields=fields):
                verdict = pr_wait.classify(make_pr(**fields))
                self.assertEqual((verdict.name, verdict.exit_code), ("GATED", 6))

    def test_ready(self):
        for state in ("CLEAN", "HAS_HOOKS", "UNSTABLE"):
            with self.subTest(state=state):
                verdict = pr_wait.classify(make_pr(mergeStateStatus=state))
                self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))

    def test_non_failure_conclusions(self):
        for conclusion in ("SUCCESS", "NEUTRAL", "SKIPPED"):
            with self.subTest(conclusion=conclusion):
                verdict = pr_wait.classify(make_pr(check_runs=({
                    "conclusion": conclusion,
                },)))
                self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))

    def test_null_rollup_with_clean_merge_state(self):
        verdict = pr_wait.classify(make_pr(no_rollup=True))
        self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))

    def test_merged_precedes_truncation(self):
        verdict = pr_wait.classify(make_pr(state="MERGED", checks_truncated=True))
        self.assertEqual((verdict.name, verdict.exit_code), ("MERGED", 0))

    def test_closed_precedes_truncation(self):
        verdict = pr_wait.classify(make_pr(state="CLOSED", threads_truncated=True))
        self.assertEqual((verdict.name, verdict.exit_code), ("CLOSED", 8))

    def test_truncation_precedes_conflict(self):
        verdict = pr_wait.classify(make_pr(
            checks_truncated=True, mergeable="CONFLICTING",
        ))
        self.assertEqual((verdict.name, verdict.exit_code), ("QUERY_FAILED", 7))

    def test_conflict_precedes_failed_check(self):
        verdict = pr_wait.classify(make_pr(
            mergeable="CONFLICTING", check_runs=({"conclusion": "FAILURE"},),
        ))
        self.assertEqual((verdict.name, verdict.exit_code), ("CONFLICT", 2))

    def test_failed_check_precedes_review(self):
        verdict = pr_wait.classify(make_pr(
            check_runs=({"conclusion": "FAILURE"},),
            threads=({"isResolved": False},),
        ))
        self.assertEqual((verdict.name, verdict.exit_code), ("CHECKS_FAILED", 4))

    def test_review_precedes_pending_checks(self):
        verdict = pr_wait.classify(make_pr(
            threads=({"isResolved": False},),
            check_runs=({"status": "IN_PROGRESS", "conclusion": None},),
        ))
        self.assertEqual((verdict.name, verdict.exit_code), ("REVIEW", 3))

    def test_pending_precedes_gate(self):
        verdict = pr_wait.classify(make_pr(mergeable="UNKNOWN", isDraft=True))
        self.assertEqual((verdict.name, verdict.exit_code), ("PENDING", 9))

    def test_ignored_failed_check_is_ready(self):
        verdict = pr_wait.classify(
            make_pr(check_runs=({"name": "board-sync", "conclusion": "FAILURE"},)),
            ignored_checks=frozenset({"board-sync"}),
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))

    def test_ignored_pending_check_is_ready(self):
        verdict = pr_wait.classify(
            make_pr(check_runs=({
                "name": "board-sync", "status": "QUEUED", "conclusion": None,
            },)),
            ignored_checks=frozenset({"board-sync"}),
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))

    def test_non_ignored_failed_check_still_fails(self):
        verdict = pr_wait.classify(
            make_pr(check_runs=(
                {"name": "board-sync", "conclusion": "FAILURE"},
                {"name": "unit-tests", "conclusion": "FAILURE"},
            )),
            ignored_checks=frozenset({"board-sync"}),
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("CHECKS_FAILED", 4))
        self.assertTrue(any("unit-tests" in reason for reason in verdict.reasons))

    def test_status_context_is_ignored_by_context_name(self):
        for state in ("FAILURE", "ERROR", "PENDING", "EXPECTED"):
            with self.subTest(state=state):
                verdict = pr_wait.classify(
                    make_pr(status_contexts=({
                        "context": "external-ci", "state": state,
                    },)),
                    ignored_checks=frozenset({"external-ci"}),
                )
                self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))


class FakeClock:
    def __init__(self):
        self.now = 100.0

    def monotonic(self):
        return self.now

    def sleep(self, seconds):
        self.now += seconds


class WaitTests(unittest.TestCase):
    def setUp(self):
        self.clock = FakeClock()

    def test_pending_then_ready(self):
        fetch = Mock(side_effect=[make_pr(mergeable="UNKNOWN"), make_pr()])
        verdict = pr_wait.wait(
            fetch, timeout_s=10, interval_s=2,
            sleep=self.clock.sleep, monotonic=self.clock.monotonic,
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))

    def test_pending_past_timeout(self):
        fetch = Mock(return_value=make_pr(mergeable="UNKNOWN"))
        started = self.clock.monotonic()
        verdict = pr_wait.wait(
            fetch, timeout_s=5, interval_s=2,
            sleep=self.clock.sleep, monotonic=self.clock.monotonic,
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("TIMEOUT", 5))
        self.assertGreaterEqual(self.clock.monotonic() - started, 5)

    def test_three_consecutive_query_errors(self):
        fetch = Mock(side_effect=[
            pr_wait.QueryError("first failure"),
            pr_wait.QueryError("second failure"),
            pr_wait.QueryError("third failure"),
            make_pr(),
        ])
        verdict = pr_wait.wait(
            fetch, timeout_s=10, interval_s=2,
            sleep=self.clock.sleep, monotonic=self.clock.monotonic,
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("QUERY_FAILED", 7))

    def test_two_query_errors_then_ready(self):
        fetch = Mock(side_effect=[
            pr_wait.QueryError("first failure"),
            pr_wait.QueryError("second failure"),
            make_pr(),
        ])
        verdict = pr_wait.wait(
            fetch, timeout_s=10, interval_s=2,
            sleep=self.clock.sleep, monotonic=self.clock.monotonic,
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))

    def test_ignored_pending_check_returns_ready_without_waiting(self):
        fetch = Mock(return_value=make_pr(check_runs=({
            "name": "board-sync", "status": "QUEUED", "conclusion": None,
        },)))
        started = self.clock.monotonic()
        verdict = pr_wait.wait(
            fetch, timeout_s=10, interval_s=2,
            sleep=self.clock.sleep, monotonic=self.clock.monotonic,
            ignored_checks=frozenset({"board-sync"}),
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("READY", 0))
        fetch.assert_called_once()
        self.assertEqual(self.clock.monotonic(), started)


class MainTests(unittest.TestCase):
    def test_once_passes_ignored_check_names_through(self):
        cases = (
            (
                ["--ignore-check", "X"],
                ({"name": "X", "conclusion": "FAILURE"},),
            ),
            (
                ["--ignore-check", "X", "--ignore-check", "Y"],
                (
                    {"name": "X", "conclusion": "FAILURE"},
                    {"name": "Y", "status": "QUEUED", "conclusion": None},
                ),
            ),
        )
        for flags, checks in cases:
            with self.subTest(flags=flags):
                with patch("pr_wait.parse_pr", return_value=("example", "repo", 42)), \
                        patch("pr_wait.fetch_pr", return_value=make_pr(check_runs=checks)), \
                        patch("sys.stdout", new_callable=io.StringIO) as stdout:
                    exit_code = pr_wait.main(["example/repo#42", "--once", *flags])
                self.assertEqual(exit_code, 0)
                lines = stdout.getvalue().splitlines()
                self.assertEqual(len(lines), 1)
                result = json.loads(lines[0])
                self.assertEqual((result["verdict"], result["exit"]), ("READY", 0))


if __name__ == "__main__":
    unittest.main()


class BoundaryRegressionTests(unittest.TestCase):
    def test_no_query_after_the_deadline(self):
        clock = FakeClock()
        fetch = Mock(side_effect=[make_pr(mergeable="UNKNOWN"), make_pr()])
        verdict = pr_wait.wait(
            fetch, timeout_s=1, interval_s=30,
            sleep=clock.sleep, monotonic=clock.monotonic,
        )
        self.assertEqual((verdict.name, verdict.exit_code), ("TIMEOUT", 5))
        fetch.assert_called_once()

    def test_non_finite_or_negative_bounds_are_rejected(self):
        for flags in (["--timeout", "nan"], ["--timeout", "inf"], ["--interval", "-1"], ["--interval", "0"]):
            with self.subTest(flags=flags), patch("pr_wait.fetch_pr") as fetch, \
                    patch("sys.stderr", new_callable=io.StringIO), self.assertRaises(SystemExit):
                pr_wait.main(["o/r#1", *flags])
                fetch.assert_not_called()

    def test_non_ascii_digit_reference_is_query_failed(self):
        with patch("sys.stdout", new_callable=io.StringIO) as stdout:
            exit_code = pr_wait.main(["²", "--repo", "o/r", "--once"])
        self.assertEqual(exit_code, 7)
        self.assertEqual(json.loads(stdout.getvalue())["verdict"], "QUERY_FAILED")

    def test_malformed_pull_request_raises_query_error(self):
        partial = {"state": "OPEN", "reviewThreads": {"pageInfo": {"hasNextPage": False}, "nodes": []}}
        for pull_request in (partial, []):
            raw = json.dumps({"data": {"repository": {"pullRequest": pull_request}}})
            with self.subTest(pull_request=pull_request), patch("pr_wait._gh", return_value=raw):
                with self.assertRaises(pr_wait.QueryError):
                    pr_wait.fetch_pr(pr_wait.PrRef("o", "r", 1))

    def test_complete_pull_request_passes_the_boundary(self):
        raw = json.dumps({"data": {"repository": {"pullRequest": make_pr(check_runs=({},))}}})
        with patch("pr_wait._gh", return_value=raw):
            self.assertEqual(pr_wait.classify(pr_wait.fetch_pr(pr_wait.PrRef("o", "r", 1))).name, "READY")
