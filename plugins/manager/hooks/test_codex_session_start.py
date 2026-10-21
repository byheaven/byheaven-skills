import importlib
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
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
        self.assertIn("origin/main (fetched just now) has 1 commit that local-work lacks", text)
        self.assertIn("this branch's own changes are not on it", text)

    def test_tracked_branch_behind_its_upstream(self):
        text = self.notice()
        self.assertIn(
            "origin/main (fetched just now) has 1 commit that main lacks; "
            "work from a fresh worktree off `origin/main`, per repo-integration.md's Shared checkout rule.",
            text,
        )
        self.assertNotIn("pull before relying on this tree", text)

    def test_up_to_date_checkout_is_silent(self):
        git(self.clone, "pull", "-q")
        self.assertIsNone(self.notice())

    def test_failed_fetch_falls_back_to_the_last_fetch_and_says_so_every_time(self):
        git(self.clone, "fetch", "-q")  # the last fetch saw the remote's new commit
        git(self.clone, "remote", "set-url", "origin", str(self.tmp / "missing.git"))
        for _ in range(2):  # a failed fetch must not make the next start look fresh
            text = self.notice()
            self.assertIn("origin/main (as of an earlier fetch; refreshing failed:", text)
            self.assertIn("has 1 commit", text)

    def test_failed_fetch_with_no_known_lag_reports_unknown(self):
        git(self.clone, "remote", "set-url", "origin", str(self.tmp / "missing.git"))
        text = self.notice()
        self.assertIn("is unknown: refreshing failed", text)

    def test_remote_with_another_name_and_no_upstream(self):
        git(self.clone, "remote", "rename", "origin", "source")
        git(self.clone, "checkout", "-q", "-b", "local-work")
        git(self.clone, "branch", "-q", "--unset-upstream", "main")
        self.assertIn("source/main (fetched just now) has 1 commit", self.notice())

    def test_feature_branch_current_with_its_upstream_is_told_main_moved_not_to_pull(self):
        git(self.clone, "checkout", "-q", "-b", "feature")
        commit(self.clone, "f")
        git(self.clone, "push", "-q", "-u", "origin", "feature")
        text = self.notice()
        self.assertNotIn("feature (", text)
        self.assertIn("origin/main (fetched just now) has 1 commit that feature lacks", text)
        self.assertNotIn("pull", text)

    def test_fetch_runs_no_repository_hooks_and_writes_only_remote_tracking_refs(self):
        git(self.clone, "config", "--add", "remote.origin.fetch", "+refs/heads/*:refs/heads/*")
        git(self.clone, "checkout", "-q", "-b", "local-work")
        local_main = git(self.clone, "rev-parse", "refs/heads/main")
        hook_file = self.clone / ".git" / "hooks" / "reference-transaction"
        marker = self.tmp / "hook-ran"
        hook_file.write_text(f"#!/bin/sh\ntouch {marker}\n")
        hook_file.chmod(0o755)
        self.assertIn("origin/main (fetched just now) has 1 commit", self.notice())
        self.assertFalse(marker.exists())
        self.assertEqual(local_main, git(self.clone, "rev-parse", "refs/heads/main"))
        self.assertEqual("", git(self.clone, "status", "--porcelain"))

    def assert_untrusted_config_runs_nothing(self, *settings, skipped=True):
        """Set hostile repository config and check the hook neither runs it nor claims a
        fresh fetch."""
        marker = self.tmp / "pwned"
        payload = f"sh -c 'touch {marker}'"
        for key, value in settings:
            git(self.clone, "config", key, value.replace("PAYLOAD", payload).replace("MARKER", str(marker)))
        text = self.notice() or ""
        self.assertFalse(marker.exists(), "repository config ran a program")
        self.assertNotIn("fetched just now", text)
        if skipped:
            self.assertIn("skipped, this repository's own config sets", text)
        return text

    def test_repository_upload_pack_is_never_run(self):
        self.assert_untrusted_config_runs_nothing(("remote.origin.uploadpack", "PAYLOAD"))

    def test_repository_credential_helper_is_never_run(self):
        git(self.clone, "remote", "set-url", "origin", "https://example.invalid/repo.git")
        self.assert_untrusted_config_runs_nothing(("credential.helper", "!touch MARKER"))

    def test_repository_url_specific_credential_helper_is_never_run(self):
        git(self.clone, "remote", "set-url", "origin", "https://example.invalid/repo.git")
        self.assert_untrusted_config_runs_nothing(
            ("credential.https://example.invalid.helper", "!touch MARKER"))

    def test_repository_ssh_command_and_proxy_are_never_run(self):
        git(self.clone, "remote", "set-url", "origin", "ssh://example.invalid/repo.git")
        self.assert_untrusted_config_runs_nothing(("core.sshCommand", "PAYLOAD"))

    def test_repository_enabling_the_ext_transport_is_skipped(self):
        self.assert_untrusted_config_runs_nothing(("protocol.ext.allow", "always"),
                                                  ("remote.origin.url", "ext::PAYLOAD"))

    def test_rewrite_to_the_ext_transport_is_refused_by_the_command_line(self):
        # No risky key, so the fetch runs; the command-line protocol allowlist refuses ext::.
        git(self.clone, "config", f"url.ext::sh -c touch% {self.tmp / 'pwned'}.insteadOf", str(self.remote))
        text = self.assert_untrusted_config_runs_nothing(skipped=False)
        self.assertIn("refreshing failed", text)

    def test_included_config_file_is_skipped(self):
        extra = self.tmp / "extra.config"
        extra.write_text("[remote \"origin\"]\n\tuploadpack = sh -c 'touch MARKER'\n"
                         .replace("MARKER", str(self.tmp / "pwned")))
        self.assert_untrusted_config_runs_nothing(("include.path", str(extra)))

    def test_configured_hook_command_is_skipped(self):
        self.assert_untrusted_config_runs_nothing(("hook.audit.command", "touch MARKER"),
                                                  ("hook.audit.event", "reference-transaction"))

    def test_line_separator_inside_a_key_does_not_hide_a_credential_helper(self):
        git(self.clone, "remote", "set-url", "origin", "https://example.invalid/repo.git")
        self.assert_untrusted_config_runs_nothing(
            ("credential.https://example.invalid/a\u2028b.helper", "!touch MARKER"))

    def test_carriage_return_inside_a_key_does_not_hide_a_credential_helper(self):
        git(self.clone, "remote", "set-url", "origin", "https://example.invalid/a%0Db")
        self.assert_untrusted_config_runs_nothing(
            ("credential.https://example.invalid/a\rb.helper", "!touch MARKER"),
            ("http.proactiveAuth", "basic"))

    def test_user_wide_ext_permission_does_not_reopen_the_ext_transport(self):
        marker = self.tmp / "pwned"
        user_config = self.tmp / "user.gitconfig"
        user_config.write_text("[protocol \"ext\"]\n\tallow = always\n")
        git(self.clone, "config", f"url.ext::sh -c touch% {marker}.insteadOf", str(self.remote))
        env = dict(hook.GIT_ENV, GIT_CONFIG_GLOBAL=str(user_config))
        with mock.patch.object(hook, "GIT_ENV", env):
            self.notice()
        self.assertFalse(marker.exists())

    def test_inherited_git_config_cannot_blind_the_scan(self):
        self.assertNotIn("GIT_CONFIG", hook.GIT_ENV)
        self.assertEqual("1", hook.GIT_ENV["GIT_NO_LAZY_FETCH"])
        self.assertEqual("https:http:ssh:git:file", hook.GIT_ENV["GIT_ALLOW_PROTOCOL"])
        self.assertIn("--no-auto-maintenance", hook.FETCH_ARGS)

    def test_hung_transport_is_killed_with_its_children_inside_the_budget(self):
        pidfile = self.tmp / "ssh.pid"
        fake_ssh = self.tmp / "fake-ssh"
        fake_ssh.write_text(f"#!/bin/sh\nsleep 30 &\necho $! > {pidfile}\nwait\n")
        fake_ssh.chmod(0o755)
        git(self.clone, "remote", "set-url", "origin", "ssh://example.invalid/repo.git")
        env = dict(hook.GIT_ENV, GIT_SSH_COMMAND=str(fake_ssh))
        with mock.patch.object(hook, "GIT_ENV", env):
            started = time.monotonic()
            text = self.notice()
            elapsed = time.monotonic() - started
        self.assertLess(elapsed, hook.BUDGET_S + 0.5)
        self.assertIn("refreshing failed (timed out", text)
        time.sleep(0.2)
        with self.assertRaises(ProcessLookupError):
            os.kill(int(pidfile.read_text()), 0)

    def ask_for_credentials(self, user_env, config):
        """Run a real credential request the way the hook's fetch would, with the user's
        own askpass settings, and report whether their askpass program was started."""
        asked = self.tmp / "asked"
        asked.unlink(missing_ok=True)
        askpass = self.tmp / "askpass"
        askpass.write_text(f"#!/bin/sh\ntouch {asked}\necho secret\n")
        askpass.chmod(0o755)
        values = {key: str(askpass) for key in user_env}
        try:
            with mock.patch.dict(os.environ, values):
                importlib.reload(hook)
                env = hook.GIT_ENV
                args = hook.FETCH_ARGS[:hook.FETCH_ARGS.index("fetch")]
        finally:
            importlib.reload(hook)
        extra = [f"-c", f"{config}={askpass}"] if config else []
        subprocess.run(["git", *extra, "-c", "credential.helper=", *args, "credential", "fill"],
                       input="protocol=https\nhost=example.invalid\n\n", env=env,
                       capture_output=True, text=True, timeout=5)
        return asked.exists()

    def test_inherited_askpass_programs_are_never_started(self):
        self.assertFalse(self.ask_for_credentials(["GIT_ASKPASS", "SSH_ASKPASS"], None))

    def test_configured_askpass_program_is_never_started(self):
        self.assertFalse(self.ask_for_credentials([], "core.askPass"))


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
        self.assertIn("delivery role", context)
        self.assertNotIn("\n\n", context)

    def test_a_git_surprise_never_drops_the_loader_line(self):
        with mock.patch.object(hook, "currency_notice", side_effect=RuntimeError("boom")):
            context = self.run_main(tempfile.mkdtemp())
        self.assertIn("manager:manager skill", context)


if __name__ == "__main__":
    unittest.main()
