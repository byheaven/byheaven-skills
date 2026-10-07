---
name: content-creator
version: 0.2.0
description: "MANDATORY — read and follow before drafting any content with the user as the assumed author: public posts (X, Xiaohongshu, blog, essays, Telegram), platform adaptations, and governance documents (Vision, principles, rules, decision records). This Skill is the single home for all such writing rules; invocation is required every time, and drafts must never be produced from memory or habit."
---

# Content Creator

The single authoritative voice and drafting system for all content with the user as the assumed author. Invoke before drafting begins — never draft from memory or habit.

## When to invoke

Any time an agent drafts text that will go out as Yu Bai: social posts, essays, blog articles, governance documents — or transforms his raw captures into publishable form.

## Voice and Writing Craft

`references/writing-craft.md` is the single voice authority: voice target, Author × Reader, public voice gate, Chinese hard rules, English long-form rules. Read it before drafting; carry the Chinese rules verbatim into Chinese drafting directives. For governance documents, use `references/governance-docs.md` instead of the public-voice register.

## Drafting flows

### Flow A — Quick-capture #x (hourly)

Source: `#x` bullets in the journal's quick-capture section. One piece of content, two platform versions:

- **X (English)**: fix grammar, keep the author's tone and edge. If the source is Chinese, render it into idiomatic English — never a literal translation.
- **Xiaohongshu (Chinese)**: if the source is Chinese, polish it; if English, render into idiomatic Chinese. Same voice.
- **Disposition**: X posts the English version directly via browser task; Xiaohongshu saves the Chinese version as a draft via browser task — the user reviews and sends it personally, never auto-publish there.
- **Receipt**: append under the bullet: `  - Published: X <link>（YYYY-MM-DD HH:MM）/ 小红书草稿已存`. If a platform's browser login is down: notify the user once (which platform needs re-login), mark `  - pending-login:<platform>`, continue the other platform normally; stay silent in later rounds until login recovers.

Bilingual rule: each language is natively conceived from the argument skeleton — think and write in that language from the start, never draft-then-translate.

### Flow B — User-initiated posts ("x" messages)

The user sends a topic (often prefixed `x`). Draft Chinese and English versions independently — natively conceived, never translated from each other — present both for confirmation, and publish only after he confirms. Chinese → @byoldspaper, English → @byheaven0912, via the cloud browser's account switcher. After publishing, save copy + links under the day's journal "Daily Output" section: one bullet per post, first line time + account + link, full text indented below. This path confirms every time — never reuse the quick-capture direct-publish authorization here.

### Flow C — Long-form essays

Canonical essays (e.g. 刷机脑图 / Post-train Your Brain pieces): declare `Author:` + `Reader:` per `references/writing-craft.md` before drafting — a concrete reader persona, never a category. One sharp explanation model per piece; the outline carries only argument skeleton, never language-specific imagery. Chinese and English versions are drafted independently from the skeleton.

### Flow D — Governance documents

Vision, principles, rules, decision records: follow `references/governance-docs.md` (register) and load the canonical document-architecture rules named there.

## Boundaries

- Whether to publish stays with Yu: agents write `草稿` drafts only, and Flow publishes what Yu confirmed — except the quick-capture #x X path, which carries its own standing authorization.
- Do not invent content: transform what he gave; never add claims, examples, or positions beyond his words.
- Source ideas come from the user's vault; current external claims follow `references/freshness.md`.
- Revision rounds follow `references/anti-perfectionism.md`.

## Cross-References

- `references/writing-craft.md` — voice target, Author × Reader, public voice gate, Chinese/English rules (single voice authority)
- `references/governance-docs.md` — governance document register
- `references/platform-x.md` — X (Twitter) writing format
- `references/platform-xhs.md` — Xiaohongshu writing format
- `references/platform-blog.md` — blog/long-form writing format
- `references/platform-telegram.md` — Telegram writing format
- `references/freshness.md` — grounding for external claims
- `references/anti-perfectionism.md` — revision bounds, skip protocol
