---
name: content-creator
version: 0.4.0
description: "Writing brief and drafting method for any writing task: product and interface copy, posts (X, Xiaohongshu, blog, Telegram), articles, introductions, documents written to be read such as a Vision or a PRD, and messages sent on the user's behalf. Use before drafting or revising any of them."
---

# Content Creator

Every writing task starts with a **writing brief** that the user approves, and the draft follows that brief. Style is chosen for each piece from its reader and purpose.

A **writing task** is text whose value lies in how a human reader receives it: product and interface copy, posts, articles, introductions, documents written to be read such as a Vision, principles, or a PRD, and messages sent on the user's behalf. Conversation replies, status updates, code, commit and PR text, instructions for agents (skills, rules, charters, directives), and documents that record facts for reference (decision records, product behavior documents, architecture, runbooks, reviews) are not writing tasks. The user's global instructions carry the same definition.

## 1. Writing brief

Show the user the brief before drafting or revising, and draft only after the user approves it.

- **Author**: who is speaking, as a specific person or voice (Yu Bai; the AMIO companion; the AMIO team).
- **Reader**: one specific person in a specific moment, described by what they already know, what they care about, and what would convince them. A platform or a category ("players", "investors") is too broad.
- **Purpose**: what the piece should achieve, and what the reader takes away: the value (what they now know, can do, or can decide) and the feeling (how they feel about the subject and the author).
- **Style**: the style that best serves this reader and purpose (tone, register, rhythm, length, structure, how vivid or plain), with two or three concrete references that model it well: published works, writers, products, or pieces the user already approved, each with what to take from it.

Reuse what the project has settled, such as a product's brand voice, a document's agreed structure, or an approved brief for the same series, and name it in the brief. Done when the user approves the brief as written or as changed. One approved brief covers the task's drafts and revisions until its author, reader, or purpose changes.

## When the author is Yu Bai

His own writing is the voice source. Before writing the brief, read:

1. what he has already written on this topic (notes, journal entries, and the vault pages on it), for his positions and his sentences;
2. the voice samples he chose, listed in the byheaven vault at `pages/projects/output/voice-samples.md`;
3. `USER.md` in the vault, for his background and stance.

In the brief, the style references are the samples closest to this reader and purpose, each with one or two of his lines quoted as the target; an outside writer is added only for what his samples do not cover.

For a piece whose value is his own thinking (an essay, a blog post, an opinion post), he supplies the core: the argument and its key sentences. The draft keeps his sentences and writes what connects and completes them.

Yu's reading decides whether a draft sounds like him. When a second judge is needed, use a reviewer from another model family and give it the samples.

## 2. Draft

- Write to the approved brief. Where another style rule differs, the brief decides.
- Conceive each language in that language from the shared argument; a version in a second language is written from the argument by a writer who has not read the first version.
- Platform limits: `references/platforms.md`. Vision and governance documents: `references/governance-docs.md`. Revision rounds: `references/anti-perfectionism.md`.

## Floor

These hold whatever the brief says:

- When the user is the author, use his own claims, positions, and examples; organize and phrase them, and add none.
- Ground external claims per `references/freshness.md`; soften an unconfirmed claim to what is known, or cut it.
- The title and opening promise what the body delivers. Present motives you infer as your reading of them.
- Product copy also holds the `experience-design` skill's red lines.

## Boundaries

Whether to publish stays with the user unless a standing authorization covers the specific path.
