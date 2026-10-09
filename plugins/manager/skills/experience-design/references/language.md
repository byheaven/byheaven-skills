# Language conventions

The project's own style guide or design system wins where it defines a convention; these are the defaults where it does not. Apply them consistently across one product: one choice per element type, everywhere.

## Simplified Chinese

- Address the user as 你, never 您; keep one perspective per sentence instead of mixing 你 and 我.
- Plain spoken words over formal or literary ones: 此 rather than 该 for "this"; no 文雅 stock phrases.
- Full-width punctuation inside Chinese sentences, with no spaces around it; an embedded English sentence or a product name keeps its own punctuation. Avoid stacked marks such as ！！.
- A space between Chinese and Latin letters or digits (「3 个」「AI 伙伴」); no space before % or °.
- Half-width Arabic digits for quantities, statistics, prices, dates, and times; words where the number is part of the vocabulary (星期一, 一起, 再来一局) stay in characters.
- Buttons, titles, labels, tabs, and input placeholders carry no 句号; a toast or message of more than one sentence keeps its punctuation.
- Buttons are verbs or verb phrases of two to four characters where the meaning allows (「保存」「再来一局」).
- 感叹号 only for greeting or celebration; 抱歉 only when the system caused the problem.
- Pick one ellipsis form per product (「……」 in running text by general Chinese typesetting; Ant Design uses 「…」 in compact UI), the dash 「——」 when needed, and one quotation style, either 「」 or “”.
- Chinese text needs looser leading than Latin (about 1.6 to 1.8 for body text) and takes emphasis from weight or color, never italics or letter spacing.
- Line breaks never start a line with closing punctuation (，。、」）.

## English

- Sentence case for buttons, labels, and titles unless the platform mandates otherwise (Apple alert buttons use title case); one capitalization style per element type.
- No ending period on buttons, labels, or fragment titles; a full-sentence message keeps its period.
- Verbs that match the input device: tap on touch, click with a pointer.
- Avoid "we" and needless possessives ("Favorites", not "Your Favorites"); write "Unable to load photos" rather than "We couldn't load your photos".
- No "Click here" or "Learn more" without context: link text names its destination.
- Contractions are fine where the voice is conversational; one choice across the product.

## Any language

- Quantities as digits, with units the user reads every day; large numbers in the locale's own grouping (万/亿 in Chinese, K/M only where the audience uses them).
- Write whole messages with reorderable variables; never assemble sentences from fragments.
- Leave space for length change between languages instead of abbreviating early.
- Color or punctuation never carries the message alone; an icon may, when its meaning is unambiguous to the audience and it has an accessible name.
