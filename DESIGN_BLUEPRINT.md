# SerbisYO Design Blueprint and Page Workflow

## 1. Design Goal

SerbisYO should feel like a **modern spatial service app**, not a traditional dashboard and not a clone of Google Maps. The visual identity should combine:

- a map-first experience,
- floating service information,
- soft layered surfaces,
- clear decision metrics,
- strong mobile ergonomics,
- and a calm, trustworthy visual system.

The uploaded references suggest several useful patterns that fit SerbisYO:

- **Mobile travel references:** airy layouts, soft gradients, rounded floating controls, high visual hierarchy, image-led cards, and compact bottom navigation.
- **Map redesign references:** the map is the main canvas while cards and controls float over it instead of pushing it aside.
- **Desktop logistics/real-estate references:** desktop works best as a split spatial interface with a service/result panel on the left and the map occupying the larger right side.
- **Gamified map reference:** markers and map feedback can feel lively and distinctive, but SerbisYO should remain more trustworthy and restrained than a game.

The final design should borrow the **principles**, not copy the exact appearance.

## 2. Core Visual Language

### A. Spatial Layering

The interface should have three perceived layers:

1. **Map layer** - quiet, low-contrast, always spatially useful.
2. **Information layer** - result cards, service panels, bottom sheets, insights.
3. **Action layer** - search, filters, contribute button, navigation controls.

This should make the app feel spatial and alive without becoming visually crowded.

### B. Surface Style

- Use mostly light surfaces with subtle transparency where it improves context.
- Prefer soft blur/frosted effects for floating controls, but do not use glass everywhere.
- Use one primary card radius family and one smaller control radius family.
- Avoid turning every piece of information into a separate rounded card.
- Use borders/dividers when they communicate grouping, not as decoration.

### C. Color System

The Team Leader will provide the primary brand color. Designers should then build a role-based palette:

- Brand primary
- Brand tint / soft background
- Neutral canvas/map surface
- Success / good reliability
- Warning / uncertain or moderate confidence
- Critical / service unavailable or strongly negative status
- Primary text
- Secondary text
- Border/divider

The map itself should remain visually quieter than the service markers and UI.

### D. Typography

- Use a modern humanist or geometric sans-serif with excellent readability.
- Stronger weight for service names and major metrics.
- Normal sentence case for almost everything.
- Avoid all-caps labels unless a small map/category convention truly needs it.
- Keep dense metric text compact and legible.

### E. Signature Interaction

The signature SerbisYO interaction should be:

> **Tap/select a place -> the map anchors to it -> a service intelligence sheet/card rises into focus.**

This interaction should feel the same on desktop and mobile even though the layout morphs.

## 3. Responsive Layout Strategy

SerbisYO should not have separate unrelated desktop and mobile designs. The same information model should **morph** between layouts.

### Desktop

Recommended structure:

```text
+-------------------------------------------------------------+
| top navigation / global search / account                    |
+----------------------+--------------------------------------+
| results / service    |                                      |
| panel                |              MAP                     |
|                      |                                      |
| cards + filters      |       selected marker + popover      |
|                      |                                      |
+----------------------+--------------------------------------+
```

- Left panel: about 34-40% depending on screen width.
- Map: dominant remaining space.
- Service detail can replace the result panel or open as an expanded side sheet.
- Avoid old-fashioned permanent sidebars full of navigation icons unless necessary.

### Tablet / Narrow Laptop

- Compress result panel width.
- Reduce secondary text before reducing primary controls.
- Allow the detail panel to overlay part of the map rather than shrinking the map too far.

### Mobile

Recommended structure:

```text
+-----------------------+
| floating search       |
| category chips        |
|                       |
|         MAP           |
|                       |
|                       |
|  draggable bottom     |
|  sheet / result card  |
+-----------------------+
| bottom navigation     |
+-----------------------+
```

- Map remains visible during discovery.
- Results become a bottom sheet or horizontally swipeable preview cards.
- Service details expand into a full-height sheet/page.
- Filters become horizontally scrollable chips or a modal sheet.
- Bottom navigation should have only the most important destinations.

## 4. App Navigation

Keep navigation minimal for the hackathon MVP.

Recommended main destinations:

- **Explore** - main map/discovery experience
- **Saved** - optional if implemented
- **Contribute** - direct entry to community contribution
- **Profile** - optional/basic user area

On desktop, navigation can live in the top bar. On mobile, use a compact bottom navigation.

Avoid creating separate pages for every small feature. Search, filters, and result states should mostly live inside Explore.

## 5. Page 1 - Explore / Home

### Purpose

This is the core page. A user should immediately understand that SerbisYO helps them find services and know what to expect.

### First View

The page opens directly into the map experience. Avoid a large marketing hero before the app.

Primary elements:

- SerbisYO brand
- Large search control: `Search a service or place`
- Current area/location indicator if available
- Quick category chips
- Filter control
- Map
- Service markers
- Result cards

### Desktop Display

- Top bar remains calm and slim.
- Search spans most of the left content area or sits across the top of the results panel.
- Result panel shows nearby/relevant services.
- Map fills the majority of the page.
- Selected marker uses the brand color and a slightly stronger halo.
- Hovering a result card highlights its marker.
- Selecting a marker scrolls/highlights the corresponding result.

### Result Card Content

Each card should answer a decision quickly:

- Provider name
- Category
- Open/closed state
- Distance if location is available
- Estimated/average wait
- SerbisYO score or reliability
- Community confidence
- One short contextual insight, for example `Usually quieter after 3 PM`

Do not show every metric in the card.

### Mobile Display

- Search floats at the top.
- Category chips sit below search and can scroll horizontally.
- Map occupies most of the screen.
- A selected/nearest result appears in a bottom preview card.
- Swiping horizontally changes the selected provider and marker.
- Dragging the sheet upward reveals the result list.

### Primary Interactions

- Search
- Select category
- Open filters
- Tap marker
- Tap result card
- Recenter map
- Open service profile

## 6. Search and Filter State

This should not be a separate full page unless technically necessary.

### Search Interaction

- Search opens with recent searches or suggested categories.
- Results update both the list and markers.
- Search supports provider names, categories, and service types.

### Filter Sheet

Recommended MVP filters:

- Open now
- Category
- Accessibility
- Shortest wait
- Highest reliability

Desktop: compact floating popover or side-panel section.

Mobile: bottom sheet with large touch targets and a clear `Apply filters` action.

## 7. Page 2 - Service Profile

### Purpose

This is where SerbisYO proves its value beyond ordinary reviews.

### Information Hierarchy

The page should be organized in this order:

1. Identity and status
2. Decision summary
3. Time/service intelligence
4. Services offered
5. Community insights
6. Recent contributions
7. Corrections/reporting actions

### Desktop Display

Preferred behavior:

- Keep a portion of the map visible on the right.
- Service profile opens as an expanded left-side sheet/panel.
- A small map marker remains selected so location context is never lost.

Header contains:

- Name
- Category
- Address
- Open/closed status
- Operating hours
- Main actions

### Decision Summary Block

This should be visually distinctive but not look like a finance dashboard.

Suggested metrics:

- SerbisYO Score
- Average wait
- Typical processing time
- Reliability
- Community confidence

One strong summary sentence should sit near the metrics, such as:

> `Usually reliable, but busiest from 11 AM to 1 PM.`

### Community Intelligence Section

Use a mix of concise bars, labels, and small visual summaries for:

- Service quality
- Reliability
- Information accuracy
- Accessibility
- Time & efficiency

Avoid five identical large cards.

### Busy Hours

If included, use a compact horizontal histogram or heat strip rather than a large chart.

### Mobile Display

- Profile opens from the selected map card as an expanding sheet.
- At first, show only the most important summary.
- As the user scrolls, reveal details and community data.
- Keep `Contribute experience` accessible as a sticky or prominent action.

## 8. Page 3 - Contribute Experience

### Purpose

The contribution flow must feel fast enough that users would realistically finish it.

### Interaction Model

Use a short multi-step flow instead of one intimidating long form.

Recommended steps:

1. **Confirm place and service**
2. **Tell us about the visit**
3. **Rate the experience**
4. **Optional note + review submission**

### Step 1 - Confirm Place and Service

- Provider name and mini location preview
- Service used
- Visit date/time

### Step 2 - Visit Details

- Waiting time
- Processing/service time
- Was the service available?
- Was the posted information accurate?

Use sliders only if they improve entry speed; otherwise use simple numeric/time controls.

### Step 3 - Experience

- Service quality
- Accessibility
- Overall experience

Use simple segmented scales or stars where appropriate, but structured labels should explain what is being rated.

### Step 4 - Optional Note

- Short comment
- Final summary
- Submit

### Completion

Show a compact success state:

> **Experience added. You just helped the next person know what to expect.**

Then offer:

- Back to service
- View updated insights

### Responsive Behavior

Desktop: centered contained flow with the service context visible beside it if space allows.

Mobile: full-screen step flow with a sticky next/submit button.

## 9. Page 4 - Suggest Update / Report Information

### Purpose

This supports trust and prevents SerbisYO from becoming an uncontrolled review wall.

### Suggested Update

Use for:

- Wrong operating hours
- Wrong address
- Service no longer offered
- Contact information change
- Accessibility information change

### Report

Use for:

- Spam
- Abusive content
- Fake contribution
- Incorrect/misleading information

### Display

Do not create a visually heavy page. Use a modal or sheet launched from the Service Profile.

Users choose the issue type, add a short explanation, and submit.

## 10. Page 5 - Saved / Shortlist (Should-Have)

If time allows, this is more useful than adding unrelated features.

### Purpose

Allow users to keep services they may want to revisit or compare later.

### Display

- Clean vertical service list
- Small map preview optional
- Same compact decision metrics as Explore cards
- Sort by recently saved, distance, or reliability if simple to implement

Mobile and desktop can share almost the same content structure.

## 11. Page 6 - User Profile / Activity (Should-Have)

Keep this very simple for the hackathon.

### Content

- Name/avatar
- Contribution count
- Saved services
- Recent contributions
- Basic settings

Do not build social followers, badges, feeds, or gamification unless the core product is already complete.

## 12. Page 7 - Minimal Moderator View

### Purpose

Demonstrate that community-powered information has governance.

### Layout

Desktop-first internal utility page is acceptable.

Show:

- Pending corrections
- Reported contributions
- Provider/content involved
- Reason
- Approve / reject

This page does not need the same visual richness as the consumer experience, but it should still use the design system.

## 13. Optional Provider View - Future Scope

Do not prioritize for the hackathon MVP.

Future provider dashboard could include:

- Claim profile
- Edit official information
- Respond to feedback
- View service trends
- View recurring complaints
- Compare posted processing time vs community-reported time

This can be shown in the pitch deck as future scope rather than built now.

## 14. Marker Design

Markers are one of the most important brand elements.

Avoid default generic map pins if possible.

Recommended states:

- Default provider marker
- Selected provider marker
- High-confidence marker
- Service unavailable/closed state

Keep meaning simple. Do not color-code ten categories with ten competing colors.

One distinctive marker silhouette or badge can become a recognizable SerbisYO visual signature.

## 15. Service Card Design

Cards should be information-dense without feeling cramped.

Recommended hierarchy:

```text
[category / status]                       [score]
Provider Name
Short address / distance

Wait 24 min     Reliability 91%     Open until 5 PM

Usually quieter after 3 PM
```

Use icons only when they improve scan speed. Avoid an icon beside every label.

## 16. Microinteractions

Use motion primarily to explain spatial relationships and state changes.

Good examples:

- Selecting a card smoothly centers/highlights the map marker.
- Opening a provider expands the card into a detail sheet.
- Submitting a contribution updates the visible community count/insight.
- Filter application visibly changes map/result state.

Avoid decorative entrance animations on every card.

## 17. Empty, Loading, and Error States

These are required design states, not optional polish.

### Loading

- Skeleton result cards
- Map loading indicator only where necessary

### No Results

> `No matching services found in this area.`

Actions:

- Clear filters
- Search a wider area

### No Community Data

> `No community experience yet. Be the first to help others know what to expect.`

### Map/Network Error

Keep the service list usable if possible and explain what can still be done.

## 18. Accessibility and Ergonomics

- Use visible keyboard focus states.
- Maintain sufficient text/background contrast.
- Do not encode reliability only by color.
- All important controls need text labels or accessible names.
- Buttons on mobile should be comfortably touchable.
- Forms need visible labels, not placeholder-only labels.
- Support reduced-motion preferences.
- Map interactions should have list equivalents wherever possible.

## 19. Design Priority Order for October 18-19

Designers should work in this order:

1. Establish visual direction and tokens.
2. Design desktop Explore.
3. Design mobile Explore.
4. Design Service Profile desktop/mobile.
5. Design Contribution flow.
6. Design filter/search states.
7. Design correction/report sheet.
8. Define reusable components and states.
9. Only then design optional Saved/Profile screens.

Do not spend the first day perfecting logos, illustrations, or decorative screens while the core flows are unresolved.

## 20. Recommended MVP Route Structure

The exact routing may change, but this is a clean implementation direction:

```text
/                       Explore / map
/service/:id            Service Profile
/service/:id/contribute Contribution flow
/saved                  Saved services (optional)
/profile                User profile/activity (optional)
/moderation             Minimal moderator view (optional/internal)
```

Search and filters should remain stateful parts of `/` rather than becoming unnecessary separate routes.

## 21. Final Design Principle

The interface should make the following feel effortless:

> **Find a service. Understand the real experience. Make a decision. Help the next person.**

If a screen, card, animation, or feature does not support that loop, it should not be prioritized during the hackathon.

## 22. Concept Image Generation Direction

The team may generate UI/UX concept images before implementation to quickly compare visual directions. These images are **design exploration references**, not final specifications and not pixel-perfect implementation targets.

When generating concepts:

- Preserve the SerbisYO information hierarchy and workflows in this file.
- Use invented service-provider names and neutral map geography unless the team intentionally wants a local demo area.
- Do not copy any supplied reference image exactly.
- Keep the map visually calm so service information remains readable.
- Show realistic data such as waiting time, reliability, operating hours, confidence, and recent community activity.
- Generate desktop and mobile concepts separately where useful.
- Prefer believable product UI over futuristic concept art.
- Avoid unnecessary glassmorphism, excessive gradients, neon effects, oversized shadows, and decorative 3D objects.
- The final primary brand color must follow the Team Leader's chosen color. Until it is supplied, concept prompts may use a restrained cool-blue placeholder accent only as a temporary visualization aid.
- Generate **one dedicated page/screen per image** by default. Do not combine three different pages into one concept board unless the Team Leader explicitly asks for a multi-screen board.
- For every core consumer-facing page, maintain both a desktop and mobile concept where the responsive composition materially changes.
- Treat previously approved/generated pages as **visual source files** for later prompts. A later page should explicitly reference the earlier page(s) it depends on so the image generator preserves the same brand, components, spacing, typography, markers, cards, and interaction language.
- Responsive pairs must be generated as a family: desktop establishes the information/component system, while mobile recomposes that same system for a portrait canvas and touch interaction. Mobile should not be a separate visual redesign.
- Sequential workflow screens such as contribution steps must preserve the same shell and only change the active step/content.
- For deeper contribution and trust workflows, maintain explicit desktop/mobile prompt pairs rather than relying on one device-neutral prompt. This includes Community Intelligence, all four contribution steps, contribution success, Suggest Update, and Report Information.
- Standard concept frame sizes are **1536 × 1024 px (3:2)** for desktop and **941 × 1672 px (~9:16)** for mobile. Preserve these proportions across the prompt library so pages are visually comparable.
- Use one canonical signed-in user identity across all screens: the **male avatar from the approved mobile references**. This overrides the female avatar present in some older desktop images.
- Reuse the corresponding desktop/mobile global shell rather than reinterpreting it on each page: logo, search where applicable, location selector, notification bell, canonical profile avatar, and mobile bottom navigation.
- Prompt IDs are paired consecutively wherever desktop/mobile versions both exist. The approved Explore pair is now **P01 Desktop + P02 Mobile**; the former mobile Explore label P04 is retained only as historical context in `APPROVED_UI_BASELINE.md`.

The canonical prompt library for these explorations is stored in `UI_IMAGE_PROMPTS.md`.

