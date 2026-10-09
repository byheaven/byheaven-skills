# Sources

The rules in this skill are distilled from the sources below, checked on 2026-10-09. They are paraphrased; no source text is reproduced.

## Where the rules come from

| Rule area | Sources |
|---|---|
| Earn its place; subtract first | Krug, *Don't Make Me Think* (omit needless words; happy talk and instructions must die); Rams, ten principles ("less, but better"); Nielsen heuristic 8; Apple HIG design principles and Writing; Colborne, *Simple and Usable* (remove, organize, hide, displace) |
| Self-evident design over explanation | Krug; Norman, *The Design of Everyday Things* (signifiers, mapping, feedback, constraints, knowledge in the world); Nielsen heuristics 6 and 10; Apple HIG Onboarding |
| Contrast, repetition, alignment, proximity | Williams, *The Non-Designer's Design Book*; Refactoring UI (hierarchy, labels as a last resort, de-emphasis) |
| Feedback proportional to importance; undo over confirmation | Apple HIG Feedback and Alerts; Nielsen heuristics 1, 3, 5; Norman |
| Teach by doing; one concept at a time | Apple HIG Onboarding; WeChat mini game design guide; Nintendo's World 1-1 practice; Hodent, *The Gamer's Brain*; Roblox onboarding guide; Facebook Instant Games best practices |
| Copy: user's words, one term, verbs, errors, empty states | Apple HIG Writing and Alerts; Ant Design copywriting spec; Microsoft Writing Style Guide; Shopify Polaris content; Atlassian error messages; NN/g error message guidelines; Strunk and Orwell on plain, active, concise writing |
| Tone follows the moment | Apple HIG Writing; Mailchimp voice and tone; Tencent ISUX on playful copy |
| Chinese conventions | Ant Design copywriting spec; 中文文案排版指北 (sparanoid/chinese-copywriting-guidelines); Feishu multilingual design spec |
| Game feedback and juice | Schell, *The Art of Game Design* (lenses of transparency, feedback, juiciness); Swink, *Game Feel*; Duolingo streak milestone design |
| Audit flow, deletion of repeated text, delight scaled to effort, machine-made tells | pbakaus/impeccable 4.5.2 (commit d631a88, Apache License 2.0): clarify, distill, onboard, delight, craft-floor references and detector rules; ideas adapted, no text copied |
| Five-second and trunk tests | Krug; Facebook Instant Games |

## Conflicts between sources and how this skill settles them

- **Minimalism against signifiers.** Rams and Nielsen push to strip; Norman, Krug, and Apple warn that stripping removes cues. Settled: remove information, keep every cue that shows what can be acted on.
- **Dropping labels against accessibility.** Refactoring UI drops labels the format explains; Apple requires labeled fields and accessible names. Settled: visible labels may go only where the format is unambiguous; form fields keep labels; accessible names always stay.
- **Confirming risky actions.** Nielsen suggests confirmation; Apple prefers undo for common destructive actions. Settled: undo first, confirmation only for uncommon irreversible actions.
- **Success feedback.** Games give feedback on everything; Apple confirms success only for significant tasks. Settled: every action gets immediate ambient feedback; explicit celebration only for effortful outcomes.
- **Humor.** Playful guides allow it in errors; Apple and NN/g do not. Settled: personality in success and idle moments, plain words in failure, money, privacy, and loss.
- **Tutorials.** Research finds tutorials add little to simple games; platform reviews require visual teaching. Settled: no separate tutorial for simple play; the first round teaches.
- **Seven plus or minus two.** Often used as a cap; Laws of UX rejects that use. Settled: chunk, do not cap.
