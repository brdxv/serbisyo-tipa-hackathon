# SerbisYO Approved UI Baseline

This file records the **approved visual baseline** chosen by the Team Leader for the SerbisYO consumer experience. Future UI concept prompts and implementation work should follow this baseline unless the Team Leader explicitly approves a redesign.

## Approved Prompt Pair

- **P01 — Explore / Home Desktop** — APPROVED desktop master reference.
- **P02 — Explore / Home Mobile** — APPROVED mobile master reference.

> Historical note: before the prompt library was reordered, the approved mobile Explore prompt was labeled **P04**. After reordering, it is now **P02** so desktop/mobile versions of the same page stay adjacent.

## Approved Desktop Explore Pattern — P01

- Wide desktop composition with a clean top header.
- SerbisYO logo at top-left.
- Large global search field in the header.
- Location control, notification/profile controls at the upper-right.
- Category and utility chips directly below/within the header area.
- **Left results panel + dominant right map** composition.
- Result cards use image, provider name, category, status, distance/location, average wait, reliability, SerbisYO Score, community confidence, and one short insight.
- Selected result card is visibly connected to the selected map marker.
- Map uses calm low-contrast geography, custom colored category markers, labels, and one selected provider popover.
- Blue is the dominant interaction accent, with green for positive/open/reliability states and restrained orange/red/purple category or semantic accents.
- Rounded white/light surfaces, subtle shadows, clean modern sans-serif typography, and generous spacing.

## Approved Mobile Explore Pattern — P02

- Single portrait smartphone layout, not a collage or desktop shrink-down.
- Same SerbisYO logo, colors, typography, icon family, and marker system as P01.
- Compact top header with location and utility/profile controls.
- Large rounded search field below the header.
- Horizontally scrollable category/filter chips.
- **Map is the dominant mobile canvas.**
- Selected provider is connected to a large draggable/expandable bottom service sheet.
- Bottom service sheet reuses P01's provider-card language: image, provider identity, status, average wait, reliability, score, confidence, and one concise insight.
- Persistent bottom navigation: **Explore, Contribute, Saved, Profile**.
- Mobile layout prioritizes thumb reach, readable metrics, and clear spatial continuity.

## Canonical Image Frames

- **Desktop / PC:** **1536 × 1024 px (3:2 landscape)**.
- **Mobile:** **941 × 1672 px (approximately 9:16 portrait)**.
- If an image generator cannot produce the exact pixel dimensions, preserve the matching aspect ratio and composition. Do not change device format simply to fit more content.

## Canonical Recurring Shell and User Identity

- The **male avatar used throughout the approved mobile references is the canonical signed-in user avatar for all future SerbisYO screens**, including desktop screens.
- Some earlier desktop references show a female avatar. That detail is now superseded; preserve the layout but replace the profile image with the canonical male avatar in future generations.
- Desktop recurring header: SerbisYO logo at top-left, global rounded search bar (`Search a service or place...`), `Morong, Rizal` location selector, notification bell with red unread dot, and canonical male avatar at far right.
- Mobile recurring header: iOS-style status bar, SerbisYO logo, `Morong, Rizal` location selector, notification bell with red unread dot, and canonical male avatar at upper-right.
- Normal consumer mobile pages preserve bottom navigation: **Explore, Contribute, Saved, Profile**. Focused forms may retain this shell when consistent with the approved contribution references.
- Search/category controls are reused according to page context: Explore/discovery screens keep them; focused detail/contribution screens should not add them merely for decoration.

## Cross-Page Visual Rules

All later consumer-facing pages should preserve:

- SerbisYO logo treatment.
- Blue/green primary semantic palette.
- Same modern sans-serif typography and hierarchy.
- Same outline/soft-rounded icon family.
- Same map coloring and custom marker language.
- Same service-card construction and metric language.
- Same SerbisYO Score styling.
- Same reliability and community-confidence treatments.
- Same rounded surface system and subtle shadows.
- Same spacing rhythm and low-clutter visual density.

Desktop pages should treat **P01** as the main desktop reference. Mobile pages should treat **P02** as the main mobile reference while also inheriting the content hierarchy of their corresponding desktop page.

## Pairing Rule

The prompt library is now ordered so paired desktop/mobile pages are consecutive:

1. **P01 Explore / Home Desktop** — approved
2. **P02 Explore / Home Mobile** — approved
3. **P03 Service Profile Desktop**
4. **P04 Service Profile Mobile**
5. **P05 Contribute Experience Desktop**
6. **P06 Contribute Experience Mobile**

The same pairing rule now continues through the deeper workflow states:

7. **P09 Community Intelligence Desktop** + **P10 Mobile**
8. **P11 Confirm Service Desktop** + **P12 Mobile**
9. **P13 Visit Details Desktop** + **P14 Mobile**
10. **P15 Rate Experience Desktop** + **P16 Mobile**
11. **P17 Review and Submit Desktop** + **P18 Mobile**
12. **P19 Contribution Success Desktop** + **P20 Mobile**
13. **P21 Suggest an Update Desktop** + **P22 Mobile**
14. **P23 Report Information Desktop** + **P24 Mobile**

P07 Search / Autocomplete and P08 Filters / Sorting remain device-adaptive interaction-state prompts because they directly modify the approved Explore page rather than represent standalone pages. Their desktop or mobile form should inherit P01 or P02 respectively.

When generating a paired page, always generate/review the desktop version first, then immediately generate its mobile counterpart using both the approved mobile baseline and the just-approved desktop page.

