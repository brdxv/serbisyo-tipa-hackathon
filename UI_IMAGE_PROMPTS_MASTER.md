# SerbisYO Master UI/UX Image-Generation Prompt Library

This is the canonical prompt set for generating SerbisYO UI/UX concept images. Each numbered prompt represents a **different page, workflow step, major interface state, or reusable system surface**. When the team asks for prompts in groups, return them in numeric order unless a specific screen is requested.

The purpose of these images is to establish visual direction before implementation. They are not pixel-perfect specifications and should not copy any reference image exactly.

## Shared Design DNA for Every Prompt

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

---

# P01 — Explore / Home Desktop

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

# P02 — Service Profile Desktop

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

# P03 — Contribute Experience Overview Desktop

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

# P04 — Explore / Home Mobile

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

# P05 — Search / Autocomplete State

Design a **high-fidelity SerbisYO search interaction state** that appears when a user activates the main search field from Explore. Keep the map and nearby service context visible in the background so the user does not feel transported into a separate search page.

Show a large active search field with the typed query **“clinic”**. Below it, display a floating search-suggestion panel with a clean hierarchy containing:

- Matching service categories such as **Clinic / Healthcare**
- Matching provider names such as **Rizal Family Clinic** and **Morong Community Health Center**
- Recent searches
- Nearby suggestions

Each provider suggestion may show a small icon or thumbnail, short location, open status, and one compact metric such as **18 min wait**. Use clear keyboard focus/selection styling on desktop and touch-friendly rows on mobile.

Include a small **Search this area** or **Nearby results** affordance if spatial context is useful. The interface should feel immediate and lightweight, with no full-page form. Use soft layered surfaces, precise spacing, clean typography, and a visible but subdued map beneath. Avoid turning autocomplete into a huge command palette or dense directory list.

---

# P06 — Filters / Sorting State

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

# P07 — Service Profile Mobile

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

# P07A — Contribute Experience Mobile Overview

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

# P08 — Community Intelligence / Busy Hours Detail

Design a focused **SerbisYO Community Intelligence detail state** for a selected service provider. This can appear as an expanded section or subview from Service Profile rather than a completely unrelated page.

Show a clear header such as **“Community Intelligence”** with the provider name beneath. Present the five main dimensions:

- Service Quality
- Reliability / Consistency
- Time & Efficiency
- Information Accuracy
- Accessibility

Use a refined combination of progress bars, score strips, labels, and short explanations. Include a compact **Busy Hours** visualization across the day, using a simple horizontal histogram or heat strip showing quieter and busier time ranges. Add a small note such as **“Based on 74 recent community contributions”** and show **Community Confidence: High**.

Include one small trend or recent-change statement, for example **“Average reported wait improved by 6 minutes compared with last week.”** Keep this informational and understandable, not finance-like. Avoid dense charts, pie charts, or analytics-dashboard styling. The goal is to explain the service’s real experience in a human-readable way.

---

# P09 — Contribution Step 1: Confirm Service

Design the first step of the SerbisYO contribution workflow: **Confirm the service you used**. The screen should feel fast and reassuring, making it obvious that the user is contributing about the correct place.

Show a compact provider card for **Morong Community Health Center** with category, address, small map preview, and selected marker. Below, include a clear service selector such as:

- General Consultation
- Records Request
- Vaccination
- Laboratory

Include visit date/time controls and a simple **This is the correct place** confirmation. Show the four-step progress indicator with **Service** active and **Visit, Experience, Review** upcoming.

Use spacious form composition, readable labels, soft neutral surfaces, and a sticky or prominent **Next** button. Avoid asking for ratings yet. The design should feel like a short consumer flow rather than account setup or a survey.

---

# P10 — Contribution Step 2: Visit Details

Design the second SerbisYO contribution step titled **“How was your visit?”**. Keep the selected provider/service visible in a compact header so users remain oriented.

Collect structured service-timing information using clear ergonomic controls:

- **How long did you wait?** — numeric/time input such as `24 minutes`
- **How long did the service take?** — `18 minutes`
- **Was the service available?** — Yes / Partly / No
- **Was the posted information accurate?** — Yes / Partly / No

Use large segmented controls and highly legible input fields. Add subtle explanatory text where useful, for example **“Count from joining the queue until service starts.”** Show the progress indicator with **Visit** active and a sticky **Next** action.

The layout should be clean, friendly, and practical on both desktop and mobile. Avoid sliders if they make exact time entry unclear. This screen should visually reinforce that SerbisYO values measurable experience data.

---

# P11 — Contribution Step 3: Rate Experience

Design the third SerbisYO contribution step titled **“How was the service?”**. This step should capture structured quality feedback without reducing everything to a generic 5-star review.

Show three rating dimensions:

- **Service Quality**
- **Accessibility**
- **Overall Experience**

Use modern labeled scales such as **Poor, Fair, Good, Very Good, Excellent** or a similarly clear segmented interaction. Selected states should be easy to distinguish without relying only on color.

Below, add an optional compact field asking **“Anything important about accessibility?”** if space allows. Keep provider context visible in a small header and show the workflow indicator with **Experience** active.

Use warm but professional microcopy, large touch targets, strong typography, soft surfaces, and a clear **Next** button. Avoid emojis, childish gamification, or excessive sentiment icons. The page should feel credible enough for public services and businesses alike.

---

# P12 — Contribution Step 4: Review and Submit

Design the final SerbisYO contribution step titled **“Review your experience”**. Show a clean summary of everything the user entered before submission.

Include compact sections for:

- Provider and service
- Visit date/time
- Waiting time
- Processing time
- Availability
- Information accuracy
- Service quality
- Accessibility
- Overall experience

Add an optional short comment field labeled **“Anything others should know?”** with restrained character guidance. Show a small note explaining that the contribution will help improve community service information.

The primary action should be **Share Experience**. Include a secondary **Back** action and allow users to edit any section. Keep the page calm and confident; this is a final review, not a legal confirmation. Use the same design language as previous contribution steps.

---

# P13 — Contribution Success State

Design a polished **SerbisYO contribution success screen** shown immediately after a user submits an experience. The state should feel rewarding but restrained, avoiding gamification or confetti-heavy visuals.

Display the message:

**“Experience added. You just helped the next person know what to expect.”**

Show a small provider summary and a subtle indication that community data has been updated, such as **74 → 75 contributions** or a refreshed confidence indicator. If appropriate, show the submitted wait time or a small preview of the updated service insight.

Include two actions:

- **View Updated Insights**
- **Back to Service**

Use one controlled celebratory visual moment such as a soft checkmark animation or expanding marker glow. Keep surfaces clean, spacious, and consistent with SerbisYO.

---

# P14 — Suggest an Update

Design a **SerbisYO Suggest an Update** interface launched from a service profile. This workflow should feel constructive and accuracy-focused, not like a complaint form.

Use a compact modal on desktop and a rounded bottom sheet on mobile. Title: **“Suggest an update”**. Show selectable issue types:

- Operating hours
- Address/location
- Service no longer available
- Contact information
- Accessibility information
- Other service detail

After selecting an issue type, reveal a simple corrected-value field and an optional explanation. Include the provider name at the top so the user knows what they are updating. Use the primary action **Send Update** and secondary **Cancel**.

Add short reassurance text such as **“Community updates are reviewed before they affect service information.”** Keep the design neutral, trustworthy, and easy to complete.

---

# P15 — Report Information / Contribution

Design a **SerbisYO Report Information** modal or sheet for reporting problematic community content. The tone should be serious and fair without using aggressive warning styling.

Show the reported provider or contribution in a compact preview. Offer reasons such as:

- Spam
- Fake or misleading contribution
- Abusive content
- Irrelevant content
- Privacy concern
- Other

Include an optional explanation field and actions **Submit Report** and **Cancel**. Add concise text explaining that reports help keep community information useful and trustworthy.

Use restrained semantic colors, clear focus states, and the same typography/surface system as the rest of SerbisYO. Avoid red-dominated punitive design.

---

# P16 — Saved Services Desktop

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

# P17 — Saved Services Mobile

Design a mobile SerbisYO **Saved Services** page. Use a clean vertical list with compact service cards that preserve the same metrics and hierarchy from Explore. Each card should show provider name, category, open state, average wait, reliability, and a small saved/bookmark indicator.

Include a simple sort/filter control at the top and optional `View on map` action. Bottom navigation should remain visible with **Saved** selected. Keep the page highly scannable and thumb-friendly, with no dense map unless the user chooses to open one.

---

# P18 — User Profile / Activity Desktop

Design a **desktop SerbisYO User Profile / Activity page** focused on useful participation history rather than social networking.

At the top, show a clean identity block with avatar, name, contribution count, saved services count, and a small community-help summary such as **“12 experiences shared”**. Below, use a balanced two-column layout:

- Left: **Recent Contributions** with provider, service, visit date, wait time, and contribution status.
- Right: **Saved / Recently Viewed Services** with compact service intelligence cards.

Include simple account/settings access but avoid followers, likes, social feeds, badges, levels, or competitive leaderboards. The page should feel like a personal utility area in the same premium SerbisYO system.

---

# P19 — User Profile / Activity Mobile

Design a mobile SerbisYO **Profile / Activity** screen inspired by premium travel/profile apps but adapted for community service participation.

Show avatar, name, contribution count, saved-service count, and a concise line such as **“Helping improve service information in your community.”** Below, use grouped rows or compact cards for:

- My Contributions
- Saved Services
- Recent Activity
- Account / Settings

Show one or two recent contribution previews but keep the page simple. Bottom navigation should have **Profile** selected. Use soft surfaces, modern typography, and restrained visual warmth without becoming social-media-like.

---

# P20 — Login / Register

Design a minimal **SerbisYO authentication screen** for the hackathon prototype. The page should feel like part of the product rather than a generic template.

Use a split or centered composition with subtle map/service context in the background. Show SerbisYO branding and concise value copy such as **“Share experiences. Save services. Help your community know what to expect.”**

Include simple fields for email and password, **Sign In**, and a clear switch to **Create Account**. Registration can request only essential information such as name, email, and password. Include a lightweight option to continue exploring without signing in if the product flow permits it.

Avoid decorative illustrations that dominate the page, complicated social-login grids, or enterprise security aesthetics. Keep the screen clean, modern, and trustworthy.

---

# P21 — Simple Service Comparison (Should-Have)

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

# P22 — No Results / Empty Search State

Design a SerbisYO **No Results** state inside the Explore map experience. The map should remain visible, but the service panel should clearly explain:

**“No matching services found in this area.”**

Offer useful actions:

- Clear filters
- Search a wider area
- Try another category

Use a simple friendly illustration or subtle map icon only if necessary. Do not turn the screen into a blank error page. Maintain continuity with the search and map so the user can recover immediately.

---

# P23 — No Community Data State

Design a SerbisYO **service profile with no community contributions yet**. The provider still has official/basic information, but community intelligence is not available.

Where metrics would normally appear, show a clear empty state:

**“No community experience yet.”**

Supporting text:

**“Be the first to help others know what to expect.”**

Include a prominent **Contribute Experience** action. Do not fabricate zero scores or imply that lack of data means poor service. Keep the page informative, trustworthy, and optimistic.

---

# P24 — Loading / Map Failure State

Design a resilient **SerbisYO degraded-state screen** for when map tiles or location services fail but service-list data is still available.

Keep the service results list usable. Replace the map with a calm placeholder panel explaining **“Map unavailable right now”** and provide actions such as **Retry Map** and **Use Service List**. Search and filters should remain functional if possible.

Use restrained error styling and clearly communicate what still works. Avoid full-page failure screens, technical error codes, or alarming red visuals.

---

# P25 — Moderator Queue Desktop

Design a **desktop internal moderation workspace** for SerbisYO. Use the established design system but make the layout more utilitarian than the consumer experience.

Show a queue of **Pending Corrections** and **Reported Contributions** in a left column. Each item should show provider, report type, reason, submitted time, and status. On the right, show a review detail pane with:

- Original information/content
- Suggested correction or reported text
- Submission metadata
- Short context
- Clear actions **Approve**, **Reject**, and optional **Request Review**

Use neutral surfaces, clear text hierarchy, and minimal decorative styling. The goal is fair community governance, not a large enterprise admin suite.

---

# P26 — Moderator Detail / Report Review

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

# P27 — Future Provider Dashboard

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

# P28 — Future Official vs Community View

Design a future SerbisYO provider transparency page comparing **Official Service Information** with **Community-Reported Experience**.

Show simple paired comparisons such as:

- Expected processing time **20 min** vs community average **31 min**
- Posted closing time **5:00 PM** vs confirmed recent reports
- Stated accessibility features vs community accessibility reports
- Service availability vs recent availability reports

Use a clean comparison layout with explanations and improvement opportunities. Avoid accusatory colors or framing. The visual purpose is transparency and service improvement, not public shaming.

---

# P29 — SerbisYO UI Component System / Design Board

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

# P30 — Map Marker and Service Card Exploration Board

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

When generating UI concepts in batches, use this order:

### Group 1 — Core product identity, desktop + mobile
Generate these as **six separate images**, one prompt per image:

1. P01 Explore / Home Desktop
2. P04 Explore / Home Mobile
3. P02 Service Profile Desktop
4. P07 Service Profile Mobile
5. P03 Contribute Experience Overview Desktop
6. P07A Contribute Experience Mobile Overview

### Group 2 — Discovery interactions and deeper service intelligence
7. P05 Search / Autocomplete
8. P06 Filters / Sorting
9. P08 Community Intelligence / Busy Hours

### Group 3 — Complete contribution workflow
10. P09 Confirm Service
11. P10 Visit Details
12. P11 Rate Experience
13. P12 Review and Submit
14. P13 Contribution Success

### Group 4 — Trust and correction
15. P14 Suggest an Update
16. P15 Report Information
17. P22 No Results
18. P23 No Community Data
19. P24 Loading / Map Failure

### Group 5 — Personal utility
20. P16 Saved Services Desktop
21. P17 Saved Services Mobile
22. P18 User Profile Desktop
23. P19 User Profile Mobile
24. P20 Login / Register

### Group 6 — Optional MVP / internal tools
25. P21 Service Comparison
26. P25 Moderator Queue
27. P26 Moderator Detail

### Group 7 — Future-scope pitch concepts
28. P27 Provider Dashboard
29. P28 Official vs Community View

### Group 8 — Design-system references
30. P29 UI Component System Board
31. P30 Map Marker and Service Card Exploration Board

## Review Checklist for Generated Concepts

When judging a generated concept, ask:

- Does the page support the exact workflow it represents?
- Does the user understand the most important information in a few seconds?
- Does it feel recognizably SerbisYO rather than a generic map/review product?
- Is it feasible to implement with React + Tailwind during the hackathon?
- Does the page preserve the same desktop/mobile mental model?
- Are controls readable, ergonomic, and accessible?
- Is the map still useful when present?
- Is decoration serving the product, or distracting from it?
- Does the design avoid implying certainty when community data is weak or missing?

