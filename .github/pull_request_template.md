## Summary

<!-- What does this PR do? 1–3 bullet points. -->

-
-

## Judge

<!-- Required when this PR changes rule text: plugins/*/skills, plugins/*/agents,
or the root AGENTS.md / CLAUDE.md (CI checks it).
Name the independent judge's model family, e.g. "Judge: GPT (Codex, GPT-6)".
Without a cross-model judge: "Judge: same-family (Claude), reason: <why>"; without any: "Judge: none, reason: <why>". -->

Judge:

## Type of change

- [ ] New plugin
- [ ] New skill / command in existing plugin
- [ ] Bug fix
- [ ] Refactor / cleanup
- [ ] Documentation
- [ ] CI / configuration

## Checklist

- [ ] `markdownlint` passes (`npm run lint:md`)
- [ ] Plugin structure and harness independence follow `AGENTS.md` (`npm run check:portability`)
- [ ] `marketplace.json` updated (if new plugin added)
- [ ] Self-reviewed the diff
- [ ] Documentation updated if needed
