import os
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("check-frontmatter.mjs").resolve()
PATHSPECS = ("plugins/*/skills/*/SKILL.md", "plugins/*/agents/*.md")
VALID = "---\nname: example\ndescription: Valid frontmatter\n---\n"


class CheckFrontmatterTest(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name).resolve()
        self.env = {key: value for key, value in os.environ.items()
                    if not key.startswith("GIT_")}
        self.env["GIT_CEILING_DIRECTORIES"] = str(self.root)

    def write(self, path, text=VALID):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")

    def git(self, *args):
        return subprocess.run(["git", *args], cwd=self.root, env=self.env,
                              capture_output=True, text=True, check=True).stdout

    def check(self, **env):
        return subprocess.run(["node", str(SCRIPT)], cwd=self.root,
                              env={**self.env, **env}, capture_output=True, text=True)

    def test_non_git_valid_tree_skips_nonmatches_and_excluded_directories(self):
        for path in ("plugins/a/skills/s/SKILL.md", "plugins/a/agents/role.md",
                     "plugins/a/agents/line\nbreak.md"):
            self.write(path)
        for path in ("plugins/a/SKILL.md", "plugins/a/skills/SKILL.md",
                     "plugins/a/skills/s/SKILL.md.bak", "plugins/a/agents/role.txt",
                     "elsewhere/plugins/a/agents/role.md",
                     "node_modules/plugins/a/agents/bad.md",
                     "plugins/a/node_modules/agents/bad.md",
                     "plugins/a/.git/agents/bad.md"):
            self.write(path, "bad frontmatter\n")

        result = self.check()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, "check-frontmatter: 3 files parse as strict YAML\n")
        self.assertEqual(result.stderr, "")

    def test_non_git_failures_match_git_selection_order_and_format(self):
        for path in ("plugins/z/skills/s/SKILL.md",
                     "plugins/a/skills/s/deep/SKILL.md",
                     "plugins/a/agents/sub/y.md", "plugins/a/skills/s/agents/x.md",
                     "plugins/a/agents/z.md", "plugins/a/agents/A.md",
                     "plugins/group/a/agents/role.md",
                     "plugins/a/agents/skills/s/SKILL.md",
                     "plugins/a/agents/.hidden.md", "plugins/a/agents/a/role.md",
                     "plugins/a/agents/a.md", "plugins/a/agents/\ue000.md",
                     "plugins/a/agents/\U00010000.md", "plugins/a/README.md"):
            self.write(path, "bad frontmatter\n")

        non_git = self.check()
        self.git("init", "--quiet")
        self.git("config", "core.quotePath", "false")
        self.git("add", "--force", ".")
        selected = self.git("ls-files", "--", *PATHSPECS).splitlines()
        tracked = self.check()

        self.assertEqual(non_git.returncode, 1, non_git.stderr)
        self.assertEqual(tracked.returncode, 1, tracked.stderr)
        self.assertEqual(non_git.stdout, "")
        self.assertEqual(non_git.stderr, "\n".join(
            f"{path}: no frontmatter block" for path in selected)
            + '\n\nQuote a value that contains ": " or starts with a YAML indicator.\n')
        self.assertEqual(non_git.stdout, tracked.stdout)
        self.assertEqual(non_git.stderr, tracked.stderr)

    def test_git_ignores_untracked_bad_frontmatter(self):
        self.write("plugins/a/skills/s/SKILL.md")
        self.git("init", "--quiet")
        self.git("add", ".")
        self.write("plugins/a/agents/untracked.md", "bad frontmatter\n")

        result = self.check()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, "check-frontmatter: 1 files parse as strict YAML\n")
        self.assertEqual(result.stderr, "")

    def test_other_git_failure_does_not_fall_back(self):
        self.write("plugins/a/skills/s/SKILL.md")
        self.write("bin/git", "#!/bin/sh\necho 'fatal: simulated git failure' >&2\nexit 128\n")
        (self.root / "bin/git").chmod(0o755)

        result = self.check(PATH=str(self.root / "bin") + os.pathsep + self.env["PATH"])
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "")
        self.assertIn("fatal: simulated git failure", result.stderr)


if __name__ == "__main__":
    unittest.main()
