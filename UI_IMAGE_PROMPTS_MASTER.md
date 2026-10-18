# SerbisYO Master UI/UX Image-Generation Prompt Library

This is the canonical prompt set for generating SerbisYO UI/UX concept images. Each numbered prompt represents a **different page, workflow step, major interface state, or reusable system surface**. When the team asks for prompts in groups, return them in numeric order unless a specific screen is requested.

The purpose of these images is to establish visual direction before implementation. They are not pixel-perfect specifications and should not copy any reference image exactly.

## Shared Design DNA for Every Prompt

> **Approved visual baseline:** P01 (Explore / Home Desktop) and P02 (Explore / Home Mobile) are the approved master references supplied/approved by the Team Leader. All later consumer-facing prompts must preserve their established SerbisYO logo treatment, blue/green palette, typography, icon family, map styling, marker language, card construction, metric styling, rounded surfaces, shadows, spacing rhythm, and responsive relationship unless the Team Leader explicitly approves a redesign.

> **Canonical output frames:** Desktop/PC concepts use **1536 × 1024 px (3:2 landscape)**, matching the approved/generated desktop references. Mobile concepts use **941 × 1672 px (approximately 9:16 portrait)**, matching the approved mobile reference. If an image tool cannot output those exact pixel dimensions, keep the same aspect ratio and composition rather than changing the layout shape. Never generate a desktop page in a tall/mobile frame or a mobile page in a wide/desktop frame.

> **Canonical recurring app shell:** All future screens must preserve the same recurring SerbisYO identity and account shell unless a prompt explicitly describes a focused/immersive state. On **desktop**, keep the SerbisYO logo at top-left, the same large rounded global search field (`Search a service or place...`) in the header, the `Morong, Rizal` location selector toward the right, the notification bell with red unread dot, and the **same male profile avatar used in the approved mobile screens** at the far right. The male avatar is now canonical and **supersedes the female avatar visible in some older desktop reference images**. Keep the same category/utility chip row on Explore and other map/discovery contexts where it is relevant. On **mobile**, keep the iOS-style status bar, SerbisYO logo at top-left, `Morong, Rizal` location selector, notification bell with red unread dot, and the **same male avatar** at the upper-right. Use the established bottom navigation (`Explore`, `Contribute`, `Saved`, `Profile`) on normal consumer mobile pages. Search bars and category chips should appear only where that page type already uses them, rather than being forced into focused contribution/detail flows.

Unless a prompt says otherwise, preserve these principles:

- Product: **SerbisYO**, a community-powered service intelligence, discovery, and transparency web app.
- Core promise: help people know **where to go, when to go, what to expect, and which service provider is more reliable**.
- Personality: modern, spatial, calm, trustworthy, ergonomic, community-centered, premium but practical.
- Main product language: map + service cards + expandable service intelligence + structured community contribution.
- Visual style: high-fidelity real product UI, not sci-fi concept art and not a generic SaaS dashboard.
- Layout: responsive, implementation-ready, believable in React + Tailwind CSS.
- Surfaces: light neutral panels with restrained depth; use transparency/blur only where it improves spatial context.
- Typography: modern readable sans-serif, sentence case, strong hierarchy, no unnecessary all-caps labels.
- Corners: moderate-to-generous card/sheet radii, smaller radii for controls.
- Map: quiet, low-contrast map styling so markers and decision information remain dominant.
- Color: use the final SerbisYO primary color when supplied. Until then, use a restrained cool-blue placeholder accent with neutral surfaces and semantic success/warning/error colors.
- Avoid: direct Google Maps imitation, dense analytics dashboards, excessive glassmorphism, neon cyberpunk, over-decoration, huge gradients, random 3D elements, unnecessary floating ornaments, and every metric being placed in identical cards.
- Use believable local sample names such as `Morong Municipal Office`, `Morong Community Health Center`, `Rizal Family Clinic`, `URS Registrar`, `Bayanihan Pharmacy`, and `Teresa Water District`.
- **Generation rule:** every prompt should generate **one dedicated screen only**. Do not combine multiple pages, multiple device layouts, collages, presentation boards, or moodboards into one image unless the prompt explicitly asks for a component/design-system board.
- **Cross-page continuity rule:** when a prompt names another prompt as a continuity reference and that earlier image has already been generated, use the earlier generated image as the visual source of truth. Preserve the same SerbisYO logo treatment, primary/semantic colors, typography family and weight hierarchy, icon style, border radii, shadows, spacing rhythm, marker language, card construction, metric treatments, and navigation patterns unless the new screen specifically requires a responsive adaptation. Do not redesign the brand from page to page.
- **Responsive continuity rule:** when a mobile prompt corresponds to an already-generated desktop page, treat the desktop image as the established design system and **recompose it for mobile** rather than inventing a new visual direction. Keep the same content hierarchy and component identity while changing placement, density, and interaction for thumb-friendly use.
- **Workflow continuity rule:** when a later workflow step depends on an earlier step, keep the same selected provider, progress component, form styling, button treatment, and page shell. Only the step content should change.
- **Avatar continuity rule:** never alternate between male and female avatars across generated screens. Use the **male avatar from the approved mobile references** for the signed-in user on both desktop and mobile from this point forward.
- **Header continuity rule:** do not redraw, relocate, or restyle the recurring logo/search/location/notification/profile controls from page to page. Reuse the corresponding approved desktop or mobile shell and change only the page content beneath it unless the workflow explicitly requires a focused state.

---

# P01 — Explore / Home Desktop

**Approval status:** **APPROVED DESKTOP MASTER REFERENCE.** Future desktop consumer pages should use the approved P01 image as their primary desktop visual source of truth.

**Continuity / reference instruction:** This is the primary visual anchor for the SerbisYO consumer experience. If no approved SerbisYO UI image exists yet, establish the core visual system here. Future consumer-facing desktop and mobile pages should inherit this page's logo treatment, palette, typography, marker style, filter chips, service-card language, spacing, shadows, and navigation behavior.

Design a **high-fidelity desktop web UI concept** for **SerbisYO**, a community-powered service intelligence, discovery, and transparency platform. This is the main **Explore / Home page**, and it should immediately communicate that SerbisYO is not just a review site, but a **map-first decision-making platform** that helps users know **where to go, when to go, what to expect, and which provider is more reliable**.

Use a **modern 35/65 split desktop layout**, where the **left 35%** contains a vertical list of nearby service results and the **right 65%** contains a large, interactive map. The map should feel like the main canvas of the product, while the left panel should feel like a smart, floating service sheet layered beside it rather than a rigid dashboard sidebar. The overall design must feel **brand new, ergonomic, spatial, soft, and trustworthy**, combining the feeling of a **modern map app, local discovery platform, and service intelligence workspace**. It should not look like a traditional admin dashboard, corporate analytics panel, or a direct Google Maps clone.

The **top area** should have a sleek floating navigation bar with the **SerbisYO logo** on the left, a large rounded **search bar** in the center with placeholder text like **“Search a service or place”**, and a profile/avatar control on the right. Under or beside the search bar, include a row of compact **rounded category and utility chips**, such as **Government, Clinics, Food, Banks, Education, Open Now, Shortest Wait, Highest Reliability, Accessible**. These chips should feel lightweight and modern, with a clear active state.

The **left-side results panel** should display **3 to 5 nearby service cards**, each designed to help users make quick decisions. Every card should clearly show:

- Service/provider name
- Category
- Open or closed status
- Short address or distance
- **Average waiting time**
- **SerbisYO Score**
- **Reliability percentage**
- **Community Confidence**
- A short human insight such as **“Usually quieter after 3 PM.”** or **“Most reliable in the area.”**

Use realistic local examples such as **Morong Municipal Office, Rizal Family Clinic, URS Registrar, Bayanihan Pharmacy, and Teresa Water District**. One selected service card should be visually emphasized, slightly elevated, and clearly linked to a selected marker on the map.

The **map section** should occupy most of the screen and display multiple custom **SerbisYO location markers**. Make the markers clean, modern, and distinct from default map pins. One selected marker should show a compact floating map card with content such as **Average Wait: 24 min**, **Reliability: 91%**, **Community Confidence: High**, and **Open until 5:00 PM**.

The design language should use soft layered white or off-white surfaces, gentle shadows, moderate rounded corners, clean premium typography, calm map coloring, restrained modern brand accents, and generous spacing. The interface should visually communicate that SerbisYO turns community experiences into **actionable service intelligence**, not just ratings. Make it presentation-worthy but realistic enough to implement.

---

# P02 — Explore / Home Mobile

**Approval status:** **APPROVED MOBILE MASTER REFERENCE.** Future mobile consumer pages should use the approved P02 image as their primary mobile visual source of truth and preserve its responsive relationship to P01.

**Continuity / reference instruction:** If **P01 Explore / Home Desktop** has already been generated, use that generated desktop image as the **primary visual source of truth**. Do not invent a different mobile brand or component style. Preserve the same SerbisYO logo, color palette, typography, category/filter chip language, custom service-marker design, service-card styling, SerbisYO Score treatment, reliability/confidence indicators, icon family, radii, and visual tone. Recompose the desktop 35/65 results-and-map workspace into a **single portrait mobile experience** using a full-screen map, floating search/filter controls, a draggable bottom service sheet, and bottom navigation.

Design a **high-fidelity mobile UI concept** for the SerbisYO Explore experience on a modern smartphone. Preserve the same information model as desktop, but recompose it for a one-handed map-first mobile experience rather than shrinking the desktop split layout.

Use a **full-height map** as the main canvas. At the top, place a floating rounded search bar reading **“Search services”**, a compact location indicator, and horizontally scrollable category/filter chips such as **Government, Clinics, Open Now, Accessible, Shortest Wait**. Keep the map visible behind these elements.

Show several custom SerbisYO service markers. One selected marker should be visually emphasized with a branded halo or expanded marker state. At the bottom, place a **draggable bottom sheet / service preview card** showing the selected provider with:

- Provider name
- Category
- Open/closed state
- Average wait
- Reliability
- SerbisYO Score
- Community confidence
- One concise insight

Example: **Morong Municipal Office — Government — Open — 24 min wait — 91% reliable — High confidence — Usually quieter after 3 PM.**

Include compact bottom navigation with **Explore, Contribute, Saved, Profile**. The design should feel modern, airy, spatial, and highly ergonomic, with controls placed for thumb reach. The selected bottom card and marker should clearly feel connected. Avoid clutter, dense labels, or generic map-app styling. The result should feel like a premium local-discovery product adapted specifically to service transparency.

Generation requirement: output **only this single mobile Explore screen**. Do not place desktop and mobile versions side by side.

---

# P03 — Service Profile Desktop

**Continuity / reference instruction:** If **P01 Explore / Home Desktop** has already been generated, use that image as the direct visual reference. Preserve its top navigation, brand palette, typography, map treatment, marker style, panel surfaces, radii, shadows, spacing, and metric language. The selected service card from P01 should feel as if it naturally expands into this Service Profile rather than opening a separately designed product.

Design a **high-fidelity desktop web UI concept** for the **SerbisYO Service Profile page**, showing the detailed profile of **Morong Community Health Center**. This page appears after a user selects a service from Explore, so it must preserve the feeling that the user is still inside the same spatial experience. It should feel like the selected service card has naturally expanded into a deeper **service intelligence profile**, not like navigation into an unrelated dashboard.

Create a desktop layout where the **left side** contains a large structured service-information sheet and the **right side** still keeps part of the map visible, with the provider’s marker highlighted. The page should feel **modern, layered, calm, highly readable, and intelligent**, designed around the idea that a user should understand the provider within about **10 seconds**, then scroll for deeper context.

At the top, show:

- **Morong Community Health Center**
- Category: **Clinic / Healthcare**
- Address/location
- Open/closed state
- Operating hours
- Contact details
- Short one-line provider description

Prominently feature a **Decision Summary / Service Intelligence Summary** with:

- **SerbisYO Score: 87/100**
- **Average Wait: 24 min**
- **Typical Processing Time: 15–20 min**
- **Reliability: 91%**
- **Community Confidence: High**

Include one concise insight such as **“Usually reliable, but busiest from 11 AM to 1 PM.”**

Below, create a **Community Intelligence** section with **Service Quality, Reliability / Consistency, Time & Efficiency, Information Accuracy, and Accessibility**. Use a varied mix of compact bars, labeled score strips, and small visual summaries rather than five identical large cards.

Add a compact **Busy Hours** visualization, **Services Offered**, **Accessibility Notes**, and **Recent Community Experiences**. Community entries should include visit time/date, service used, actual wait, and a short note, for example: **“Document Request — 11:20 AM — Waited 28 min — Staff was helpful but line was long near lunch.”**

Include clear actions: **Contribute Experience**, **Suggest an Update**, **Report Incorrect Information**, and **View on Map**. Match the Explore visual language: light layered surfaces, restrained brand accent, premium typography, soft shadows, thoughtful spacing, and a calm visible map. Avoid Yelp-like review aesthetics or an enterprise analytics dashboard.

---

# P04 — Service Profile Mobile

**Continuity / reference instruction:** If **P03 Service Profile Desktop** and **P02 Explore Mobile** already exist, combine their established rules: inherit P03's information hierarchy, metric treatments, sections, provider identity, and actions while inheriting P02's mobile shell, typography scale, bottom-sheet behavior, marker style, bottom navigation, and touch ergonomics. This should look unmistakably like the responsive mobile version of P03.

Design a **high-fidelity mobile SerbisYO Service Profile** that feels like it grows naturally from a selected Explore map card into a full-height detail sheet. Preserve spatial context by keeping a small map preview or selected marker visible near the top before the service details begin.

Show **Morong Community Health Center**, its category, address, open state, and operating hours. Immediately beneath, present the most important decision information in a compact mobile hierarchy:

- **SerbisYO Score 87/100**
- **24 min average wait**
- **15–20 min processing**
- **91% reliability**
- **High community confidence**

Add the insight **“Usually reliable, but busiest from 11 AM to 1 PM.”**

As the user scrolls, reveal **Busy Hours**, **Services Offered**, **Service Quality**, **Information Accuracy**, **Accessibility**, and **Recent Community Experiences**. Keep **Contribute Experience** visible as a prominent sticky or bottom action. Secondary actions such as **Suggest Update** and **Report Information** can appear lower in the page.

Use soft rounded sections, compact metrics, clean spacing, and a travel-app-like rhythm without looking playful or tourist-focused. Avoid cramming all desktop information above the fold. The page should feel calm, trustworthy, and easily scannable with one hand.

Generation requirement: output **only this single mobile Service Profile screen**. Do not combine it with Explore or desktop layouts.

---

# P05 — Contribute Experience Overview Desktop

**Continuity / reference instruction:** If **P01** and/or **P03** have already been generated, use them as the established desktop SerbisYO design system. Preserve the same header/navigation shell, typography, colors, control radii, button styling, card surfaces, spacing rhythm, and provider identity. This contribution flow should feel like a task entered from P03's **Contribute Experience** action, not a new standalone form product.

Design a **high-fidelity desktop web UI concept** for the **SerbisYO Contribute Experience workflow**, where users submit their real experience after using a service. This screen is central to the product because SerbisYO depends on structured community data. The contribution experience should feel **quick, useful, modern, credible, and user-friendly**, never like a long institutional survey.

Create a **guided multi-step desktop flow** that is clearly adaptable to mobile. Use a clean centered main panel with a compact provider context area and a subtle step indicator across the top:

1. **Service**
2. **Visit**
3. **Experience**
4. **Review**

Show the selected provider in a small context card:

- **Morong Community Health Center**
- **Clinic / Healthcare**
- Morong, Rizal
- Small map/marker preview

The visible main step should be **“How was your visit?”** and should collect:

- Waiting time
- Processing/service time
- Was the service available?
- Was the posted information accurate?

Use user-friendly controls such as segmented buttons, clear numeric/time inputs, and large touch-friendly options. Another step should collect structured ratings for **Service Quality, Accessibility, and Overall Experience**, preferably using labeled scales such as **Poor → Fair → Good → Very Good → Excellent** rather than only generic stars.

The final step should include an optional short comment field with **“Anything others should know?”**, followed by a compact submission summary. The primary CTA should be **Share Experience**. Show a believable completion state somewhere in the composition with the message **“Experience added. You just helped the next person know what to expect.”** and actions **Back to Service** and **View Updated Insights**.

Use the same SerbisYO visual system as Explore and Service Profile: soft neutral surfaces, modern rounded controls, subtle shadows, strong typography, clean spacing, minimal decoration, and a restrained brand accent. The design should clearly communicate that SerbisYO is collecting structured service intelligence, not random opinions.

---

# P06 — Contribute Experience Mobile Overview

**Continuity / reference instruction:** If **P05 Contribute Experience Desktop** exists, treat it as the form/workflow source of truth; if **P02/P04** exist, use them for mobile navigation, typography scale, spacing, and component density. Preserve the same provider context, four-step progress language, form controls, CTA styling, and brand system while adapting the flow to a portrait mobile canvas.

Generate **one dedicated high-fidelity mobile UI screen only** for the **SerbisYO Contribute Experience workflow**. Do not generate a collage, multiple steps in separate frames, or a desktop/mobile comparison. The output must show **one smartphone screen** that clearly represents the contribution flow.

Design a **mobile-first multi-step guided form** for submitting a real service experience. The experience should feel simple, friendly, fast, and trustworthy, optimized for one-handed smartphone use. At the top, show a compact progress indicator for:

1. **Service**
2. **Visit**
3. **Experience**
4. **Review**

Keep a small provider context header visible for **Morong Community Health Center**, **Clinic / Healthcare**, **Morong, Rizal**, with a subtle map marker or location cue.

The visible step should be **“How was your visit?”** and include touch-friendly controls for:

- Waiting time
- Processing/service time
- Was the service available? — **Yes / No / Partly**
- Was the posted information accurate? — **Yes / No / Partly**

Use soft rounded inputs, segmented controls, clear labels, comfortable spacing, and a sticky bottom **Next** button positioned for thumb reach. The screen may subtly hint that later steps collect **Service Quality**, **Accessibility**, **Overall Experience**, and an optional note, but do not show multiple separate page mockups in the same image.

Use the same SerbisYO visual language as Explore and Service Profile: soft light surfaces, restrained brand accent, modern readable typography, gentle shadows, premium spacing, and no unnecessary decoration. The result should feel like a real consumer mobile product for community-powered service transparency rather than a generic form app.

---

# P07 — Search / Autocomplete State

**Continuity / reference instruction:** Use the already-generated **P01 desktop Explore** as the reference for desktop search, or **P02 mobile Explore** when generating a mobile version. Search should appear as an expanded state of the existing Explore search field, preserving the same page shell, map, filter style, typography, colors, and service-result language.

Design a **high-fidelity SerbisYO search interaction state** that appears when a user activates the main search field from Explore. Keep the map and nearby service context visible in the background so the user does not feel transported into a separate search page.

Show a large active search field with the typed query **“clinic”**. Below it, display a floating search-suggestion panel with a clean hierarchy containing:

- Matching service categories such as **Clinic / Healthcare**
- Matching provider names such as **Rizal Family Clinic** and **Morong Community Health Center**
- Recent searches
- Nearby suggestions

Each provider suggestion may show a small icon or thumbnail, short location, open status, and one compact metric such as **18 min wait**. Use clear keyboard focus/selection styling on desktop and touch-friendly rows on mobile.

Include a small **Search this area** or **Nearby results** affordance if spatial context is useful. The interface should feel immediate and lightweight, with no full-page form. Use soft layered surfaces, precise spacing, clean typography, and a visible but subdued map beneath. Avoid turning autocomplete into a huge command palette or dense directory list.

---

# P08 — Filters / Sorting State

**Continuity / reference instruction:** Use **P01** for desktop or **P02** for mobile as the visual source of truth. This is an interaction state layered over Explore, so do not redesign the page. Preserve the existing map, search, chips, cards, and navigation; only expand the filtering/sorting control surface using the same component styling.

Design a **SerbisYO filter interface** layered over the Explore map. The filter experience should feel concise and decision-oriented rather than like an advanced settings page.

For desktop, use a floating popover or compact side-sheet positioned near the search/filter controls. For mobile, visually imply that the same structure becomes a draggable bottom sheet. Show filter groups for:

- **Open now**
- **Service category**
- **Accessibility**
- **Shortest wait**
- **Highest reliability**
- Optional **Community confidence**

Use rounded chips, toggles, or segmented controls with clear selected states. Show **Reset** and a strong primary action such as **Show 18 services** or **Apply filters**. Keep the map and a few service markers visible behind the filter surface to preserve spatial continuity.

Use the SerbisYO design language: light layered panels, restrained depth, modern typography, and generous touch targets. Avoid too many checkboxes, hidden advanced settings, or dense technical controls.

---

# P09 — Community Intelligence / Busy Hours Detail Desktop

**Continuity / reference instruction:** Use **P03 Service Profile Desktop** as the direct visual source of truth. This is an expanded desktop subview of the Service Profile, not a new product area. Preserve the same SerbisYO header, provider identity, typography, score colors, confidence treatment, progress bars, card/surface styling, map language, radii, shadows, spacing, and action hierarchy.

**Canvas / image size:** **1536 × 1024 px, 3:2 landscape.** Match the same desktop frame and overall density used by P01/P03. Do not generate a taller dashboard or a different aspect ratio.

**Recurring shell requirement:** Keep the desktop SerbisYO shell unchanged: SerbisYO logo top-left; large rounded `Search a service or place...` field across the upper center; `Morong, Rizal` location selector; notification bell with red unread dot; and the **canonical male profile avatar** at the far right. Use the same male avatar seen in the approved mobile references, even if an older desktop reference contains a woman. Keep the established category/utility chip row beneath the search/header where the Service Profile context shows it.

Generate **one dedicated high-fidelity desktop Community Intelligence / Busy Hours detail screen only** for **Morong Community Health Center**. Keep enough Service Profile context visible that the user understands where they came from.

Show a clear header such as **Community Intelligence** with the provider name beneath. Present the five core dimensions:

- **Service Quality**
- **Reliability / Consistency**
- **Time & Efficiency**
- **Information Accuracy**
- **Accessibility**

Use a refined combination of compact progress bars, score strips, short explanations, and confidence indicators. Include **Community Confidence: High** and a note such as **Based on 74 recent community contributions**.

Make **Busy Hours** a major but still human-readable section. Use a clean horizontal histogram or heat strip across the day, with clear periods such as **Usually quiet**, **Moderate**, and **Busiest**. Show a useful insight like **Busiest from 11 AM to 1 PM**.

Include one small recent-change insight such as **Average reported wait improved by 6 minutes compared with last week.** Keep this understandable and service-oriented, not finance-like.

If space allows, include a compact breakdown showing how many recent reports contributed to each metric or a small **Recent trends** area, but avoid dense analytics dashboards, pie charts, or excessive charting.

Use the exact SerbisYO desktop visual language from P03. **Generation requirement:** output only one desktop Community Intelligence detail screen.

---

# P10 — Community Intelligence / Busy Hours Detail Mobile

**Continuity / reference instruction:** Use **P09 Community Intelligence Desktop** as the information and metric source of truth, and use **P04 Service Profile Mobile** as the mobile shell and responsive visual reference. Preserve the same metric names, colors, confidence treatment, provider identity, typography, rounded surfaces, icon family, spacing rhythm, and mobile navigation language.

**Canvas / image size:** **941 × 1672 px, approximately 9:16 portrait.** Match the exact tall portrait proportion and content density of the approved mobile references. Do not generate a shorter phone mockup, multiple phones, or a desktop-width image.

**Recurring shell requirement:** Preserve the approved mobile header exactly in spirit and placement: iOS-style status bar, SerbisYO logo at upper-left, `Morong, Rizal` location selector, notification bell with red unread dot, and the **same canonical male avatar** at upper-right. Preserve the established `Explore / Contribute / Saved / Profile` bottom navigation if it is visible in the corresponding Service Profile mobile shell. Do not substitute a female avatar or invent a new profile photo.

Generate **one dedicated high-fidelity portrait mobile Community Intelligence / Busy Hours detail screen only**. Do not create a collage or desktop/mobile comparison.

Keep **Morong Community Health Center** visible in a compact top context header with a back action to the Service Profile. Present the five Community Intelligence dimensions as vertically stacked, thumb-friendly metric rows rather than shrinking desktop cards.

Show:

- **Service Quality**
- **Reliability / Consistency**
- **Time & Efficiency**
- **Information Accuracy**
- **Accessibility**
- **Community Confidence: High**
- **Based on 74 recent community contributions**

Place a compact but legible **Busy Hours** visualization below, optimized for portrait width. Clearly show the busiest period around **11 AM–1 PM** and quieter periods before/after. Include the same recent-change insight from P09.

Keep the design vertically scannable, readable with one hand, and consistent with P04. Avoid tiny desktop charts, horizontal overflow, or dense dashboard behavior.

**Generation requirement:** output only one portrait mobile Community Intelligence detail screen.

---

# P11 — Contribution Workflow Board Desktop

**Continuity / reference instruction:** Use **P05 Contribute Experience Desktop** as the primary visual source of truth and **P03 Service Profile Desktop** as the provider/context reference. This is a deliberate **multi-screen workflow board exception** to the one-screen-per-image rule. The board must document the complete desktop contribution workflow in chronological order while preserving one coherent SerbisYO desktop design system across all four panels.

**Canvas / image size:** **1536 × 1024 px, 3:2 landscape.** Use one single desktop design board containing **four clearly separated desktop interface panels** in chronological order. Do not make a random collage. Each panel should have the same aspect-ratio feel, header shell, provider identity, typography, controls, colors, radii, shadows, and spacing system.

**Recurring shell requirement:** Every panel must reuse the same desktop SerbisYO shell: SerbisYO logo top-left, large rounded `Search a service or place...` field, `Morong, Rizal` location selector, notification bell with red unread dot, and the **canonical male profile avatar** at far right. Keep the same blue/green SerbisYO visual language and the same **Morong Community Health Center** context throughout.

Generate **one high-fidelity desktop workflow board** showing the complete contribution sequence as **four desktop screens/panels arranged left-to-right or top-left → top-right → bottom-left → bottom-right** with obvious chronological numbering and arrows:

### **1. Service — Confirm the service you used**

Show the provider context for **Morong Community Health Center**, Clinic / Healthcare, Morong, Rizal, with a small map/marker preview. Keep the four-step progress indicator with **Service** active.

Include a service selector with realistic choices:

- General Consultation
- Medical Records Request
- Vaccination
- Laboratory Services

Include visit date/time controls and a simple confirmation such as **This is the correct place**. Primary CTA: **Next: Visit Details**.

### **2. Visit — How was your visit?**

Advance the progress indicator to **Visit**. Keep the same provider and page shell.

Collect:

- Waiting time: `< 5 min`, `5–15 min`, `15–30 min`, `30–60 min`, `> 1 hr`
- Processing time using the same ranges
- Was the service available? — **Yes / No / Partly available**
- Was the posted information accurate? — **Yes / No / Somewhat accurate**
- Optional note: **Anything others should know?**

Primary CTA: **Next: Rate Your Experience**.

### **3. Experience — How was the service?**

Advance the progress indicator to **Experience**. Keep the exact same contribution shell.

Collect structured ratings for:

- **Service Quality**
- **Accessibility**
- **Overall Experience**

Use labeled scales such as **Poor, Fair, Good, Very Good, Excellent** rather than only stars. Include an optional short accessibility note if space allows.

Primary CTA: **Next: Review Your Experience**.

### **4. Review — Review your experience**

Advance the progress indicator to **Review**.

Show a compact summary of:

- Provider and selected service
- Visit date/time
- Waiting time
- Processing time
- Service availability
- Information accuracy
- Service quality
- Accessibility
- Overall experience
- Optional community note

Include small **Edit** affordances per section and a reassuring note that the contribution helps improve community service information.

Primary CTA: **Share Experience**. Secondary CTA: **Back**.

### Board composition rules

- All four screens must be clearly readable as one chronological workflow.
- Use labels such as **1 Service → 2 Visit → 3 Experience → 4 Review** across the board.
- Do not show the Contribution Success state here; that remains a separate prompt after submission.
- Do not redesign the header, provider, controls, or navigation between panels.
- Do not show different avatars between panels.
- Keep forms concise enough to fit the board while retaining the key interactions.
- The board should look like a **product-flow design board**, not four unrelated screenshots pasted together.

**Generation requirement:** output **one 1536 × 1024 desktop board containing exactly four chronological desktop contribution screens**.

---

# P12 — Contribution Workflow Board Mobile

**Continuity / reference instruction:** Use **P11 Contribution Workflow Board Desktop** as the exact workflow/content source of truth and use **P06 Contribute Experience Mobile** plus **P04 Service Profile Mobile** as the mobile visual references. This is a deliberate **multi-screen workflow board exception**. The mobile board must show the same four-step contribution sequence as P11, recomposed consistently for the approved SerbisYO mobile format.

**Canvas / image size:** **941 × 1672 px, approximately 9:16 portrait.** Use one tall portrait **mobile workflow board** containing **four miniature but clearly legible portrait app screens/panels in chronological order**. Arrange them as a clean 2×2 board or vertical sequence inside the canvas, but each panel must remain recognizably a phone-screen composition. Do not generate multiple floating phone mockups with different styles.

**Recurring shell requirement:** Every mobile panel must preserve the approved mobile SerbisYO shell: iOS-style status bar, SerbisYO logo at upper-left, `Morong, Rizal` location selector, notification bell with red unread dot, the **same canonical male avatar** at upper-right, and the established bottom navigation **Explore / Contribute / Saved / Profile** with **Contribute** active where visible.

Generate **one high-fidelity mobile workflow board** showing these four screens in chronological order:

### **1. Service — Confirm the service you used**

Show compact provider context for **Morong Community Health Center**. Keep **Service** active in the progress indicator. Use large touch-friendly service-selection rows for:

- General Consultation
- Medical Records Request
- Vaccination
- Laboratory Services

Include mobile date/time controls and **This is the correct place** confirmation. Sticky CTA: **Next: Visit Details**.

### **2. Visit — How was your visit?**

Show **Visit** active. Stack the controls vertically for thumb-friendly use:

- waiting time
- processing time
- service availability
- posted information accuracy
- optional note

Use the same ranges and choices as P11. Sticky CTA: **Next: Rate Your Experience**.

### **3. Experience — How was the service?**

Show **Experience** active. Stack **Service Quality, Accessibility, Overall Experience** vertically with large labeled controls using **Poor → Fair → Good → Very Good → Excellent**. Include optional accessibility note. Sticky CTA: **Next: Review Your Experience**.

### **4. Review — Review your experience**

Show **Review** active. Present the entered information as compact stacked review cards with small **Edit** affordances. Include the optional note and a prominent sticky **Share Experience** CTA.

### Board composition rules

- All four panels must use the same mobile proportions and visual language.
- Show explicit chronology: **1 Service → 2 Visit → 3 Experience → 4 Review**.
- Preserve identical provider artwork, avatar, typography, controls, colors, and bottom navigation across the board.
- Do not include the post-submission success screen on this board.
- Avoid shrinking text until it becomes unreadable; simplify secondary microcopy if needed.
- This should look like one cohesive **mobile UX flow board**, not four unrelated phones.

**Generation requirement:** output **one 941 × 1672 portrait board containing exactly four chronological mobile contribution screens**.

---

# P13 — Contribution Success Desktop

**Continuity / reference instruction:** This is the immediate completion state after **P11**. Preserve the same desktop contribution shell, provider context, brand styling, button language, layout proportions, and page background. Transition the form body into a success state instead of opening a separately designed page.

Generate **one dedicated high-fidelity desktop success screen**.

Display:

**Experience added. You just helped the next person know what to expect.**

Show a compact provider summary and a subtle indication that community data has updated, such as **74 → 75 contributions**, the submitted wait time, or a refreshed confidence indicator.

Include two actions:

- **View Updated Insights**
- **Back to Service**

Use one restrained celebratory moment such as a soft checkmark, subtle marker glow, or small confirmation motion. Avoid confetti, badges, points, or gamification.

**Generation requirement:** output only one desktop contribution success screen.

---

# P14 — Contribution Success Mobile

**Continuity / reference instruction:** Use **P13** as the success-state content source of truth and **P06/P12** as the mobile contribution shell. Preserve the same provider context, brand styling, typography, buttons, rounded surfaces, and bottom navigation.

Generate **one dedicated portrait mobile contribution success screen** with the same message and updated-data cue from P13. Stack **View Updated Insights** and **Back to Service** as clear thumb-friendly actions.

Use a restrained confirmation visual and keep the screen visually continuous with the contribution flow that preceded it.

**Generation requirement:** output only one portrait mobile success screen.

---

# P15 — Suggest an Update Desktop

**Continuity / reference instruction:** This action originates from **P03 Service Profile Desktop**. Keep the underlying Service Profile visible or contextually implied and use the same desktop modal language, typography, radii, buttons, provider identity, shadows, and spacing.

Generate **one dedicated high-fidelity desktop Suggest an Update state**.

Open a compact modal or floating sheet titled **Suggest an update** for **Morong Community Health Center**. Show selectable issue types:

- Operating hours
- Address/location
- Service no longer available
- Contact information
- Accessibility information
- Other service detail

After an issue is selected, reveal a corrected-value field and optional explanation. Include the reassurance **Community updates are reviewed before they affect service information.**

Use **Send Update** as the primary action and **Cancel** as secondary. Keep the underlying Service Profile/map context visible enough to reinforce where the action came from.

**Generation requirement:** output only one desktop Suggest an Update interaction state.

---

# P16 — Suggest an Update Mobile

**Continuity / reference instruction:** Use **P15** as the workflow/content source of truth and **P04 Service Profile Mobile** as the mobile visual source. This should feel like the mobile counterpart of the same Service Profile action.

Generate **one dedicated portrait mobile Suggest an Update state** using a rounded draggable bottom sheet over the Service Profile.

Show the same issue types, corrected-value field, optional explanation, reassurance text, **Send Update**, and **Cancel**. Use large touch targets and preserve the P04 mobile typography, spacing, surfaces, and icon family.

**Generation requirement:** output only one portrait mobile Suggest an Update state.

---

# P17 — Report Information / Contribution Desktop

**Continuity / reference instruction:** Use **P03 Service Profile Desktop** and **P15 Suggest an Update Desktop** as visual references. Preserve the same desktop overlay/modal treatment, provider context, typography, spacing, buttons, semantic colors, and action hierarchy. Reporting should feel like a sibling workflow to Suggest Update.

Generate **one dedicated high-fidelity desktop Report Information state**.

Show the reported provider or contribution in a compact preview. Offer reasons such as:

- Spam
- Fake or misleading contribution
- Abusive content
- Irrelevant content
- Privacy concern
- Other

Include an optional explanation field and actions **Submit Report** and **Cancel**. Add concise text explaining that reports help keep community information useful and trustworthy.

Use restrained semantic colors and avoid a red-dominated punitive design.

**Generation requirement:** output only one desktop Report Information interaction state.

---

# P18 — Report Information / Contribution Mobile

**Continuity / reference instruction:** Use **P17** as the report-workflow source of truth and **P04/P16** as the mobile visual reference. Preserve the same provider/contribution preview, reason labels, explanation field, button hierarchy, typography, spacing, and neutral tone.

Generate **one dedicated portrait mobile Report Information state** as a rounded bottom sheet or focused modal over the Service Profile.

Keep the same reasons and actions **Submit Report** and **Cancel**, but recompose them with large touch targets and a scroll-safe mobile layout. The tone should remain serious and fair without aggressive warning styling.

**Generation requirement:** output only one portrait mobile Report Information state.

---

# P19 — Saved Services Desktop

**Continuity / reference instruction:** Use **P01 Explore Desktop** as the primary desktop visual reference. Reuse the exact service-card component language, top navigation, search/brand treatment, score/reliability/confidence indicators, typography, and spacing. Saved Services should feel like another destination in the same consumer app, not a dashboard redesign.

Design a **high-fidelity desktop Saved Services page** for SerbisYO. The page should allow users to revisit services they are considering without becoming another dashboard.

Use a clean list/grid hybrid or a narrow saved-service list with optional mini-map context. Each saved provider should show:

- Provider name
- Category
- Open/closed state
- Average wait
- Reliability
- SerbisYO Score
- One short insight

Include lightweight sorting such as **Recently Saved, Distance, Reliability**. If using a mini map, selected saved services should use the same SerbisYO marker language from Explore. Provide a simple empty state possibility such as **“Save services to compare or revisit them later.”**

Keep the visual language quiet, useful, and consistent with Explore rather than inventing a new page style.

---

# P20 — Saved Services Mobile

**Continuity / reference instruction:** If **P19 Saved Services Desktop** and **P02 Explore Mobile** exist, inherit P19's content/card hierarchy and P02's mobile navigation, typography, spacing, touch targets, and overall portrait shell. This should be the responsive mobile version of P19.

Design a mobile SerbisYO **Saved Services** page. Use a clean vertical list with compact service cards that preserve the same metrics and hierarchy from Explore. Each card should show provider name, category, open state, average wait, reliability, and a small saved/bookmark indicator.

Include a simple sort/filter control at the top and optional `View on map` action. Bottom navigation should remain visible with **Saved** selected. Keep the page highly scannable and thumb-friendly, with no dense map unless the user chooses to open one.

---

# P21 — User Profile / Activity Desktop

**Continuity / reference instruction:** Use **P01/P03** as the established desktop product design system. Preserve the same top navigation, typography, colors, card surfaces, iconography, radii, spacing, and metric styling while changing the content focus to personal activity. Do not introduce a social-media visual system.

Design a **desktop SerbisYO User Profile / Activity page** focused on useful participation history rather than social networking.

At the top, show a clean identity block with avatar, name, contribution count, saved services count, and a small community-help summary such as **“12 experiences shared”**. Below, use a balanced two-column layout:

- Left: **Recent Contributions** with provider, service, visit date, wait time, and contribution status.
- Right: **Saved / Recently Viewed Services** with compact service intelligence cards.

Include simple account/settings access but avoid followers, likes, social feeds, badges, levels, or competitive leaderboards. The page should feel like a personal utility area in the same premium SerbisYO system.

---

# P22 — User Profile / Activity Mobile

**Continuity / reference instruction:** If **P21 Profile Desktop** and **P02/P04 mobile** exist, use P21 for content hierarchy and P02/P04 for the mobile shell, bottom navigation, card density, typography scale, and touch ergonomics. Keep Profile visually consistent with the rest of the mobile app.

Design a mobile SerbisYO **Profile / Activity** screen inspired by premium travel/profile apps but adapted for community service participation.

Show avatar, name, contribution count, saved-service count, and a concise line such as **“Helping improve service information in your community.”** Below, use grouped rows or compact cards for:

- My Contributions
- Saved Services
- Recent Activity
- Account / Settings

Show one or two recent contribution previews but keep the page simple. Bottom navigation should have **Profile** selected. Use soft surfaces, modern typography, and restrained visual warmth without becoming social-media-like.

---

# P23 — Login / Register

**Continuity / reference instruction:** Use the approved consumer-facing SerbisYO pages, especially **P01/P02**, as the brand source of truth. Preserve logo, typography, palette, button styling, form-field styling, radii, shadows, and background language. Authentication may be simpler, but it should unmistakably belong to the same product.

Design a minimal **SerbisYO authentication screen** for the hackathon prototype. The page should feel like part of the product rather than a generic template.

Use a split or centered composition with subtle map/service context in the background. Show SerbisYO branding and concise value copy such as **“Share experiences. Save services. Help your community know what to expect.”**

Include simple fields for email and password, **Sign In**, and a clear switch to **Create Account**. Registration can request only essential information such as name, email, and password. Include a lightweight option to continue exploring without signing in if the product flow permits it.

Avoid decorative illustrations that dominate the page, complicated social-login grids, or enterprise security aesthetics. Keep the screen clean, modern, and trustworthy.

---

# P24 — Simple Service Comparison (Should-Have)

**Continuity / reference instruction:** Use **P01 service cards** and **P03 Service Profile metrics** as the component source of truth. Reuse the exact metric names, score colors, provider identity style, typography, and actions. Comparison should reorganize existing SerbisYO information, not invent new cards or visual conventions.

Design a **SerbisYO service comparison view** for comparing two or three nearby providers. This is a should-have feature and should look useful without turning into a spreadsheet.

Show provider names across the top or as side-by-side cards. Compare only the most decision-relevant fields:

- Open status
- Distance
- Average wait
- Processing time
- Reliability
- SerbisYO Score
- Accessibility
- Community Confidence

Highlight differences clearly using typography, restrained semantic indicators, and short insights such as **“Shortest wait”** or **“Highest confidence”**. Include actions **View Profile** and **View on Map**.

Avoid declaring an absolute “winner.” The goal is transparent comparison so the user decides based on their own priorities.

---

# P25 — No Results / Empty Search State

**Continuity / reference instruction:** This is a state of **P01 desktop Explore** or **P02 mobile Explore**, not a new page. Preserve the exact map, navigation, search, filters, panel/sheet, typography, and colors from the corresponding Explore image; replace only the result content with the empty-state message and recovery actions.

Design a SerbisYO **No Results** state inside the Explore map experience. The map should remain visible, but the service panel should clearly explain:

**“No matching services found in this area.”**

Offer useful actions:

- Clear filters
- Search a wider area
- Try another category

Use a simple friendly illustration or subtle map icon only if necessary. Do not turn the screen into a blank error page. Maintain continuity with the search and map so the user can recover immediately.

---

# P26 — No Community Data State

**Continuity / reference instruction:** This is a state of **P03 desktop Service Profile** or **P04 mobile Service Profile**. Preserve the same provider header, layout, metrics area, typography, map context, and actions. Replace unavailable community metrics with a truthful no-data treatment instead of creating a differently styled page.

Design a SerbisYO **service profile with no community contributions yet**. The provider still has official/basic information, but community intelligence is not available.

Where metrics would normally appear, show a clear empty state:

**“No community experience yet.”**

Supporting text:

**“Be the first to help others know what to expect.”**

Include a prominent **Contribute Experience** action. Do not fabricate zero scores or imply that lack of data means poor service. Keep the page informative, trustworthy, and optimistic.

---

# P27 — Loading / Map Failure State

**Continuity / reference instruction:** Use **P01/P02 Explore** as the source of truth. Preserve navigation, search, service-card/list styling, colors, typography, and layout. Only replace the failed map region with the degraded-state treatment while keeping usable service-list functionality visible.

Design a resilient **SerbisYO degraded-state screen** for when map tiles or location services fail but service-list data is still available.

Keep the service results list usable. Replace the map with a calm placeholder panel explaining **“Map unavailable right now”** and provide actions such as **Retry Map** and **Use Service List**. Search and filters should remain functional if possible.

Use restrained error styling and clearly communicate what still works. Avoid full-page failure screens, technical error codes, or alarming red visuals.

---

# P28 — Moderator Queue Desktop

**Continuity / reference instruction:** Use the established SerbisYO desktop design system from **P01/P03**, especially typography, palette, radii, buttons, surfaces, and iconography, but simplify the composition for an internal utility workspace. The moderator experience may be denser, but should still clearly belong to SerbisYO.

Design a **desktop internal moderation workspace** for SerbisYO. Use the established design system but make the layout more utilitarian than the consumer experience.

Show a queue of **Pending Corrections** and **Reported Contributions** in a left column. Each item should show provider, report type, reason, submitted time, and status. On the right, show a review detail pane with:

- Original information/content
- Suggested correction or reported text
- Submission metadata
- Short context
- Clear actions **Approve**, **Reject**, and optional **Request Review**

Use neutral surfaces, clear text hierarchy, and minimal decorative styling. The goal is fair community governance, not a large enterprise admin suite.

---

# P29 — Moderator Detail / Report Review

**Continuity / reference instruction:** Continue directly from **P28 Moderator Queue**. Preserve the same internal navigation, queue/detail architecture, typography, buttons, semantic colors, spacing, and report-card language. This is a focused detail state of the same moderation workspace.

Design a focused SerbisYO **moderator report-review screen** showing one reported community contribution in detail.

Display:

- Provider name
- Report reason
- Original contribution
- Visit/service context
- Submitted timestamp
- Reporter explanation
- Relevant previous moderation status if any

Place actions **Keep Contribution**, **Remove Contribution**, and **Escalate / Needs Review** with clear hierarchy. Use calm neutral UI and restrained warning colors. Include enough context to make a fair decision without making the interface feel punitive.

---

# P30 — Future Provider Dashboard

**Continuity / reference instruction:** Use **P03 Service Profile** and **P28 moderation/internal utility styling** as references. Preserve SerbisYO's metric names, score/confidence treatments, typography, colors, and surfaces while adapting the information for a verified provider perspective. Do not create an unrelated enterprise dashboard brand.

Design a **future-scope desktop provider dashboard** for SerbisYO. This is pitch-only and should not be treated as a hackathon MVP requirement.

Show a verified provider profile and current community intelligence including:

- Average wait
- Reliability
- Information accuracy
- Accessibility
- Community confidence
- Recent trend

Add sections for:

- **Update Official Information**
- **Respond to Feedback**
- **Recurring Issues**
- **Recent Community Insights**

Keep the interface operational and improvement-focused rather than defensive. Avoid dense business analytics or competitive rankings. The purpose is to show how providers could use community data to improve service.

---

# P31 — Future Official vs Community View

**Continuity / reference instruction:** Continue from **P30 Provider Dashboard** and reuse the established provider-side navigation, typography, color semantics, cards, metric language, and spacing. This should appear as a deeper provider transparency view inside the same future provider product area.

Design a future SerbisYO provider transparency page comparing **Official Service Information** with **Community-Reported Experience**.

Show simple paired comparisons such as:

- Expected processing time **20 min** vs community average **31 min**
- Posted closing time **5:00 PM** vs confirmed recent reports
- Stated accessibility features vs community accessibility reports
- Service availability vs recent availability reports

Use a clean comparison layout with explanations and improvement opportunities. Avoid accusatory colors or framing. The visual purpose is transparency and service improvement, not public shaming.

---

# P32 — SerbisYO UI Component System / Design Board

**Continuity / reference instruction:** If consumer screens have already been approved, extract the component language from the **actual generated P01/P03/P02/P04/P05/P06 images** rather than inventing a new design system. This board should document and normalize the already-established SerbisYO components.

Create a high-fidelity **SerbisYO UI component and visual-system board** for the design team. This is not a user-facing page; it is a reference sheet showing the core reusable interface language.

Include:

- Search bar states
- Category/filter chips
- Primary/secondary buttons
- Service result card
- Selected service card
- SerbisYO Score badge
- Reliability indicator
- Community Confidence badge
- Open/closed status chip
- Custom map marker states
- Form fields
- Segmented controls
- Bottom sheet header
- Toast/success message
- Empty-state treatment
- Typography scale
- Color roles using the placeholder brand accent until final primary color is supplied

Arrange everything like a premium product design system board with clear spacing and consistent tokens. Avoid excessive annotations or developer-style documentation; focus on visual consistency and practical reusable components.

---

# P33 — Map Marker and Service Card Exploration Board

**Continuity / reference instruction:** Use the approved **P01/P02 Explore** images as the source of truth for existing marker and service-card forms. Explore refinements and states that remain recognizably the same components; do not replace them with an unrelated marker/card family unless the team intentionally decides to redesign the core identity.

Create a focused visual exploration sheet for **SerbisYO map markers and service cards**, since these are signature product elements.

Show several coherent states rather than unrelated variations:

- Default provider marker
- Selected marker
- Closed/unavailable marker
- High-confidence marker treatment
- Cluster marker for multiple nearby services
- Compact map label
- Default service card
- Selected service card
- Mobile preview card
- Small floating map info card

Use one consistent SerbisYO visual language. Markers should be recognizable without depending only on category color. Cards should prioritize provider name, open state, average wait, reliability, score, confidence, and one short insight. The exploration should feel implementation-ready and distinctive enough to become SerbisYO’s visual signature.

---

# Retrieval Order

The prompt library keeps already-processed P01–P10 unchanged. The four detailed contribution steps have been consolidated into **two board prompts** so only one desktop board and one mobile board are needed for the chronological contribution flow.

## Approved / processed core

1. **P01 — Explore / Home Desktop**
2. **P02 — Explore / Home Mobile**
3. **P03 — Service Profile Desktop**
4. **P04 — Service Profile Mobile**
5. **P05 — Contribute Experience Desktop**
6. **P06 — Contribute Experience Mobile**
7. **P07 — Search / Autocomplete**
8. **P08 — Filters / Sorting**
9. **P09 — Community Intelligence / Busy Hours Desktop**
10. **P10 — Community Intelligence / Busy Hours Mobile**

## Consolidated contribution workflow boards

11. **P11 — Contribution Workflow Board Desktop** — four chronological panels: Service → Visit → Experience → Review
12. **P12 — Contribution Workflow Board Mobile** — responsive mobile counterpart of P11

## Post-contribution and trust flows

13. **P13 — Contribution Success Desktop**
14. **P14 — Contribution Success Mobile**
15. **P15 — Suggest an Update Desktop**
16. **P16 — Suggest an Update Mobile**
17. **P17 — Report Information Desktop**
18. **P18 — Report Information Mobile**

## Personal utility

19. **P19 — Saved Services Desktop**
20. **P20 — Saved Services Mobile**
21. **P21 — User Profile / Activity Desktop**
22. **P22 — User Profile / Activity Mobile**
23. **P23 — Login / Register**

## Optional and state screens

24. **P24 — Service Comparison**
25. **P25 — No Results / Empty Search**
26. **P26 — No Community Data**
27. **P27 — Loading / Map Failure**

## Internal tools

28. **P28 — Moderator Queue Desktop**
29. **P29 — Moderator Detail / Report Review**

## Future-scope pitch concepts

30. **P30 — Future Provider Dashboard**
31. **P31 — Future Official vs Community View**

## Design-system references

32. **P32 — SerbisYO UI Component System Board**
33. **P33 — Map Marker and Service Card Exploration Board**

## Prompt retrieval rule

When the Team Leader asks for a prompt ID, return the exact current prompt plus its continuity/reference instruction. P11/P12 are intentionally multi-panel board prompts and are the only current exception to the normal one-screen-per-image rule for contribution steps.
