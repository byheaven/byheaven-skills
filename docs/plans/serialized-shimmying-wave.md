# Plan: Add AGENTS.md/CLAUDE.md Unification to Existing Skills

## Context

Multiple AI coding tools read different config files: Claude Code reads `CLAUDE.md`, OpenAI Codex reads `AGENTS.md`. Maintaining two identical files is error-prone. The solution: make `AGENTS.md` the single source of truth and `CLAUDE.md` a symlink. Writes to either path transparently update the same file.

No new skill — integrate into existing files only.

## Files to Modify (8 total)

| # | File | Change |
|---|------|--------|
| 1 | `plugins/newproject/skills/project-scaffold/SKILL.md` | Add detection in Step 0, replace Step 9 with AGENTS.md unification + symlink logic |
| 2 | `plugins/newproject/commands/newproject.md` | Add AI config detection in Step 1, add checklist item in Step 2 (no execution logic — `project-scaffold` handles it) |
| 3 | `plugins/newproject/skills/ci-pipeline/SKILL.md` | Rename "Update CLAUDE.md" → "Update AGENTS.md", change all CLAUDE.md refs to AGENTS.md |
| 4 | `plugins/newproject/skills/code-quality/SKILL.md` | Same as above |
| 5 | `plugins/newproject/skills/release-workflow/SKILL.md` | Same as above |
| 6 | `plugins/newproject/skills/github-repo-setup/SKILL.md` | Same as above |
| 7 | `plugins/newproject/skills/dependency-management/SKILL.md` | Same as above |
| 8 | `plugins/newproject/skills/security-scanning/SKILL.md` | Same as above |

---

## Change 1: `project-scaffold/SKILL.md` (main logic)

### Step 0 — Add AI config detection

Append to the existing detection block:

```bash
# AI config files
ls -la CLAUDE.md AGENTS.md 2>/dev/null
file CLAUDE.md AGENTS.md 2>/dev/null
```

### Replace Step 9: "Update CLAUDE.md" → "Update AGENTS.md (with CLAUDE.md symlink)"

Current Step 9 creates/updates CLAUDE.md directly. Replace with full 4-state unification:

| State | Condition | Action |
|-------|-----------|--------|
| Already unified | CLAUDE.md is symlink → AGENTS.md | Just ensure `## Contributor Conventions` section exists in AGENTS.md |
| A — Neither exists | No CLAUDE.md, no AGENTS.md | Create AGENTS.md (template below), `ln -s AGENTS.md CLAUDE.md` |
| B — Only CLAUDE.md | CLAUDE.md exists, not a symlink | `mv CLAUDE.md AGENTS.md`, normalize `# CLAUDE.md` title → `# AGENTS.md`, `ln -s AGENTS.md CLAUDE.md` |
| C — Only AGENTS.md | AGENTS.md exists, no CLAUDE.md | `ln -s AGENTS.md CLAUDE.md` |
| D — Both exist | Both are regular files | Smart merge → AGENTS.md, `rm CLAUDE.md && ln -s AGENTS.md CLAUDE.md` |

After handling the state, ensure AGENTS.md has a `## Contributor Conventions` section (same content as current Step 9, just targeting AGENTS.md).

#### Minimal AGENTS.md Template (State A)

```markdown
# AGENTS.md

This file provides guidance to AI coding assistants (Claude Code, OpenAI Codex,
and others) when working with code in this repository.

## Contributor Conventions

Follow [CONTRIBUTING.md](CONTRIBUTING.md) for all contribution conventions.
```

#### Merge Algorithm (State D)

1. Read both files, parse into sections by `##` headers
2. Show merge preview via `AskUserQuestion` (sections kept / appended / deduplicated)
3. AGENTS.md sections kept as base, unique CLAUDE.md sections appended
4. Normalize title `# CLAUDE.md` → `# AGENTS.md`
5. Replace CLAUDE.md with symlink

---

## Change 2: `newproject.md` (orchestrator — detection + checklist only)

No execution logic here — `project-scaffold` handles it.

### Step 1 — Add AI config detection

Append to existing detection bash block:

```bash
# AI config files
ls -la CLAUDE.md AGENTS.md 2>/dev/null
file CLAUDE.md AGENTS.md 2>/dev/null
```

### Step 2 — Add checklist item (both Path A and Path B)

Note under `project-scaffold` or as a sub-item that it now handles AGENTS.md unification:

```
  ☑ project-scaffold   — README, LICENSE (MIT), .gitignore, .editorconfig, AGENTS.md + CLAUDE.md symlink
```

Already-done check: CLAUDE.md is a symlink to AGENTS.md → part of the ✅ condition for project-scaffold.

---

## Change 3: Other 6 Skills — Rename CLAUDE.md → AGENTS.md

Each of these skills has a final step titled "Update CLAUDE.md" with a 3-case pattern. Apply the same transformation to all 6:

1. Step title: `Update CLAUDE.md` → `Update AGENTS.md`
2. Description text: `CLAUDE.md` → `AGENTS.md`
3. The "if doesn't exist" template: change `# CLAUDE.md` heading and "Claude Code" → broader "AI coding assistants" wording
4. All `CLAUDE.md` file references in the 3-case logic → `AGENTS.md`

The 6 files:

- `skills/ci-pipeline/SKILL.md` (Step 6)
- `skills/code-quality/SKILL.md`
- `skills/release-workflow/SKILL.md`
- `skills/github-repo-setup/SKILL.md`
- `skills/dependency-management/SKILL.md`
- `skills/security-scanning/SKILL.md`

---

## Verification

1. **Clean project**: run `project-scaffold` alone — creates AGENTS.md + symlink CLAUDE.md
2. **Only CLAUDE.md exists**: moves to AGENTS.md, creates symlink
3. **Only AGENTS.md exists**: creates symlink only
4. **Both exist**: shows merge preview, merges, creates symlink
5. **Already symlinked**: skips gracefully, just ensures Contributor Conventions section
6. **Post-unify**: run `ci-pipeline` — its "Update AGENTS.md" step writes directly to AGENTS.md
