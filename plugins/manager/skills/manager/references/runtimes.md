# Runtime bindings

Each binding maps Manager requirements to one host's mechanisms and adds no policy. Before a runtime-native action, read the binding for the host you run in.

| Host | Binding |
|---|---|
| Claude Code | [runtime-claude.md](runtime-claude.md) |
| Codex | [runtime-codex.md](runtime-codex.md) |
| Grok Bot | [runtime-grokbot.md](runtime-grokbot.md) |

On a host with no binding here, map each requirement to that host's own mechanism, and report a requirement the host cannot meet as blocked rather than approximating it.

Which bots, agent ids, machines, accounts, and model CLIs a deployment uses belong to that deployment's own binding, which the user's instructions name. These files name none of them.
