---
name: content-creator
version: 0.1.0
description: "MANDATORY — read and follow before drafting any content with the user as the assumed author: public posts (X, Xiaohongshu, blog, essays, Telegram), platform adaptations, and governance documents (Vision, principles, rules, decision records). This Skill is the single home for all such writing rules; invocation is required every time, and drafts must never be produced from memory or habit."
---

# Content Creator

Manager-invoked interactive runbook for turning vault ideas into publishable content. Produces a canonical long-form essay as the cross-language SSOT, then adapts it into platform-specific posts, with optional image generation. Seven stages, each with clear handoffs and user gates.

## What This Skill Does

Orchestrates the full content creation pipeline as a manager-driven workflow:

- **Discovery** (non-interactive): searches the user's vault for candidate topics based on caller-supplied search parameters.
- **Topic confirmation** (interactive): presents candidates through the active runtime's user-decision surface.
- **Outline co-creation** (interactive, bounded): manager drafts an outline, user confirms or iterates.
- **Drafting** (non-interactive): manager dispatches knowledge-worker(s) to draft the canonical long-form essay and platform-adapted posts, with strict bilingual native-conception constraints.
- **User review** (interactive, bounded): user reviews all text drafts.
- **Image generation** (non-interactive, optional): manager uses the active runtime's native image-generation capability under the progressively loaded image contract.
- **Wrap-up** (non-interactive): saves final artifacts, writes the publish draft to today's journal, hands control back to caller for any post-completion bookkeeping.

The skill is **generic and reusable** — it does not hardcode trigger times, specific platforms, output paths, or recurrence logic. Those are supplied by the calling TaskNote's `agent_instructions`.

## Seven-Stage Flow

### Stage 1: Discovery

Search the user's vault for candidate topics. The caller supplies search parameters (which sources to query, exclusion rules, depth). Search the caller's tiers by priority and stop once a handful of live candidates surface — skip anything already marked done, and don't exhaust every tier. Carry each candidate forward with its tier and a one-line summary, which is what Stage 2 presents.

**Vault-dry fallback**: if all tiers return nothing, try `readwise/` recent highlights as a last resort (`obsidian search query="keyword" path="readwise" format=json`). If still empty, report "vault dry" to user and offer to skip.

**External-comparison topics**: if the topic direction rests on a contrast with how others / the mainstream do things, or references current tools / state of the art, read references/freshness.md and web-search the current baseline now.

### Stage 2: Topic Confirmation

Present candidates through the active runtime's native decision surface. If no
structured decision tool is available, ask directly in chat. Max 4 options: the
top 3 candidates, each described by its tier source and one-line summary, plus
"Reselect / Skip today" last.

**Reselect**: expand search scope (caller defines how — e.g., widen date range) and rerun Stage 1. User may reselect repeatedly; manager never auto-decides topic direction.

**Skip today**: enter references/anti-perfectionism.md#Skip Protocol.

### Stage 3: Outline Co-Creation

No timeout. Manager drafts 1 candidate outline in chat:

- **Hook** (1-2 sentences): opening hook.
- **Three-section structure** (1 sentence each): content body progression.
- **Platform adaptation direction** (1-2 sentences): once the canonical essay's argument is set, how each target platform will take a different compression angle.

The user accepts the outline, asks for a specific revision, or asks for an alternative; revise or draft a second outline and confirm again. **When outline iteration stops converging, put it to the user as a decision — keep the current outline and proceed to drafting, or skip today. The user decides.**

Outline granularity: directional, not line-by-line. Leave prose execution space for Stage 4 workers. The outline is the cross-language SSOT: it contains only argument structure (thesis points), never language-specific metaphors or imagery, because imagery conceived in one language turns into translationese in the other. Each language's writer will find their own idiomatic expressions from this skeleton.

### Stage 4: Drafting

Manager dispatches knowledge-worker(s). Two sub-stages:

**Author + Reader declaration**: every Stage 4 drafting directive declares `Author:` + `Reader:` per `references/writing-craft.md`. Content Creator defaults to `Author: Yu Bai（代笔）`; derive a concrete `Reader:` from the relevant platform reference. The canonical essay uses the blog reader; adaptations use their platform reader.

#### Stage 4a: Canonical Long-Form Essay

Draft a complete canonical essay (the content SSOT) based on the confirmed outline. The canonical essay's language is determined by the caller's parameters.

#### Stage 4b: Platform Adaptation

- **Same-language adaptation** (e.g., XHS from Chinese canonical essay): editorial compression — preserve argument skeleton, adjust length/structure/tone for platform. Read the relevant `references/platform-*.md` for format constraints.
- **Cross-language adaptation** (e.g., English X thread from Chinese canonical essay): independently conceived from the outline skeleton using the target language. **Not a translation.**

Platform reference files live in `claude/skills/content-creator/references/platform-*.md`. Manager reads the relevant ones and includes format constraints in worker directives.

**Before writing any drafting directive that makes external-world claims** (what others do, current tools / models, what's new / trending), read references/freshness.md, web-search the current state, and feed verified facts into the directive.

#### Bilingual Native Conception

Three rules keep each language natively conceived:

1. **Each language is natively conceived from the argument skeleton.** Whatever language you are writing in, think and write in that language from the start. Never draft in one language and translate into another.
2. **Chinese and English are drafted by separate workers who do not see each other's output.** The Chinese writer does not read the English draft; the English writer does not read the Chinese draft. This structurally prevents the translation path. Each worker delivers their draft in the report; manager integrates into the output file.
3. **Manager's outline/directive gives only argument skeleton — no pre-planted metaphors from any single language.** If the outline's imagery was conceived in English (e.g., "lens," "weld-to-eyes," "tattoo," "apartment"), feeding it into a Chinese directive causes the worker to faithfully translate it into Chinese translationese. Concrete imagery is left to each worker to find in their target language. Provide only language-neutral thesis points.

#### Voice and Writing Craft

This Skill is the single authoritative voice reference for all content with the user as the assumed author. Worker directives must reference `references/writing-craft.md` (voice target, craft rules, gates); include its Chinese rules verbatim in Chinese drafting directives. For governance documents (Vision, principles, rules, decision records), use `references/governance-docs.md` instead of the public-voice register.

#### Stage 4→5 Gate: Chinese Naturalness Verification

Before showing a Chinese draft, have a verifier (chosen per [`manager` plugin skills/manager/references/evidence.md](https://github.com/byheaven/byheaven-skills/blob/main/plugins/manager/skills/manager/references/evidence.md)) check the Chinese hard rules and the Author × Reader voice on the full draft; the user still judges public voice and taste.

### Stage 5: User Review (Text)

Manager displays all text drafts in chat rather than inside a structured
decision option, because mobile clients truncate long content. Then use the
active runtime's native decision surface:

- Finalize text, proceed to images (Recommended)
- Revise Chinese drafts
- Revise English drafts
- Scrap, skip today

If the structured surface lacks a suitable multi-select path, accept a
free-form reply in chat. Revision rounds follow references/anti-perfectionism.md.

### Stage 6: Image Generation (Optional)

Manager uses the active runtime's native image-generation capability.
Text drafts must be finalized before this optional stage. Read
references/image-generation.md in full only when
images are requested. That reference owns capability discovery, prompt
construction, file handling, review, and failure behavior. Do not infer a CLI,
credential path, or output directory from a stale machine snapshot.

### Stage 7: Wrap-Up

All drafts (text + images) are saved to the caller-specified output path. Then write the finalized platform posts as one publish draft in today's journal; that draft is marked `草稿`. Flow on MUSE publishes it after Yu confirms, so the skill ends once the draft is written. Manager then performs caller-specified post-completion actions (e.g., logging a completion record, recurrence reset).

**Output frontmatter must include `author` + `reader`** — this reusable public-content contract requires both (byheaven vault: `claude/rules/document-architecture-rules#Authority and lifecycle`). Set `author` to the ghostwritten human (e.g. `"Yu Bai"`); set `reader` to a **concrete** persona description (not a category like "投资人"/"读者"), as a YAML list when the piece serves multiple platforms/languages. Reuse the same Author×Reader that drove the Stage 4 drafting directives — the gate is that the saved artifact carries them, not just the directive.

The caller's TaskNote `agent_instructions` defines what happens at wrap-up (e.g., Timeline/Decisions entry, 1-2-3-4 recurrence reset, scheduled bump). The skill does not prescribe these.

## Boundaries

- The caller's TaskNote supplies trigger times, platforms, output paths, recurrence, and post-completion bookkeeping.
- This Skill is the single home for all writing rules for content with the user as the assumed author. Do not duplicate voice rules in USER.md or elsewhere.
- Whether to publish stays with Yu: agents write `草稿` drafts only, and Flow publishes what Yu confirmed.
- Source ideas come from the user's vault; current external claims follow the freshness reference.
- Workers receive the needed craft rules in their directive; only the Manager consumes this Skill.

## Cross-References

- references/writing-craft.md — Voice target, Author × Reader, Public Voice Gate, Chinese hard rules, and English long-form rules (single voice authority)
- references/governance-docs.md — Register for Vision, principles, rules, and decision records
- references/anti-perfectionism.md — revision bounds, skip protocol, and recovery branches
- references/freshness.md — current external-claim grounding
- `references/platform-xhs.md` — Xiaohongshu format constraints
- `references/platform-x.md` — X (Twitter) format constraints
- `references/platform-blog.md` — Blog/long-form format constraints
- `references/platform-telegram.md` — Telegram channel format constraints
- references/image-generation.md — progressive
  Stage 6 contract, loaded only when images are requested
- TaskNote contract for caller integration (byheaven vault: `claude/rules/tasks-rules`)
