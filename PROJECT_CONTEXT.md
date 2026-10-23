# TaymPers Project Context

## 0. Current Development Continuity

The active downloaded member-progress workspace is:

```text
C:\Users\Admin\Documents\Documents\4 - E\External Projects\HACKATHON\serbisyo
```

For the current implementation state, known prototype drift, build status, and continuation rules, read `DEVELOPMENT_CONTINUATION_CONTEXT.md` before editing code.

For approved branding and asset usage, read:

- `BRAND_CONTEXT.md`
- `ASSET_CONTEXT.md`
- `MORONG_REAL_PLACES_CONTEXT.md` for the verified real-place cluster used by the Morong prototype map and service data.
- `IMAGE_COLLECTION_CONTEXT.md` for the zero-paid-API Wikimedia Commons + controlled Playwright/Puppeteer/Cheerio place-image workflow.

These continuity files describe **how the current prototype should be continued**. The product vision and principles below remain authoritative.

### Brand enforcement rule

All user-facing workflows inherit the canonical TaymPers runtime brand system from BRAND_CONTEXT.md and apps/web/src/styles/index.css. Inter 400/600/700, the approved palette roles, and the shared .sy-h1 / .sy-h2 / .sy-h3 / .sy-h4 / .sy-body / .sy-caption / .sy-small hierarchy are authoritative. Do not introduce 800/900 typography, arbitrary near-match brand blues/navies, or ordinary user-facing text below 12px to make a layout fit. Resolve space constraints through responsive composition instead.

Typography tokens must never force a foreground color. State and semantic controls own their contrast: Primary blue surfaces require white foreground content, while Primary Lighter selected surfaces use approved blue/neutral foregrounds. Preserve this separation in future components.

### Real-place prototype rule

The initial Explore dataset should use the real central-Morong places documented in `MORONG_REAL_PLACES_CONTEXT.md` and `data/morong-real-places.json`. Real names, addresses, and coordinates must remain distinct from simulated TaymPers intelligence such as wait time, reliability, community confidence, busy hours, and composite score.

### Native map context vs TaymPers prototype records

The underlying OpenFreeMap/OpenStreetMap map should retain ordinary real-world POIs, place labels, roads, landmarks, transit points, and other native geographic context so Morong does not look artificially empty. These native map features are **context only** and should remain visually quieter than TaymPers markers. Do not attach simulated TaymPers intelligence, preview cards, community metrics, contribution flows, or Service Profile routing to an arbitrary native map POI. Only places explicitly present in the TaymPers prototype dataset receive the colored TaymPers marker treatment and enriched product interactions. At town-scale Explore zoom, expose higher-priority native POIs early enough to provide orientation while deferring lower-priority POIs until closer zooms to avoid clutter.

Native/context POIs may use TaymPers' own quieter pinpoint artwork instead of the basemap's sprite icons. They may be clicked to show a lightweight **map-context preview** containing only factual map identity/category plus the standard no-image vector and a clear “No TaymPers community data yet” state. They remain non-searchable in product discovery and must never receive simulated wait/reliability/score/community data, contribution actions, or a full Service Profile unless they are explicitly promoted into the TaymPers service dataset. Keep a checked-in Morong-only OSM context snapshot for deterministic prototype behavior rather than depending on a live POI API at runtime. The current snapshot contains 56 additional named Morong establishments/amenities across common service categories. The currently selected **TaymPers provider** is the only map point that receives a color-matched glow. Clicking that selected provider pin again clears its focus, glow, list selection, and selected-service preview instead of opening the profile. Its desktop preview card should attach spatially to the selected pinpoint and dynamically choose top/right/left/bottom placement based on available map space; it must remain inside the map viewport.

OpenStreetMap/OpenMapTiles/OpenFreeMap and satellite-provider attribution must remain visible wherever their data is rendered. It may be visually de-emphasized without obscuring readability, but must not be removed merely for visual cleanliness.

### Community-report data rule

Community experiences used by the prototype must behave as actual application records rather than decorative text. Seeded hackathon reports may remain simulated/prototype content, but each record should have a stable ID, provider, service type, visit date/time, wait/processing time, availability, information accuracy, ratings, note, and sentiment so users can browse reports as a list and inspect them one by one. New prototype submissions should append to the same browser-persisted record model. Do not present seeded prototype records as verified historical reports from real residents.

### Prototype account rule

The public TaymPers prototype now has a browser-local account/session layer. The seeded demonstration account uses `iankurt.valencia2005@gmail.com` with the demo password supplied by the project owner. Authentication remains **prototype-only and client-side**: it is not production security and should never be represented as such. User-facing top-bar avatars should use the shared account menu with Profile, Account Settings, and Log out; guest sessions should offer Sign in. Profile settings and the account menu must read/write the same browser-local profile state.

### Researched score/wait baseline

The 15 enriched Morong prototype providers use the research-informed score and average-wait baseline approved on 2026-10-23. Key corrected records include URS Morong at 87 / 25 min, Morong Fire Station at 92 / 15 min, East Systems Colleges of Rizal as active at 90 / 15 min, and Rizal Provincial Hospital System - Morong as active/24 hours at 70 / 90 min. These are prototype planning baselines inferred from current public information and service context, not live queue measurements. Keep identity/status facts separate from inferred intelligence, and revise the estimates when stronger field data becomes available.

### Persistent shell rule

Explore owns the global discovery interface. On desktop this means the TaymPers/search/location row plus the category/decision-chip row. On mobile this means the TaymPers/location/bell/avatar row, the search/filter row, quick-category chips, and the fixed bottom navigation. Service Profile and similar drill-down workflows opened from Explore must render inside the content/map region and must not replace, duplicate, or restyle that global shell. Use animated overlays/panels for drill-down transitions so users retain spatial and navigation context.

### Drill-down interaction continuity rule

When a card, map preview, bottom sheet, or similar preview opens a deeper detail surface, prefer a **two-phase spatial morph** and reverse that motion on close. In Explore, the canonical desktop source is the **whole Nearby Services panel/card**, never an individual result row. Individual result cards only select/focus a provider; they must not enlarge into the Service Profile shell. On mobile, the canonical source is the whole selected-service bottom sheet. Phase 1 morphs only that main shell geometry into the destination information panel while its destination information remains hidden. Phase 2 begins only after the shell geometry has settled: reveal profile content from below with a short stagger, line by line for title/category/address/hours and group by group for actions, intelligence sections, services, accessibility, and list rows. Closing must reverse this sequence: hide those groups in reverse order, morph the main panel back toward its originating shell, and restore the Explore list underneath rather than abruptly removing the detail surface. Do not show a copied result card or let destination content pop in midway through the shell resize. Keep persistent spatial surfaces such as the map **outside the shell morph**: reuse the same map instance and hold its geometry steady while the information panel itself is morphing. When the remaining map space subsequently changes, synchronize Leaflet with that changing container continuously during the map's own layout transition and keep the selected provider centered without a delayed corrective pan or second animation. Direct drag-resizing should track the pointer without transition lag. Avoid abrupt page swaps when the originating surface remains conceptually present underneath. Detail overlays must also provide a persistent **side-edge collapse control** in addition to ordinary Back/Close actions; where the detail/map split is visible, the collapse control should straddle the boundary rather than sit fully inside either surface. While a Service Profile is open, selecting another prototype provider pin must switch the open profile to that provider; selecting the already-active pin again must clear the pin focus and collapse back to the Explore list. When a desktop detail surface shares space with a map or another live context panel, its information pane may be user-expandable, but the expansion must be bounded so the companion context remains visible and usable. Apply these rules to future comparable drill-down overlays unless a focused workflow explicitly requires a different interaction model.

## 1. Refined System Description

**TaymPers: A Community-Powered Platform for Accessible, Transparent, Accountable, and Reliable Services** is a community-powered service intelligence, discovery, and transparency platform designed to help people make better decisions when choosing establishments, businesses, organizations, public offices, institutions, and public-facing individual service providers. Through a map-based interface, users can search for nearby services and view practical information beyond ordinary ratings, including actual waiting and processing times, operating hours, service availability, peak hours, reliability, responsiveness, information accuracy, accessibility, service quality, and overall community experience.

The main purpose of TaymPers is to reduce uncertainty before people use a service by helping them understand **where to go, when to go, what to expect, and which option is more reliable**. Users can contribute their own experiences, updates, estimates, and feedback, allowing the platform's community-based information to improve over time. This can help reduce wasted trips, unexpected delays, outdated or inaccurate information, and poor service experiences.

At the same time, TaymPers encourages service providers to become more transparent, responsible, consistent, and accountable by making actual service performance and public experience more visible. Reputation is one output of the platform, but the larger goal is to turn shared community experiences into practical service intelligence that helps people make smarter decisions and encourages better service for everyone.

## 2. Overall Vision

> **Make service information more transparent, useful, measurable, and community-driven so people can make better decisions while service providers are encouraged to deliver better and more accountable service.**

Short internal description:

> **TaymPers helps people know where to go, when to go, what to expect, and which service they can rely on.**

## 3. The Problem

- People can usually find **where** a service is located, but not necessarily what the actual service experience will be.
- Ordinary star ratings do not clearly explain waiting time, processing time, reliability, availability, accessibility, or information accuracy.
- Posted schedules, requirements, operating hours, availability, and processing estimates can be outdated or different from actual conditions.
- Users can waste time, transportation expenses, and effort by arriving at a service that is unavailable, overcrowded, delayed, closed, or different from what they expected.
- Useful service experiences are scattered across social media posts, comments, reviews, group chats, or word of mouth instead of being converted into structured information.
- Service providers often lack a simple public-facing view of recurring service issues and how people actually experience their service.

## 4. What Makes TaymPers Different

TaymPers should not be presented as only a ratings platform or a queue tracker.

Its differentiator is the conversion of **community experience into structured service intelligence**.

Examples of useful information:

- Average waiting time
- Typical processing/service time
- Common peak hours
- Service availability
- Reliability/consistency
- Information accuracy
- Accessibility
- Service quality
- Recent community updates
- Confidence level based on the amount and recency of community data

The user should be able to make a decision, not merely read opinions.

## 5. Core Product Questions

Every major feature should help answer at least one of these:

- **Where should I go?**
- **When should I go?**
- **What should I expect?**
- **Which provider is more reliable?**
- **Is the available information still accurate?**
- **How can my experience help the next person?**

## 6. Main User Types

### Service User / Community Member

Searches for services, checks service intelligence, compares options, views recent experiences, and contributes an experience after using a service.

### Service Provider / Organization

Represents a business, institution, office, organization, or public-facing professional. In future versions, verified providers may claim profiles, correct official details, respond to feedback, and view service insights.

### Moderator / Administrator

Reviews reports, corrections, abusive submissions, obviously invalid data, and other community moderation concerns.

## 7. Service Provider Scope

TaymPers may include:

- Businesses and commercial establishments
- Government/public offices
- Institutions and organizations
- Clinics and other service centers
- Educational or community service facilities
- Public-facing individual professionals or service providers

Avoid creating reputation profiles for arbitrary private individuals. Individual profiles should relate to legitimate public-facing or professional services.

## 8. Product Principles

- **Useful before impressive:** every feature should improve a real service decision.
- **Structured data over vague opinion:** collect information that can be aggregated and compared.
- **Community-powered, not community-chaotic:** contributions need moderation, context, recency, and confidence indicators.
- **Accountability without public shaming:** make service performance visible while supporting corrections and fair responses.
- **Time matters, but TaymPers is broader than time:** waiting time is a major dimension, not the entire product.
- **Responsive by default:** the core experience must work properly on desktop and mobile.
- **MVP discipline:** do not expand the scope when the main experience is incomplete.

## 9. SDG Alignment

Primary alignment:

- **SDG 11 - Sustainable Cities and Communities**
- **SDG 16 - Peace, Justice and Strong Institutions**

Supporting alignment:

- **SDG 10 - Reduced Inequalities**
- **SDG 9 - Industry, Innovation and Infrastructure**
- **SDG 8 - Decent Work and Economic Growth**

## 10. Working Terminology

- **Service Provider** - establishment, organization, institution, office, business, or public-facing individual professional.
- **Service Profile** - the detailed TaymPers page for a service provider/location.
- **Community Contribution / Experience** - structured information submitted by a user after using or visiting a service.
- **Service Intelligence** - aggregated practical information derived from official details and community experience.
- **TaymPers Score** - prototype-level composite score summarizing selected service dimensions.
- **Community Confidence** - indication of how much confidence should be placed in aggregated data based on contribution count, recency, and/or consistency.

## 11. Product Experience Direction

TaymPers should feel like a **modern spatial service app** rather than a traditional school-system dashboard. The map is the main working canvas, while service information appears through layered cards, side sheets, bottom sheets, compact filters, and contextual actions.

The product experience should preserve one consistent mental model across devices:

> **Find a service -> focus the place on the map -> reveal service intelligence -> make a decision -> contribute an experience -> help the next person.**

Desktop and mobile should not feel like separate products. The same information hierarchy should morph between layouts:

- **Desktop:** results/service panel + dominant map + contextual detail sheet.
- **Mobile:** full map canvas + floating search/filter controls + draggable bottom sheet + compact bottom navigation.

The visual direction is inspired by modern travel, mapping, local discovery, and spatial utility interfaces, but TaymPers must not directly imitate any reference product. Its own identity should come from service intelligence, community confidence, time/reliability metrics, and the relationship between service cards and map markers.

### Visual Principles

- Map-first, not dashboard-first.
- Soft layered surfaces over a calm map.
- Clear information hierarchy instead of many equal-sized cards.
- Rounded controls and sheets used intentionally, not everywhere.
- Restrained motion that explains state changes and spatial relationships.
- Modern, trustworthy, community-centered tone.
- Strong responsive behavior from narrow mobile screens to wide desktop monitors.
- Accessibility and readability take priority over decoration.

The detailed page-by-page visual direction is maintained in `DESIGN_BLUEPRINT.md`, while concept-image generation prompts are maintained in `UI_IMAGE_PROMPTS.md`.

