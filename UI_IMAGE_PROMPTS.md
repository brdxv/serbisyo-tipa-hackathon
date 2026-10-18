# SerbisYO UI/UX Concept Image Prompt Library

These prompts are intended for **concept-image generation only**. They help the team compare possible visual directions before final implementation.

They are not instructions to copy any existing design reference exactly. The final UI should remain uniquely SerbisYO.

## Shared Visual DNA for All Prompts

Apply these ideas unless a specific prompt says otherwise:

- Product: **SerbisYO**, a community-powered service intelligence, discovery, and transparency web app.
- Core purpose: help people know **where to go, when to go, what to expect, and which service provider is more reliable**.
- Visual personality: modern, calm, spatial, trustworthy, ergonomic, community-centered.
- Primary interaction: map + service cards + expandable service intelligence.
- Style: polished real product UI, not sci-fi concept art.
- Layout: responsive, believable, implementation-ready.
- Surfaces: light, layered, soft, with restrained blur/transparency only where it helps context.
- Typography: modern readable sans-serif, strong hierarchy, sentence case.
- Corners: medium-to-generous rounding for cards/sheets, smaller rounding for controls.
- Avoid: generic SaaS dashboard grids, excessive glassmorphism, neon cyberpunk, dark-only UI, huge decorative gradients, too many floating ornaments, or direct copies of reference designs.
- Brand color: use the **final SerbisYO primary color when supplied**. If none is supplied yet, use a temporary restrained cool-blue accent and keep the rest neutral.
- Map: clean low-contrast map treatment so markers and information remain prominent.
- Use fictional or generic service providers such as `Morong Community Health Center`, `Rizal Service Hub`, `ABC Dental Clinic`, or `Municipal Records Office`.

---

# Page 1 - Explore / Home

## Prompt A - Desktop Spatial Workspace

Design a high-fidelity desktop web app concept for **SerbisYO**, a community-powered service intelligence and transparency platform. Create a map-first spatial workspace for a 1440x900 desktop screen. Use a slim top navigation with the SerbisYO logo, a large search field reading `Search a service or place`, compact category chips, and minimal profile controls. The left 35% of the screen should contain a softly layered results panel with 3 to 4 service cards, while the remaining screen is a large calm city map. Each service card should show provider name, category, open/closed status, average wait time, reliability percentage, community confidence, and one short contextual insight such as `Usually quieter after 3 PM`. Selected card and map marker should visually correspond. Use modern rounded panels, light surfaces, subtle shadows, restrained translucency, clean spacing, and a trustworthy service-focused design. Avoid a traditional dashboard sidebar. Make the product feel new, spatial, ergonomic, and realistic enough to implement in React.

## Prompt B - Desktop Floating Sheet Direction

Create an alternative desktop UI concept for **SerbisYO** where the map occupies nearly the entire screen and interface elements float over it. Use a wide translucent search surface near the top-left, horizontal service-category chips below it, and a floating vertical service-results sheet anchored to the left edge. The sheet should feel like it can expand or collapse. Show three service providers with average waiting time, service reliability, and open status. Highlight one selected provider with a branded marker halo and a compact map popover. Add only essential controls such as filter, recenter, and profile. Use a quiet grayscale/light map, soft layered white surfaces, medium rounded corners, precise spacing, and strong information hierarchy. The result should feel like a premium modern local-discovery product, not Google Maps and not a SaaS analytics dashboard.

## Prompt C - Desktop Local Discovery Editorial Direction

Design a refined desktop concept for **SerbisYO** that blends local discovery with service intelligence. Use a bright, airy interface with a calm map on the right and a more editorial service discovery column on the left. Include a strong search field, `Nearby services` heading, category filters, and image-light service cards that prioritize practical metrics over photography. Show real-looking data: `24 min average wait`, `91% reliable`, `High confidence`, `Open until 5 PM`. Use one distinctive SerbisYO marker shape across the map. Make typography and spacing feel premium and human, with restrained color use and no excessive decorative effects.

---

# Page 2 - Explore / Home Mobile

## Prompt A - Full-Screen Map + Bottom Sheet

Design a high-fidelity mobile UI for **SerbisYO** on a modern smartphone. The main screen is a full-height city map with a floating rounded search bar at the top reading `Search services`, horizontally scrollable category chips beneath it, and several clean service markers. At the bottom, show a draggable service preview sheet with one selected provider, open status, average wait, reliability, and community confidence. Add a compact bottom navigation with Explore, Contribute, Saved, and Profile. The selected marker and bottom card should feel connected. Use a bright, airy, modern style with subtle depth and strong thumb ergonomics. Keep the map visible and useful. Avoid clutter and avoid making the screen look like a generic map clone.

## Prompt B - Swipeable Service Cards

Create a mobile concept for **SerbisYO** where the map fills most of the screen and the bottom area contains horizontally swipeable service cards. The top area has a floating search control, location indicator, and category chips. Each swipeable card shows provider name, category, open status, `18 min wait`, `94% reliability`, and a one-line insight such as `Low wait right now`. Use a distinctive branded marker for the selected card. Make the layout feel like a contemporary travel/local-exploration app adapted for service transparency: clean white surfaces, soft shadows, rounded cards, controlled accent color, and highly readable typography.

---

# Page 3 - Service Profile

## Prompt A - Desktop Service Intelligence Sheet

Design a high-fidelity desktop **SerbisYO Service Profile** for a fictional provider called `Morong Community Health Center`. Keep a narrow portion of the map visible on the right with the provider marker selected. On the left, open a large service intelligence panel. At the top show provider name, category, address, `Open until 5:00 PM`, and main actions. Below, show a visually distinctive decision summary with `SerbisYO Score 87/100`, `24 min average wait`, `15-20 min processing`, `91% reliability`, and `High confidence`. Add a short insight sentence: `Usually reliable, but busiest from 11 AM to 1 PM.` Then show compact sections for service quality, information accuracy, accessibility, time efficiency, services offered, busy hours, and recent community experiences. Use varied information treatments instead of five identical cards. The page should feel trustworthy, modern, and spatial.

## Prompt B - Desktop Data-Rich but Human

Create an alternative desktop service profile concept for **SerbisYO** that is data-rich but not dashboard-like. Use a large clean panel over a muted map background. Present the provider identity first, then a horizontal strip of key service metrics, then a compact busy-hours visualization, followed by community insight bars and recent experience entries. Include buttons `Contribute experience`, `Suggest update`, and `Report information`. Use generous whitespace, subtle dividers, medium rounded surfaces, clean typography, and one restrained brand accent. Make the hierarchy immediately answer: is this place open, how long will I wait, how reliable is it, and can I trust the data?

## Prompt C - Mobile Expanding Service Sheet

Design a mobile **SerbisYO Service Profile** that visually grows from a selected map card into a full-height sheet. At the top, retain a small map preview and selected marker. Then show provider name, category, open status, SerbisYO Score, average wait, processing time, reliability, and community confidence. Place `Contribute experience` as a prominent sticky action. As the user scrolls, reveal busy hours, service quality, information accuracy, accessibility, available services, and recent community experiences. Use a clean travel-app-inspired visual rhythm with soft cards, compact metrics, excellent spacing, and no clutter.

---

# Page 4 - Contribute Experience

## Prompt A - Mobile Multi-Step Contribution

Design a mobile multi-step contribution flow for **SerbisYO**. The experience should feel fast, friendly, and trustworthy rather than like a survey. Show step 2 of 4 titled `How was your visit?` with the selected provider shown in a compact context card. Include clear controls for waiting time, service processing time, whether the service was available, and whether posted information was accurate. Use large touch-friendly segmented controls, clear labels, a progress indicator, and a sticky `Next` button at the bottom. Use a bright clean interface, soft rounded surfaces, strong typography, and restrained brand color. Avoid long forms and avoid excessive decorative graphics.

## Prompt B - Desktop Guided Contribution

Create a desktop contribution flow for **SerbisYO** with a contained multi-step form in the center-left and a small provider/map context area on the right. Show a progress path with four simple steps: `Service`, `Visit`, `Experience`, `Review`. The active screen asks for waiting time, processing time, availability, and information accuracy. Use simple numeric/time controls and segmented options. Keep the form spacious, highly readable, and implementation-realistic. The interface should communicate that contributing data helps the next person make a better service decision.

## Prompt C - Rating Step

Design the `Rate the experience` step for the **SerbisYO** contribution flow. Show three structured dimensions: Service Quality, Accessibility, and Overall Experience. Use a modern rating interaction that feels more intentional than generic stars, such as labeled segmented scales from Poor to Excellent or compact expressive indicators. Keep the selected provider visible in a small context header. Include an optional short note field and a clear `Share experience` action. Make the design friendly, credible, and ergonomic on mobile.

---

# Page 5 - Search and Filters

## Prompt A - Desktop Filter Popover

Design a compact desktop search-and-filter state for **SerbisYO** over the map-first Explore page. The search query is `clinic`. Show a floating filter panel with controls for `Open now`, `Category`, `Accessibility`, `Shortest wait`, and `Highest reliability`. Use clear chips, toggles, or segmented controls and a strong `Apply filters` button. The background map and service results remain partially visible so the user never loses spatial context. Use restrained depth, light surfaces, and no unnecessary settings complexity.

## Prompt B - Mobile Filter Bottom Sheet

Create a mobile filter bottom sheet for **SerbisYO** over a dimmed but still visible service map. The sheet should be draggable and use large touch targets. Include Open Now, service categories, accessibility, shortest wait, and highest reliability. Show `Reset` and a prominent `Show 18 services` action. Use modern rounded sheet geometry, clear spacing, and concise labels. Keep the visual language consistent with a premium map-based consumer app.

---

# Page 6 - Suggest Update / Report Information

## Prompt A - Suggest Update Sheet

Design a mobile **SerbisYO** bottom sheet titled `Suggest an update` opened from a service profile. Show selectable issue types: `Operating hours`, `Address`, `Service unavailable`, `Contact information`, and `Accessibility information`. Below, provide a short explanation field and a primary action `Send update`. Keep the design neutral and constructive, emphasizing community accuracy rather than complaints. Use clear form labels, restrained color, and strong mobile ergonomics.

## Prompt B - Report Information Modal

Create a desktop modal for **SerbisYO** titled `Report information`. The background shows a service profile blurred/dimmed. The modal offers reasons such as Spam, Fake contribution, Abusive content, and Misleading information, with an optional explanation field. Add `Cancel` and `Submit report`. Make the design serious, concise, trustworthy, and visually consistent with the main product without feeling punitive.

---

# Page 7 - Saved Services

## Prompt A - Clean Saved List

Design a responsive **SerbisYO Saved Services** page with a clean list of bookmarked providers. Each row/card shows provider name, category, open status, average wait, reliability, and one short insight. Use minimal map imagery, strong typography, and the same service-card visual language used on Explore. Add a simple sort control for Recently saved, Distance, and Reliability. The page should feel light and useful rather than like a dashboard.

## Prompt B - Saved + Mini Map

Create a desktop concept for **SerbisYO Saved Services** with a narrow saved-service list on the left and a subtle mini map on the right showing bookmarked locations. Use the same marker language as Explore. The selected saved service highlights on the map. Keep the screen visually quiet and consistent with the core map-first product.

---

# Page 8 - User Profile / Activity

## Prompt A - Mobile Profile

Design a mobile **SerbisYO User Profile** inspired by modern travel/profile apps but focused on community participation. At the top, show avatar, name, contribution count, saved services count, and a simple community-help indicator. Below, use clean grouped rows for `My contributions`, `Saved services`, `Recent activity`, and `Settings`. Keep it modern, warm, and simple. Do not include follower counts, social feeds, badges, or excessive gamification.

## Prompt B - Desktop Profile / Activity

Create a desktop user profile for **SerbisYO** with a clean identity header and two-column content area: recent contributions on the left and saved/recent services on the right. Show contribution status and compact service metrics. Use the same typography, cards, and spacing as the rest of the product. Keep the emphasis on useful activity history rather than social networking.

---

# Page 9 - Moderator View

## Prompt A - Minimal Moderation Workspace

Design a desktop internal moderation page for **SerbisYO**. Use the established design system but make the layout more utilitarian than the consumer experience. Show a queue of pending corrections and reported contributions on the left and a detail review pane on the right. Each item should show provider, report type, reason, submitted time, and status. The detail pane shows original information, suggested correction or reported content, and clear `Approve`, `Reject`, and `Request review` actions. Keep it clean, readable, and realistic for a small hackathon admin tool.

## Prompt B - Moderation Detail Focus

Create a focused moderator review screen for **SerbisYO** showing one reported community contribution. Display the provider, reported contribution, reason, surrounding context, and basic contribution metadata. Use a restrained, neutral interface with clear action hierarchy and no dramatic warning-heavy design. The goal is fair community governance, not punishment.

---

# Page 10 - Future Provider Dashboard (Pitch-Only Concept)

This page is **future scope** and should not be prioritized for implementation unless the core MVP is complete.

## Prompt A - Provider Service Insights

Design a future-scope desktop provider dashboard for **SerbisYO**. Show a verified service provider profile with current community metrics: average wait, reliability, information accuracy, accessibility, and recent trend. Add sections for `Update official information`, `Respond to feedback`, and `Recurring issues`. Keep the interface aligned with SerbisYO's consumer design but more operational. Avoid dense enterprise dashboard styling.

## Prompt B - Community vs Official Information

Create a future SerbisYO provider view that compares `Official service information` with `Community-reported experience`. Show expected processing time versus actual average, posted hours versus confirmed reports, and recurring service issues. Use a clean comparison layout that emphasizes transparency and improvement rather than competition.

---

# Recommended First Concepts to Generate

If the team only has time to generate a few concept images, prioritize these first:

1. **Explore / Home - Desktop Spatial Workspace**
2. **Explore / Home Mobile - Full-Screen Map + Bottom Sheet**
3. **Service Profile - Desktop Service Intelligence Sheet**
4. **Service Profile - Mobile Expanding Service Sheet**
5. **Contribute Experience - Mobile Multi-Step Contribution**

These five concepts establish most of the visual system needed for the remaining screens.

# Comparison Method

When reviewing generated concepts, score each direction based on:

- Does the map remain useful?
- Can the user understand the most important service information in a few seconds?
- Does it feel recognizably SerbisYO rather than a generic map/review product?
- Is the design feasible in React + Tailwind within the hackathon schedule?
- Does desktop/mobile behavior share the same mental model?
- Are controls readable and ergonomic?
- Is visual decoration helping the product or distracting from it?

