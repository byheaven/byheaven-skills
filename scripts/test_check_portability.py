import importlib.util
import tempfile
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location(
    "check_portability", Path(__file__).with_name("check-portability.py"))
check = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(check)

SHARED = "plugins/demo/skills/demo/SKILL.md"
ADAPTER = "plugins/demo/skills/demo/agents/openai.yaml"


def scan(files):
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        for rel, text in files.items():
            path = root / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        return check.scan(root)


class CheckPortabilityTest(unittest.TestCase):
    def test_flags_host_coupling_in_shared_files(self):
        for line in ("Use codex for every task.", "Ask with AskUserQuestion.",
                     'root = os.environ["CLAUDE_PLUGIN_ROOT"]', "Call functions.exec_command.",
                     "Run claude -p here.", "Pick gpt-6 for this.", "Read $PLUGIN_ROOT/x.",
                     "Read ${CLAUDE_PLUGIN_ROOT}/skills/x.md.",
                     "Use TaskOutput to wait."):
            with self.subTest(line=line):
                self.assertTrue(scan({SHARED: line}))

    def test_flags_deployment_data_anywhere_in_plugins(self):
        for line in ("Send to 4FE92719-BF44-4DFD-8423-4E78476761F0.", "/home/alice/notes.md",
                     "Mail owner@example.com.", "See [[AI/rules/tasks-rules]]."):
            with self.subTest(line=line):
                self.assertTrue(scan({ADAPTER: line}))

    def test_flags_shared_files_with_any_extension_or_license_like_name(self):
        self.assertTrue(scan({"plugins/demo/skills/demo/run.mjs": "codex"}))
        self.assertTrue(scan({"plugins/demo/skills/demo/LICENSE-routing.md": "codex"}))
        self.assertTrue(scan({"plugins/demo/skills/demo/LICENSE-routing": "4fe92719-bf44-4dfd-8423-4e78476761f0"}))

    def test_role_frontmatter_is_adapter_but_body_is_shared(self):
        role = "plugins/demo/agents/worker.md"
        self.assertEqual(scan({role: "---\nname: worker\nmodel: claude-sonnet-4-6\n---\n\nWork.\n"}), [])
        self.assertTrue(scan({role: "---\nname: worker\n---\n\nUse spawn_agent.\n"}))

    def test_accepts_capabilities_placeholder_and_adapters(self):
        self.assertEqual(scan({
            SHARED: "Ask through the host's user-question tool.\n"
                    "Read references/x.md and ~/<repo>.\n",
            ADAPTER: "policy:\n  allow_implicit_invocation: false  # Codex\n",
            "plugins/demo/skills/demo/LICENSE": "Copyright Claude Shannon",
            "plugins/demo/hooks/hook.py": "os.environ['CLAUDE_PLUGIN_ROOT']",
            "plugins/demo/skills/demo/setup.md": "Link CLAUDE.md to AGENTS.md; see agents/openai.yaml.\n",
            "plugins/demo/skills/demo/check.sh": 'if [[ -z "$VERSION" ]]; then exit 1; fi\n',
            "plugins/demo/hooks/hook.test.tsx": "install('demo@market.notify')\n",
        }), [])


if __name__ == "__main__":
    unittest.main()
