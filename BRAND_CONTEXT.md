# TaymPers Brand Context

This file converts the approved visual branding references into a written implementation standard.

Canonical visual references:

```text
assets/branding/Color Pallete.png
assets/branding/Typography.png
```

If this document and the approved branding images appear to conflict, inspect the images before inventing a new value.

## 1. Brand Character

TaymPers should feel:

- trustworthy
- modern
- community-centered
- useful and practical
- spatial / map-oriented
- civic without feeling bureaucratic
- friendly without becoming playful or childish

The interface should be clean, bright, readable, and confident. Avoid dark enterprise-dashboard styling, excessive glass effects, neon colors, or decorative visual noise.

## 2. Approved Color Roles

| Role | Hex | Intended use |
|---|---|---|
| Primary | `#0066FF` | Main brand color, active controls, key actions |
| Primary Light | `#66A3FF` | Hover states, highlights |
| Primary Lighter | `#E6F0FF` | Selected backgrounds, soft blue surfaces |
| Secondary | `#FFFFFF` | Supporting actions, white surfaces |
| Success | `#10B981` | Open, confirmation, positive/reliable states |
| Warning | `#FBBF24` | Caution, uncertainty, needs attention |
| Error | `#EF4444` | Closed, destructive/removal, negative states |
| Neutral 900 | `#0F172A` | Primary text |
| Neutral 600 | `#475569` | Secondary text |
| Neutral 300 | `#CBD5E1` | Borders and dividers |
| Neutral 100 | `#F1F5F9` | Surfaces and cards |
| Neutral 50 | `#FAFBFF` | Page background |

### Color behavior

- Blue is the primary interaction color.
- Green is semantic and should communicate open/positive/reliable/community-confirmed states, not be used randomly as decoration.
- Amber is for caution or improvement opportunity, not failure.
- Red is restrained and should be reserved for closed, invalid, destructive, report/removal, or error states.
- The map and surrounding surfaces should remain visually quieter than selected markers and actions.

### Runtime color tokens

The approved palette is mapped into the Tailwind theme and CSS custom properties in apps/web/src/styles/index.css. New user-facing UI should use these theme roles rather than inventing near-match hex values:

- Primary blue: blue-600 → #0066FF
- Primary light: blue-400 → #66A3FF
- Primary lighter: blue-50 / blue-100 → #E6F0FF
- Success: emerald-500 / emerald-600 → #10B981
- Warning: amber-400 / amber-500 → #FBBF24
- Error: red-500 / red-600 → #EF4444
- Primary text: slate-900 → #0F172A
- Secondary text: slate-500 / slate-600 → #475569
- Borders: slate-200 / slate-300 → #CBD5E1
- Surfaces: slate-100 → #F1F5F9
- Page background: slate-50 → #FAFBFF

Avoid near-match product colors such as #1677FF, #0878F9, #10234F, or similar one-off replacements when an approved role already exists.

## 3. Approved Typography

Primary typeface:

```text
Inter
```

Fallbacks may use modern system sans-serif fonts, but Inter is the intended design font.

Approved hierarchy:

| Style | Size / weight | Typical use |
|---|---|---|
| H1 | `32px / Bold` | Major page title / hero heading |
| H2 | `24px / Bold` | Main section heading |
| H3 | `20px / Semibold` | Section/card group heading |
| H4 | `16px / Semibold` | Compact heading / card title |
| Body | `16px / Regular` | Main readable content |
| Caption | `14px / Regular` | Supporting metadata |
| Small | `12px / Regular` | Compact secondary information |

### Typography behavior

- Prefer sentence case.
- Use weight and spacing to establish hierarchy before adding more colors.
- Service/provider names should remain easy to scan.
- Metrics can be compact but must remain readable.
- Do not shrink important information excessively to force desktop layouts onto mobile.

### Runtime typography tokens

The web app now loads **Inter locally** at the three approved product weights only: 400 Regular, 600 Semibold, and 700 Bold.

Do not reintroduce font-extrabold, font-black, or 800/900 weights into user-facing TaymPers UI. The shared runtime classes in apps/web/src/styles/index.css are the canonical implementation:

| Class | Desktop | Mobile |
|---|---|---|
| .sy-h1 | 32px / 700 | 28px / 700 |
| .sy-h2 | 24px / 700 | 22px / 700 |
| .sy-h3 | 20px / 600 | 18px / 600 |
| .sy-h4 | 16px / 600 | 16px / 600 |
| .sy-body | 16px / 400 | 16px / 400 |
| .sy-caption | 14px / 400 | 14px / 400 |
| .sy-small | 12px / 400 | 12px / 400 |

Use .sy-semibold and .sy-bold only when emphasis is semantically needed. **12px is the minimum for ordinary user-facing product text.** Do not solve responsive problems by shrinking product copy below this floor; instead reflow, resize columns, scroll, truncate non-critical metadata, or change layout. Development-only tooling and required third-party map attribution may use their own compact technical sizing.

Tailwind font-sans is mapped to Inter in the theme, so new components should inherit the canonical family without declaring another sans stack.

The shared typography classes are intentionally **color-neutral**. They define font family, size, weight, and line height only. Text color must come from the surrounding semantic role or an explicit approved color utility. This prevents typography tokens from overriding state contrast such as white text on a Primary button.

## 4. Surface and Shape Language

- Light/white cards and panels over a soft neutral page background.
- Rounded corners should be consistent, not random.
- Use subtle borders and soft shadows rather than heavy outlines.
- Selected cards/states may use the light blue brand surface plus stronger blue outline.
- Bottom sheets and floating controls should feel touch-friendly and spatial.
- Avoid putting every small text group inside its own card.

## 5. Map and Spatial Language

- Map-first discovery is a core part of the product identity.
- Use approved exported map markers from `assets/pinpoints/` when the corresponding state exists.
- Selected markers should clearly connect to the selected service card/sheet.
- Map geography should remain low contrast so service information stays dominant.
- Use actual exported map illustrations from `assets/vectors/` for empty/error states where applicable.

## 6. Logo

The product name is **TaymPers**.

The canonical descriptive title is:

> **TaymPers: A Community-Powered Platform for Accessible, Transparent, Accountable, and Reliable Services**

The current runtime logo is available as:

```text
apps/web/public/assets/branding/taympers-logo.png
apps/web/public/assets/branding/taympers-logo-text.png
```

Preserve logo proportions. Do not redraw the logo with text/CSS if the image asset is available.

## 7. Canonical User Identity

The approved recurring signed-in user identity uses the **male avatar** established in the approved mobile references.

Older desktop references or current prototype code that show a female avatar are superseded. When implementing the final shell, use one consistent male identity across desktop/mobile unless a page intentionally represents another role/account.

## 8. Semantic Metrics

- TaymPers Score is a decision-support composite, not a generic star review.
- Reliability is a distinct metric.
- Community Confidence describes the strength/amount/recency/consistency of available community data. It is not another quality rating.
- Lack of community data must never visually imply poor service. Do not display fake `0%`, `0/100`, or zero-star values for missing data.

## 9. Accessibility and Readability

- Maintain strong text contrast.
- Do not communicate status by color alone when a label/icon can reinforce it.
- Controls need usable touch targets on mobile.
- Avoid tiny metadata that becomes unreadable on older or lower-resolution devices.
- Responsive behavior should be fluid across widths rather than relying only on a few hard breakpoints.

## 10. Implementation Check

Before considering a page visually finished, verify:

- Inter hierarchy is respected.
- Primary blue and semantic colors match approved roles.
- The correct exported icons/markers/vectors are used where available.
- No emoji is standing in for a real approved icon.
- The canonical logo/avatar treatment is consistent.
- Cards/sheets match the approved rounded/light surface language.
- Mobile is intentionally composed, not merely a squeezed desktop screen.

