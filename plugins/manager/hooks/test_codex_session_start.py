import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent))
import codex_session_start as hook  # noqa: E402


def git(cwd, *args):
    return subprocess.run(["git", "-C", str(cwd), *args], check=True,
                          capture_output=True, text=True).stdout.strip()


def commit(cwd, name):
    Path(cwd, name).write_text(name)
    git(cwd, "add", name)
    git(cwd, "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", name)
    return git(cwd, "rev-parse", "HEAD")


class CheckoutTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        seed = self.tmp / "seed"
        seed.mkdir()
        git(seed, "init", "-q", "-b", "main")
        self.first = commit(seed, "a")
        self.remote = self.tmp / "remote.git"
        git(self.tmp, "clone", "-q", "--bare", str(seed), str(self.remote))
        self.clone = self.tmp / "clone"
        git(self.tmp, "clone", "-q", str(self.remote), str(self.clone))
        # The remote moves on after the clone; the clone has not fetched it.
        commit(seed, "b")
        git(seed, "push", "-q", str(self.remote), "main")

    def notice(self):
        return hook.currency_notice(str(self.clone))

    def test_untracked_branch_sees_commits_the_remote_gained_since_the_last_fetch(self):
        git(self.clone, "checkout", "-q", "-b", "local-work")
        text = self.notice()
        self.assertIn("As of a fetch at session start", text)
        self.assertIn("origin/main has 1 commit", text)
        self.assertIn("this checkout's local-work lacks", text)

    def test_tracked_branch_behind_its_upstream(self):
        text = self.notice()
        self.assertIn("origin/main has 1 commit that this checkout's main lacks", text)

    def test_up_to_date_checkout_is_silent(self):
        git(self.clone, "pull", "-q")
        os.utime(self.clone / ".git" / "FETCH_HEAD", (0, 0))
        self.assertIsNone(self.notice())

    def test_failed_fetch_falls_back_to_the_last_fetch_and_says_so(self):
        git(self.clone, "fetch", "-q")  # the last fetch saw the remote's new commit
        os.utime(self.clone / ".git" / "FETCH_HEAD", (0, 0))
        git(self.clone, "remote", "set-url", "origin", str(self.tmp / "missing.git"))
        text = self.notice()
        self.assertIn("As of the last fetch (refreshing from origin failed:", text)
        self.assertIn("origin/main has 1 commit", text)

    def test_failed_fetch_with_no_known_lag_reports_unknown(self):
        git(self.clone, "remote", "set-url", "origin", str(self.tmp / "missing.git"))
        text = self.notice()
        self.assertIn("refreshing from origin failed", text)
        self.assertIn("is unknown", text)

    def test_fetch_timeout_is_reported_not_waited_out(self):
        real_run = subprocess.run

        def slow_fetch(cmd, *args, **kwargs):
            if "fetch" in cmd:
                raise subprocess.TimeoutExpired(cmd, kwargs.get("timeout"))
            return real_run(cmd, *args, **kwargs)

        with mock.patch.object(hook.subprocess, "run", side_effect=slow_fetch):
            text = self.notice()
        self.assertIn("refreshing from origin failed: timed out", text)

    def test_recent_fetch_is_not_repeated(self):
        git(self.clone, "fetch", "-q")
        git(self.clone, "update-ref", "refs/remotes/origin/main", self.first)
        # FETCH_HEAD is fresh, so the hook trusts the cached ref and stays quiet.
        self.assertIsNone(self.notice())


class OutputTest(unittest.TestCase):
    def run_main(self, cwd):
        event = {"hook_event_name": "SessionStart", "cwd": cwd}
        out = io.StringIO()
        with mock.patch.object(sys, "stdin", io.StringIO(json.dumps(event))), \
                mock.patch.object(sys, "stdout", out):
            hook.main()
        return json.loads(out.getvalue())["hookSpecificOutput"]["additionalContext"]

    def test_non_git_directory_gets_only_the_loader_line(self):
        context = self.run_main(tempfile.mkdtemp())
        self.assertIn("manager:manager skill", context)
        self.assertNotIn("\n\n", context)

    def test_a_git_surprise_never_drops_the_loader_line(self):
        with mock.patch.object(hook, "currency_notice", side_effect=RuntimeError("boom")):
            context = self.run_main(tempfile.mkdtemp())
        self.assertIn("manager:manager skill", context)


if __name__ == "__main__":
    unittest.main()
