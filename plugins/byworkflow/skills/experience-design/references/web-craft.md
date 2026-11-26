# Web and UI craft

Design-engineering standards for **Stage 2 (engineering integration and polish)** on web and interactive UI surfaces. Keep this runtime and hygiene reference out of Stage 1 creative exploration ([Two stages for open design work](../SKILL.md#two-stages-for-open-design-work)), and load it right before wiring or polishing production UI code alongside the project's own design system and [platforms.md](platforms.md).

## Surface mode

Name the surface's mode before laying out pixels; ambition looks different in each:

- **Persuade and Experience** (landing pages, showcases, brand moments, games): commit to a distinct point of view rooted in the subject matter—one characteristic opening moment, deliberate composition, and expressive color or media.
- **Operate and Read** (workbenches, admin consoles, internal portals, dense documentation): ambition shows as precision, speed, density, restraint, and zero visual interference. Familiar patterns earn their place; decoration that slows scanning or navigation leaves.

## Visual calibration and color strategy

- Pick the **color strategy** before picking colors: *Restrained* (tinted neutrals plus one functional accent, the default for Operate and Read surfaces), *Committed* (one saturated color owns 30–60% of the surface), *Full palette* (3–4 named roles), or *Drenched* (the surface is the color). Choose light or dark from the real viewing scene and lighting, not as a reflex.
- Derive visual structure from the actual subject and content rather than current template clusters: skip reflexive cream-and-serif broadsheet styling, decorative `01 / 02 / 03` numbering on non-sequential items, single-word italic or accent highlights in headlines, cards nested inside cards, and mechanical fade-and-slide-up entrances on every section.

## Motion frequency and micro-interaction craft

Decide whether to animate by how often a person triggers the action:

- **High-frequency or keyboard-initiated actions** (100+ times/day: command palettes, top-level navigation switches, shortcuts, typing): **zero animation**—instant response beats decorative delay.
- **Repeated routine controls** (hover states, list selection): immediate and subtle (`<= 200ms`), without distracting travel.
- **Occasional transitions** (modals, drawers, popovers, toasts): purposeful, fast `ease-out` motion; anchor popovers to their trigger (`transform-origin`), enter from subtle scale and opacity (`scale(0.95)`) rather than `scale(0)`, and never animate with sluggish `ease-in`.
- **Rare or effortful moments** (first-time reveals, earned completions): one orchestrated moment rather than scattered micro-effects.

Animate compositor properties only (`transform`, `opacity`). Keep layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`) and `transition: all` off animations, give pressable controls subtle tactile `:active` feedback, pause looping animations off-screen, and honor `prefers-reduced-motion`.

## Runtime, layout, and typography floor

- **Zero-jank continuity:** supply known shell and identity state on SSR frame 0 instead of fetching it in a client effect that shifts layout after paint; use client-side soft navigation for intra-app route switches; reserve layout space for active bold/weight label shifts and scrollbars (`scrollbar-gutter: stable`) so persistent chrome stays pinned with zero drift.
- **Asset caching within auth boundaries:** serve immutable hashed fonts and stylesheets with appropriate caching (including private caching when behind authentication, keeping error responses uncached) so routine navigation never re-downloads webfonts or causes font flicker.
- **Typography and layout hygiene:** apply `text-balance` to headings, `text-pretty` to prose, `tabular-nums` to aligned or changing numbers, dynamic viewport units (`dvh`) over static `vh`, `safe-area-inset` on fixed edges, and a fixed `z-index` scale.
- **Interaction primitives:** reuse established accessible component primitives for keyboard, focus, and overlay behavior rather than hand-rolling focus traps, and model complex multi-state interactions explicitly so edge states are never missed.
- **Objective visual checks:** alongside live multi-viewport walkthroughs, an optional deterministic render-state visual scan—such as `bunx impeccable detect <url>` (or `npx -y impeccable detect <url>` where Bun is absent; `bunx` avoids npm failing on Bun `overrides`)—catches objective pixel-contrast failures over gradients and images, tiny text, cramped spacing, and skipped headings. Treat its output strictly as an **objective legibility and contrast floor**—zero scanner hits never proves aesthetic craft, originality, or freedom from generic templates or prose walls. Separate objective legibility failures from brand-intentional aesthetic choices, and never let a scanner replace full-page visual review or full-journey QA.
