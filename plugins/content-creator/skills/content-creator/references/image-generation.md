---
parent: content-creator
purpose: "Runtime-neutral Stage 6 contract for optional editorial image generation"
---

# Image Generation

Load this file only after text review is complete and the caller requests
images.

## Capability Discovery

Use the active runtime's native image-generation tool or skill. Verify its
current input schema, output behavior, and supported edit path from the live
runtime before invoking it. Do not shell out to another agent runtime merely to
reach image generation, and do not assume a fixed credential, cache, or output
directory.

If no native capability is available, tell the user and offer text-only
completion or a later retry. Never replace model image generation with scripted
text rendering (PIL, matplotlib, ImageMagick, or equivalent) or a direct image
API script.

## Prompt Construction

Send the complete finalized drafts and ask the image model to select the key
sentences and useful image count. Give high-level editorial direction, not a
per-image template:

- Separate language groups; never mix Chinese and English on one image.
- Use one simple abstract visual concept per image.
- Keep text minimal and prominent: one key sentence, at most one small
  subtitle, no paragraphs.
- Use generous whitespace and a restrained composition.
- Use a pure black background with `#FFD700` as the primary color.
- Avoid clickbait treatments, characters, neon, emoji, starbursts, speed
  lines, busy patterns, and motivational-poster styling.

Do not dictate typography ratios, exact layouts, or the final count. A useful
default range is 3-5 images per language, but content need can justify fewer.

## File Handling

Save generated files to the caller-specified vault output directory using the
active runtime's returned file handles or paths. When replacing an image, use a
new filename so Obsidian's path-based thumbnail cache cannot display the old
asset. Resize only when the platform contract requires exact dimensions by
resampling the existing image (scripted rendering: see Capability Discovery
above).

## Verification and Review

Visually inspect every generated image. Chinese image text must pass the
Chinese hard rules in
writing-craft.md#Chinese Hard Rules
independently of the source draft.

Show the images to the user and offer three paths through the runtime's native
decision surface or direct chat:

1. Accept and continue to wrap-up.
2. Revise images.
3. Skip images and continue with text only.

Use the same two-round revision cap as text review.
