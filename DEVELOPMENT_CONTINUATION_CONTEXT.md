# TaymPers Development Continuation Context

This file is the **current implementation handoff and continuation reference** for the TaymPers prototype. Read it before continuing development from the downloaded member-progress folder.

> **Brand rename note (2026-10-23):** the product's canonical user-facing name is now **TaymPers**, with the descriptive title **“TaymPers: A Community-Powered Platform for Accessible, Transparent, Accountable, and Reliable Services.”** Historical notes below may still mention SerbisYO when describing earlier implementation stages. Internal identifiers such as the repository folder name, `serbisyo-*` CSS classes, localStorage keys, and map-theme function/type names are intentionally retained for compatibility unless a later refactor explicitly changes them.

- **TaymPers runtime branding migration:** the selected source artwork is stored under `assets/branding/TaymPers logo.png` and `assets/branding/TaymPers logo - text.png`, with web-safe public copies at `apps/web/public/assets/branding/taympers-logo.png` and `taympers-logo-text.png`. Shared headers now render the exact horizontal text-logo through `components/branding/TaymPersBrand.tsx`; compact/icon-only usage can use the mark asset. Explore, Login, Contribute, Contribution Success, Service Profile, Community Intelligence, Saved/Profile/Compare shells, Moderator/Provider workspace shells, Image Review, map-style labels, score labels, contribution copy, and provider/community copy now use TaymPers. The browser title/favicon also use TaymPers. Internal `serbisyo-*` classes, the repository/package names, localStorage key, and existing map-theme function/type identifiers are intentionally unchanged to avoid needless state/API breakage.
- **TaymPers lockup + reversible spatial interaction polish:** completed on 2026-10-23. User-facing TaymPers branding now consistently composes the standalone blue/green mark to the left of the text wordmark, including shared desktop/mobile headers and Login. Explore desktop restored the profile avatar, and Profile now has an explicit working Back to Explore control. Service Profile closing now reverses the opening sequence instead of disappearing: reveal groups animate out in reverse order, the information shell contracts back toward the whole Nearby Services panel, the list fades back underneath, and only then is the overlay removed. The map no longer performs a delayed 240 ms resize + animated corrective `panTo`; a `ResizeObserver` synchronizes Leaflet with the changing container during the post-morph map-space transition, cancels competing movement, and keeps the selected provider centered. Browser measurement at 1734x1100 held the selected pin within about 1 px of the live map center while the map changed from ~1174 px to ~658 px wide and again on reverse. Open-profile pin behavior is now stateful: selecting a different provider pin swaps the displayed Service Profile in place; selecting the active pin again clears the glow and collapses back to Explore. All four Batch 7 Commentor notes were resolved only after browser validation.
- **Research-informed metrics + account/login pass:** completed on 2026-10-23. All 15 enriched providers now have explicit TaymPers Score / average-wait overrides: Municipal Hall 88/25m; LTO 82/45m; Fire Station 92/15m; Public Market 80/8m; Registry of Deeds 84/30m; East Systems 90/15m; Rural Health Unit 86/35m; Commandancia/Museum 91/5m; Morong Doctors Hospital 78/40m; Savemore 84/15m; Mercury Drug 88/8m; RPHS Morong 70/90m; Supreme Care 85/20m; Morong National High School 85/15m; URS Morong 87/25m. East Systems is forced active/open and RPHS Morong is active with `Open 24 hours`. Runtime validation read all 15 values directly from `morongPrototypeServices.ts`. Login now authenticates the seeded demo account `iankurt.valencia2005@gmail.com` / `demo1234`, supports local prototype account creation, stores a browser session, and exposes a reusable AccountMenu across the public user shells with Profile, Account Settings, and Log out. Profile settings read/write the same account state; tested Settings showed the email/Community Member role and Log out cleared the session and returned to `/login`. Login's 3D map artwork now ignores the global image max-width, is enlarged/lowered so its bottom edge stays outside the viewport, and uses stronger side/right/bottom white gradients; at 390x844 the map rendered 960px wide with ~330px visible and zero horizontal overflow. Batch 8 Commentor work added animated metric fills and busy bars, count-up score/wait/reliability/percentage numbers, lowered Leaflet control attribution to map-layer z-index 420, removed the visible PROTOTYPE pill and prototype wording from Service Profile content, and resolved all four comments after browser validation.

## 1. Current Source of Truth

Local project root:

```text
C:\Users\Admin\Documents\Documents\4 - E\External Projects\HACKATHON\serbisyo
```

Active Git branch:

```text
development
```

This `serbisyo` folder supersedes the older root-level starter as the active prototype continuation workspace. Do not continue development against an older copy when this folder is available.

## 2. Product Source of Truth

Preserve the project definition in:

- `PROJECT_CONTEXT.md`
- `PRODUCT_SCOPE.md`
- `USER_FLOWS_UI.md`
- `APPROVED_UI_BASELINE.md`
- `DESIGN_BLUEPRINT.md`

SerbisYO remains a **community-powered, map-based service intelligence, discovery, and transparency platform**. Do not reduce it to a generic review app, directory, or queue tracker.

Core decision questions remain:

- Where should I go?
- When should I go?
- What should I expect?
- Which provider is more reliable?
- Is the information still accurate?
- How can my experience help the next person?

## 3. Current Technical Stack

- Frontend: React 19 + Vite + TypeScript
- Styling: Tailwind CSS 4 plus project CSS
- Routing: React Router
- Map: Leaflet 1.9.4 loaded from CDN in `apps/web/index.html`
- Backend: PHP 8.2+ JSON API
- Database target: PostgreSQL
- Node.js/npm: frontend tooling only

Local development commands remain in the root `package.json` and `RUN_SERBISYO.bat`.

## 4. Current Prototype Routes

The current React application exposes:

| Route | Current screen |
|---|---|
| `/` | Login / Register prototype |
| `/login` | Login / Register prototype |
| `/explore` | Explore / map discovery |
| `/services/:providerId` | Service Profile |
| `/contribute` | Contribution workflow |
| `/contribute/success` | Contribution Success confirmation |
| `/saved` | Saved Services |
| `/profile` | User Profile / activity |
| `/compare` | Service Comparison |
| `/moderation` | Moderator Queue / review prototype |
| `/image-review` | Development-only establishment image review and export workflow |

Current modal components:

- `ContributeExperienceModal.tsx`
- `FilterModal.tsx`
- `ReportModal.tsx`
- `SuggestUpdateModal.tsx`

## 5. Current Implementation State

The member-developed prototype has moved beyond the original scaffold:

- Explore has a real Leaflet map implementation rather than the original placeholder.
- Several service/provider demo records and metrics are hard-coded in the frontend.
- Service Profile includes community intelligence, busy-hours data, nearby services, and contribution/update/report entry points.
- Contribution, Saved, Profile, Compare, Login, and Moderation screens have working prototype UI and local interactions.
- The PHP backend currently has infrastructure plus the health endpoint; most visible product data still comes from frontend demo data.
- Many service/provider photos still use external Unsplash URLs.
- Development mode now uses the **same AGAPAY UI Commentor implementation** (`DevElementCommentor.jsx` plus `dev-commentor.css`), adapted only to the SerbisYO local comment API/storage. When enabled, hover/click the inspected interface directly to open the same single/group-target comment composer used in AGAPAY.
- Development mode also reserves **Ctrl+D** for a fresh-user reset. It clears same-origin local/session storage, CacheStorage, IndexedDB databases when enumerable, cookies, and service-worker registrations, then returns to `/login`. A web page cannot purge the browser's entire global HTTP disk cache, so this shortcut is intentionally scoped to the SerbisYO origin/application state.

Treat this as a **prototype implementation to refine**, not as a new product specification. Approved project documents and UI references still outrank implementation drift.

### Current UI polish progress

- **Explore basemap migration:** stable implementation completed on 2026-10-22. Explore uses npm-managed Leaflet with `@maplibre/maplibre-gl-leaflet` and MapLibre GL to render OpenFreeMap vector tiles under the existing Leaflet marker/interaction layer. `apps/web/src/map/serbisyoExploreMapTheme.ts` fetches the Liberty style once, clones/transforms it before parsing, removes irrelevant road-shield layers, suppresses POI clutter, and applies SerbisYO pastel cartography: pale land, soft green vegetation, cyan water, warm arterial roads, white local roads, subdued buildings/boundaries, and a stronger city/town/village label hierarchy. The style button toggles between SerbisYO and a cleaned Liberty baseline. If vector loading fails, Explore falls back to raster OpenStreetMap. Real Morong coordinates and Leaflet marker behavior remain unchanged. Explore fits are capped at zoom 14 so Morong is shown in the wider Teresa/Baras context seen in the approved reference rather than over-zooming into the central 1.35 km provider cluster. Browser validation at 1536×1024 confirmed 1 MapLibre canvas, 15 working Leaflet markers, 0 raster tiles in vector mode, correct attribution, working marker selection/style toggle, no document overflow, and 0 console errors/warnings.
- **Service Profile map migration:** completed on 2026-10-22. `ServiceProfilePage.tsx` now uses the same npm Leaflet + MapLibre/OpenFreeMap SerbisYO vector theme with raster OSM fallback. The old Leaflet CDN was removed from `apps/web/index.html`; Leaflet/MapLibre CSS and worker setup are centralized in `main.tsx` and `apps/web/src/map/maplibreSetup.ts`. The profile route resolves provider IDs against `morongPrototypeServices` (including legacy alias `morong-health-center` → `morong-rural-health-unit`), uses the real provider image/name/category/address/coordinates, and derives five nearby markers from the real 15-place Morong dataset. Map controls use Lucide icons instead of emoji. Browser validation for `/services/morong-municipal-hall` confirmed the local `01-main` asset, one MapLibre canvas, six markers, zero raster tiles, correct attribution, and zero console errors/warnings.
- **Service Profile reference-fidelity pass:** completed on 2026-10-22 against the approved `Service Profile Desktop.png` (1533×1022) and `Service Profile Mobile.png` (499×887). The profile content follows the reference hierarchy: desktop ~61.5/38.5 information/map split; real provider hero data; action stack; compact Service Intelligence Summary; Community Intelligence; Busy Hours; Services Offered; Accessibility Notes; Recent Community Experiences; and the shared SerbisYO vector map with category markers. Mobile keeps the inset map strip, side-by-side provider image/details, full-width contribution action, compact secondary actions, stacked intelligence cards, and scrollable lower sections. All visible action/metric icons are approved assets or Lucide icons. Unsourced operating hours and service lists remain explicitly marked as prototype/demo content, while provider identity/address/coordinates remain sourced from the real Morong dataset.
- **Persistent Explore shell + Service Profile overlay architecture:** corrected on 2026-10-22 after comparing the actual Explore/profile desktop and mobile screenshots. The earlier implementation mounted a second complete application shell inside the overlay, which changed the top-menu categories, avatar/header treatment, mobile top controls, bottom navigation, and map framing the moment a profile opened. Explore is now the sole owner of global chrome. Desktop profile overlays are constrained to the content region (`top=140px`, `bottom=12px`) beneath the unchanged 123px Explore header. Mobile overlays are constrained to `top=192px`, `bottom=76px`, beneath the unchanged mobile identity/search/chip header and above the unchanged bottom nav. `ServiceProfilePage` hides its internal header/nav in overlay mode; the mobile close control lives inside the overlay panel instead of the global header, while desktop uses Back to Explore / Escape / backdrop. Entry uses a 280ms fade+translate+scale animation with a 180ms backdrop fade; exit uses a 220ms panel animation. The profile map now centers on the selected provider at a tighter reference-like zoom instead of opening substantially wider than Explore. `/services/:providerId` now renders `ExplorePage` and automatically opens the exact same Service Profile overlay, so deep links use the same persistent shell instead of a separate profile shell. Closing a deep-linked profile animates out and returns to `/explore`. Browser validation at 1536×1024 and 499×887 confirmed exactly one visible global header, zero profile-internal headers, one unchanged mobile bottom nav, overlay bounds matching the content region, working open/close animations, no document overflow, and 0 console errors/warnings.
- **Service Profile interaction continuity refinement:** added on 2026-10-22. Opening a Service Profile from a result card, desktop selected-service map card, or mobile bottom sheet now captures that source geometry and morphs the card into the full profile panel; closing reverses the same geometry instead of dropping back abruptly. Deep links without a mounted source keep the generic fallback panel transition. Both desktop and mobile overlays now include a persistent side-edge collapse control in addition to Back/Close/Escape/backdrop behavior. Desktop profile information can be expanded from the approved 61.5% width up to a bounded 72% maximum via a draggable separator so the map remains visible. Browser validation at 1536×1024 and 499×887 confirmed the morph animation, exact overlay bounds, persistent bottom navigation, visible collapse control, and bounded 61.5→72% expansion.
- **Service Profile morph/map architecture refinement:** later on 2026-10-22, the full-overlay behavior above was refined so the **map is no longer part of the morph**. The canonical animated source is the selected-service card on the map side on desktop, even when a selected left-list row triggers opening, and the selected-service bottom sheet on mobile. Only that information card expands into the Service Profile information panel, while deeper content reveals shortly after the shell begins morphing. The existing Explore Leaflet/MapLibre map remains the **single map instance** throughout and only resizes/reflows to the remaining available space; the overlay does not mount a second Leaflet container. At 1536×1024, the default 61.5% profile pane measured 929.875px while the same map contracted to 582.125px. Dragging the shared divider to about 71% left the same map at 436px wide. At 499×887 mobile, the same map remains behind the preserved upper map area while the information panel begins at y=308, with the Explore bottom navigation unchanged. This bullet supersedes any implication that the profile and map should scale/morph as one combined surface.
- **Service Profile list-card morph correction:** refined again on 2026-10-22 after interaction review. On desktop, the canonical morph source is now the **selected result card in the left service list**, not the floating map preview. The morph shell starts at that exact card rectangle (validated at 506×154 at x=27/y=209 in the 1536×1024 reference viewport), initially preserves the compact result-card presentation, expands horizontally/vertically into the 61.5% Service Profile information surface, then reveals the detailed profile content. The Explore map is intentionally held at its original 976px-wide geometry for the full 360ms card morph; only after the information panel settles does the map perform a single short resize to the final 582.125px remaining width and then receive one Leaflet size recalculation/recenter. This removes the earlier mid-morph map movement/double-response. The desktop collapse handle now straddles the information/map boundary by half its width and appears only after the final split is established. Mobile continues to use the selected-service bottom sheet as the morph source.
- **Contribute Experience Overview / Visit step:** implemented on 2026-10-22 from the approved desktop and mobile references. The contribute route with a provider query now owns a full responsive spatial workflow instead of the old centered generic form. Desktop preserves the two-row SerbisYO discovery shell, uses a ~61.5/38.5 contribution/map split, shows the four-step workflow, real selected provider banner, structured wait/processing/availability/accuracy controls, optional 500-character details, map controls/style selector, real Morong markers, and Previous/Next actions. Mobile uses the compact SerbisYO identity/location header, no hidden map initialization, stacked dense form cards, and a 60px bottom nav with Contribute active. The Service Profile Contribute Experience action now routes into this workflow while preserving the provider ID. Prototype operating hours remain explicitly labeled rather than represented as verified real data.
- **Contribute Experience fidelity/responsiveness polish:** completed later on 2026-10-22 after direct review of the rendered 1402×1056 desktop and 456×1056 mobile captures. Time/availability/accuracy choices and the mini-map View on Map action now stay single-line instead of wrapping; mobile question text is more readable; the SerbisYO logo crop matches Explore; the action row uses the remaining vertical space on tall phones instead of leaving a large dead area; the map centers more tightly on Morong; and the narrow-phone action row remains single-line through 393px. Browser checks at 1402×1056, 499×887, 456×1056, and 393×852 showed zero horizontal overflow and zero wrapped form buttons.
- **Search Autocomplete workflow:** implemented on 2026-10-22 from the approved 1536×1024 desktop and 499×887 mobile references. While the search field is focused, the typed query is a preview only: the underlying real 15-place Nearby Services list and map markers remain intact until a category/provider/intent is committed. The autocomplete surface shows a matching category when identifiable, the top two real Morong provider matches, four nearby intent suggestions, recent searches, and desktop clear-history behavior. Desktop focus shifts the search field to a reference-like 580px width at x≈375 and attaches a 580px results panel over the unchanged Explore workspace. Mobile uses a 435px inset white search sheet at 499px width (296px at 360px), hides the selected-service bottom sheet, preserves the map and bottom nav, exposes layers/locate/zoom controls in the uncovered right strip, and adds a My Location pill. Browser validation at 1536×1024, 499×887, and 360×800 confirmed one live map, the full 15-place Explore context during typing, no horizontal overflow, and no console errors.
- **Canonical branding normalization:** completed on 2026-10-22 before further workflow expansion. @fontsource/inter is installed and the runtime now loads local Inter 400/600/700; Tailwind font-sans is explicitly mapped to Inter. apps/web/src/styles/index.css now owns the exact approved SerbisYO palette roles plus reusable .sy-h1 (32/700; 28 mobile), .sy-h2 (24/700; 22 mobile), .sy-h3 (20/600; 18 mobile), .sy-h4 (16/600), .sy-body (16/400), .sy-caption (14/400), and .sy-small (12/400) tokens. Explore, Search Autocomplete, Service Profile, Contribute, Login, Saved, Compare, Profile, Moderation, AppShell, and user-facing modals were normalized away from 800/900 weights, sub-12px product text, and near-match primary colors such as #1677FF, #0878F9, #0676FF, and #10234F. Responsive layouts are expected to reflow/scroll rather than shrink below 12px. Browser validation confirmed Inter and exact hierarchy values on Explore, Service Profile, Contribute, and Login with zero document horizontal overflow and zero console errors at the tested reference sizes.
- **Brand contrast correction + Filters & Sorting:** completed on 2026-10-22 after the first full branding pass revealed that typography tokens could override state foreground colors. Typography tokens are now color-neutral, restoring white-on-Primary contrast for active category chips and primary actions. Explore now exposes Filters & Sorting from the desktop results header and existing mobile filter control. The redesigned filter surface follows the approved desktop/mobile references: desktop panel x≈390/w=728 at the current 1464px shell, mobile inset x=38/top=232/bottom=811 at 499×887 with exactly zero overlap against the 76px bottom nav. It includes Open now, category, accessibility, waiting time, reliability, community confidence, Sort By, reset/apply actions, and applies the chosen criteria to the real Morong prototype list. Browser checks confirmed correct #0066FF/white primary contrast, zero horizontal overflow, and zero console errors.
- **Community Intelligence / Busy Hours workflow:** added on 2026-10-22 as a dedicated /services/:providerId/community-intelligence drill-down based on the approved desktop/mobile references. Service Profile Community Intelligence and Busy Hours cards now navigate into it. Desktop keeps the persistent SerbisYO shell, 61.5/38.5 information/map split, real provider/map context, community-confidence summary, five intelligence dimensions, full Busy Hours chart, typical wait windows, weekly trend callout, and Recent Trends. Mobile uses the compact provider header, stacked metric cards, no initialized map, Busy Hours/trend guidance, Back to Service Profile, and persistent bottom navigation. The 507×901 mobile validation initializes zero Leaflet maps, has zero overflowing buttons/zero horizontal overflow, and preserves the 12px minimum by allowing vertical scrolling rather than shrinking typography.
- **Contribution Workflow Board:** implemented on 2026-10-22 from the approved P11 desktop board and P12 mobile board. This **supersedes the earlier Contribute Experience Overview / Visit-step layout** for the main `/contribute` workflow. The route now owns one persistent four-stage state machine controlled by the `stage` query parameter: `service`, `visit`, `experience`, and `review`. Stage changes preserve selected service type, visit date/time, wait/processing values, availability/accuracy, quality/accessibility/overall ratings, and notes. Desktop no longer uses the old 61.5/38.5 full map split; it uses a focused full-width contribution surface under the canonical two-row header, with a persistent provider card and compact contextual mini-map inside that card. Mobile keeps the compact SerbisYO header and 60px Contribute-active bottom nav, with the same provider context and one-column content. Visit uses strong Primary selections on desktop but soft Primary Lighter selections on mobile; Experience ratings use the softer selected treatment on both. Review exposes editable summary rows that return to the appropriate previous stage. All four stages fit the 1536×1024 desktop frame without internal page scrolling or button overflow. At 507×901, Service/Visit/Experience fit without scrolling and Review needs only minimal vertical overflow; at 393×852, narrow layouts scroll vertically as needed while retaining zero horizontal overflow and zero overflowing choice buttons. An end-to-end browser interaction confirmed state persistence from Vaccination → 30–60 min wait → Excellent rating into Review, with zero console errors.
- **Contribution Success + correction/report workflows:** implemented on 2026-10-22 from the approved Contribution Success, Suggest an Update, and Report Information desktop/mobile references. Review now submits to /contribute/success?provider=... using React Router state so the selected service type, visit date/time, waiting/processing times, accuracy, and quality rating appear in the confirmation summary. The Success page includes the provider summary, prototype contribution-count increment, unchanged confidence level, key submitted details, what the contribution improves, Back to Service, and View Updated Insights. It fits 1536×1024 and 507×901 with zero internal page scroll, zero horizontal overflow, and zero overflowing buttons. SuggestUpdateModal was rebuilt around the current provider data with correction topics, current hours, replacement hours, optional reason/photo, review notice, and explicit sent state. ReportModal now contains the contribution context, six report reasons, optional detail, moderation notice, and submitted state. Both modals use React portals to escape the morphed Service Profile stacking context and remain above the persistent Explore shell. Browser validation measured Suggest mobile at y≈252→901 and Report mobile at y≈194→825, with Report ending exactly where the 76px Explore bottom nav begins and 0 overlap. Desktop Suggest is 580px wide and Report is 580px wide; submit/close interactions complete without console errors.
- **Saved Services + User Profile Activity + Simple Service Comparison:** rebuilt on 2026-10-22 from the approved desktop/mobile references. A new shared `ReferenceProductShell` now gives these three routes the same two-row desktop SerbisYO header/category bar and compact mobile header/bottom navigation without nesting the older generic AppShell. Saved Services uses five real Morong prototype providers, desktop dense saved rows plus a saved-map/context rail, mobile stacked cards, working sort selection, working local unsave behavior, and Saved-active mobile navigation. User Profile Activity now matches the reference dashboard: community-impact profile header, 12/5/0 summary cards, desktop Recent Contributions + Saved Services split, mobile activity-navigation rows, two default mobile contribution cards, and a working Account Settings modal. Simple Service Comparison now renders three provider cards on desktop and two side-by-side cards on mobile with score/open/distance/wait/processing/reliability/accessibility/confidence rows, decision highlights, View Profile/View on Map actions, and Add Service discovery return. Provider identity/images/addresses use the shared real Morong dataset rather than reference-only placeholder establishments. Browser validation at 1536×1024 found no document scrolling, no horizontal overflow, and zero console errors on all three pages. At 507×901, Profile and Compare fit the viewport without internal page scrolling; Saved remains intentionally vertically scrollable. Compare also passes 393×852 with zero horizontal overflow, zero overflowing buttons, and no unintended internal element overflow.
- **Focused contribution-shell Commentor correction:** processed on 2026-10-22 from comment `syc_20261022_160208_767f31`. The desktop discovery category strip is now hidden while the Contribution Workflow Board is active, leaving a focused single-row 56px contribution header. The contribution surface moves up to y=72 instead of reserving space for inactive discovery categories. Chromium validation at the exact 1464×1056 review viewport confirmed the category strip is absent, the header is 56px high, the contribution surface begins at y=72, horizontal overflow is zero, and console errors are zero. The comment was marked resolved only after validation.
- **No Results / No Community Data / Map Failure states:** implemented on 2026-10-22 from the approved desktop/mobile state references. Explore now promotes a committed zero-match search into a full responsive empty-search state rather than the old tiny dashed placeholder. Desktop keeps the live Morong map while replacing the 536px service workspace with the search illustration, recovery actions, and popular categories; contextual Morong markers remain visible but the unrelated selected-service popup is suppressed. Mobile keeps the map above a reference-like bottom empty-state sheet that fits the 499×887 frame without internal scrolling; Clear filters restores the normal provider view. Map failure now preserves the desktop service list while replacing only the map surface with Retry Map / Use Service List and fallback guidance. Mobile uses a focused failure card followed by 106px real-provider fallback rows; the browser `offline` event and map-initialization failure both trigger the state, while `?map=failed` remains a deterministic QA hook. Retrying successfully remounts the Leaflet map. Service Profile now supports a real zero-community-data branch (also previewable with `?community=empty`) that removes fabricated intelligence/experience metrics, keeps real provider context, adds a clear first-contribution CTA, mobile location preview, and Quick Information. For this focused mobile service state the Explore search/category stack is intentionally hidden and the profile panel expands from y=68 to the persistent bottom nav. Browser validation passed at 1536×1024, 499×887, and 393×852 with zero horizontal overflow, zero overflowing action buttons, and zero console errors.
- **Moderator Queue + Report Review + future Provider workspaces:** implemented on 2026-10-23 from the approved 1536×1024 desktop and 501×890 mobile references. A new shared `RoleWorkspaceShell` provides distinct moderator and provider role chrome without nesting the generic AppShell. `/moderation` is now a real queue with Pending / Reported / Suggested Correction tabs, seven prototype review records tied to shared real Morong providers, a bounded desktop queue list, inline desktop review context, and mobile queue navigation. `/moderation/:reportId` is the focused full review flow with provider/report context, original contribution, reporter explanation, official information, recent contribution evidence, notes, previous status, and functioning Keep / Remove / Request Review actions. Mobile detail deliberately replaces the moderator nav with a fixed 68px decision bar and preserves the evidence order from the reference. Future provider routes are `/provider` and `/provider/official-vs-community`; they are explicitly prototype/future provider tools and do not alter current MVP permissions. The provider dashboard includes community-intelligence metrics, official-information management, feedback response, recurring issues, and recent insights. Official vs Community compares processing time, operating hours, availability, accessibility, and information accuracy with Success/Warning opportunity guidance. The desktop comparison was compressed through spacing only, not smaller typography, and now fits the 1536×1024 role workspace without inner main scrolling. Browser validation at 1536×1024 and exact 501×890 reference sizes confirmed zero horizontal overflow, zero overflowing buttons, correct queue→detail and provider→comparison navigation, working moderation decision state, and zero console errors.
- **Map-style + Commentor refinement:** the Explore map-style control now opens an explicit **SerbisYO / Streets / Satellite** selector instead of only toggling two similar vector appearances; Satellite uses Esri World Imagery, and Service Profile desktop uses the same three map choices. The Service Profile `Contribute Experience` action was tightened so its label does not clip. Login preview markers now sit below and behind their floating service-info cards. The four corresponding saved UI Commentor notes were marked resolved only after Chromium validation; the validated desktop Satellite state loaded 20 World Imagery tiles with 0 console errors.

- **Explore reference-fidelity pass:** completed on 2026-10-22 after direct side-by-side comparison of the approved 1536×1024 Explore reference against the current rendered page. The pass corrected the header proportions/search alignment, responsive ~35% service workspace, reference-density service cards with 106px image columns, typography/metric scale, map-control sizing, selected-service popup treatment, lighter OSM tile rendering, logo crop/wordmark scale, and filter-row overflow at both 1536px and 1458px widths. At 1536×1024 the measured layout is now: header 1512×123, search x=255/w=735/h=44, service workspace 536px, map starts x=549, service cards 506×154, and the category/filter row has no overflow. At 1458×1025 the service workspace scales to ~509px, search scales to ~700px, and the filter row also has no overflow. Preserve the real 15-place dataset and Leaflet behavior; remaining visual differences are mostly source assets/data-dependent rather than CSS geometry.

- **Explore / Home Desktop:** polished on 2026-10-22 against the approved `Explore Home Desktop` reference. The working Leaflet implementation was preserved and the screen now uses the reference structure: two-row floating header, 540px desktop service workspace, remaining-width map canvas, selected-service map card, compact map controls, and reference-like service-card density.
- Explore interface iconography now uses **Lucide React** instead of emoji/text-symbol icons. The shared `AppShell` mobile navigation and the Explore filter modal were updated in the same pass. Approved exported SerbisYO marker assets remain in use for map pins because they are canonical project graphics.
- Explore now uses the 15-place real central-Morong dataset from `data/morong-real-places.json` for provider identity, address, and coordinates. `apps/web/src/data/morongPrototypeServices.ts` enriches those real places with clearly prototype/simulated wait, reliability, confidence, score, and insight values.
- At the 1536×1024 desktop reference viewport the Explore geometry is approximately: 131px header, 540px left service workspace, 970px map canvas, and five visible 150px result cards. The page has no document overflow. At the 941×1672 mobile test viewport, the map remains full-height with a responsive lower service sheet and no document overflow.
- **Image Review workflow:** implemented on 2026-10-22 at `/image-review`. The development-only page loads the 15 real Morong establishments and their discovered image candidates, persists approve/reject/main-image decisions in `dev-data/image-review-decisions.json`, supports fullscreen viewing with zoom and previous/next navigation, shows source/license/attribution details, and summarizes readiness per establishment. `Find another` performs another Wikimedia candidate search for the selected establishment and stores extra candidates locally in `dev-data/image-review-extra-candidates.json`. `Continue & download approved images` is enabled only when every current candidate has been reviewed; it downloads only approved images directly to `assets/establishments/<place-id>/`, names the selected main image as `01-main`, writes `assets/establishments/image-sources.json`, and allows incomplete establishments to continue with warnings. No unzip step is required because export writes directly into the canonical asset tree.
- **Drive establishment asset import:** on 2026-10-22, 14 member-uploaded images were downloaded from the shared Drive establishment folders into `assets/establishments/`, normalized to `.jpg`, verified as decodable JPEGs (mostly 2752×1536; one 1920×1440), and synchronized to `apps/web/public/assets/establishments/`. Three places currently have complete 3-image sets: Morong Municipal Hall, LTO Morong District Office, and URS Morong Campus. Other populated folders are partial and 8 establishment folders were still empty on Drive at import time.
- **Local establishment imagery is wired into the shared Morong prototype data.** `morongPrototypeServices.ts` now registers all **29 imported local establishment assets**. Explore/search/map previews use the first available local image with priority `01-main` → `02-place` → `03-service`; places with no local asset still use their existing category fallback temporarily. The full local image arrays are exposed on each `ServiceSummary.images` entry for profile/gallery use.
- **Second Drive asset sync:** on 2026-10-22 the establishment library increased from 14 to **29 local JPEGs** across 10 establishments. Nine places now have complete `01-main` / `02-place` / `03-service` sets; Morong Public Market has `02-place` + `03-service`; five place folders remain empty. `morongPrototypeServices.ts` was updated so newly available `01-main` images immediately replace temporary category fallbacks for Morong Fire Station, Registry of Deeds, Savemore Morong, Rizal Provincial Hospital System - Morong, Supreme Care, and the newly completed Morong National High School set.
- **Explore marker/icon asset pack:** the new Drive folder `03 - Media Assets/pinpoints-pt2` was pulled into the canonical library. Category default/selected markers now exist for clinic/healthcare, food, education, commerce, utilities, and transportation, plus neutral markers; Explore-specific `layers-map`, `locate-crosshair`, `shortest-wait`, `highest-reliability`, `accessible-category`, `food-category`, and `bank-category` icons are under `assets/icons/`; three community avatar placeholders are under `assets/avatars/`. Explore now chooses category-specific default/selected marker assets instead of generic blue pins, and selected states use distinct generated selected graphics rather than scale-only changes.
- **Explore mobile reference pass:** implemented against the approved `Explore Home Mobile` reference at a 501×889 validation viewport. Mobile is now a purpose-built map-first layout rather than the desktop list compressed vertically: frosted top identity/location row, standalone search/filter row, five-chip quick filter strip, full vector map behind the header, category markers, compact persistent map labels, one floating recenter control, selected-service bottom sheet, and fixed Explore/Contribute/Saved/Profile navigation. The mobile header/sheet/nav are explicitly stacked above Leaflet panes, preventing the map canvas from covering the interface. Mobile map camera uses a Morong/Baras/Teresa composition separate from desktop framing while keeping every provider coordinate factual.
- The Image Review route is guarded by `import.meta.env.DEV`, and the AGAPAY UI Commentor is intentionally hidden on `/image-review` so it cannot block fullscreen review controls. The workflow was functionally tested with a real Wikimedia image download (~3.7 MB), then the temporary export and test decisions were removed; the clean queue currently starts at **15 places, 42 image candidates, 0 reviewed, 42 pending**.

- **Third Drive asset sync (latest, supersedes earlier establishment counts):** completed on 2026-10-23 after rescanning the connected Google Drive media folders. The marker/icon/vector packs had no new delta. Twelve newly uploaded establishment photos were imported into the canonical `assets/establishments/` tree and synchronized to `apps/web/public/assets/establishments/`, raising the current library to **41 JPEGs across all 15 Morong establishment folders**. New runtime sets were registered for Mercury Drug - Morong T. Claudio (3), Commandancia / Museong Pambayan (3), East Systems Colleges of Rizal (3), Morong Rural Health Unit (2), and Morong Doctors Hospital (1). Mercury's PNG main upload was converted to the canonical JPEG role. Twelve establishments now have complete three-image sets; Morong Public Market and Morong Rural Health Unit each have two images, and Morong Doctors Hospital has one. All 15 current prototype places now have at least one local establishment image. Browser validation on Explore confirmed all five newly registered main-image URLs decode successfully.
- **Commentor Batch 4 polish:** processed and resolved on 2026-10-23 after exact-viewport browser validation. At 1464×1100, the Explore result-list header keeps `Nearby Services` and the result subtitle on single lines while reserving a compact sort/filter control region; the title had 279px available width and the subtitle measured one line. Saved Explore cards now use a filled Primary-blue bookmark with Primary-Lighter background; clicking Save was verified to render `fill=currentColor`, `rgb(0, 102, 255)` foreground, and `rgb(230, 240, 255)` background. The selected map-preview wait, reliability, and score values now use branded 16px/700 emphasis. Community Intelligence now preserves the same Explore shell: desktop measured x=12/y=12/w=1440/h=121 with the same x=245/y=23/w≈703/h=44 search field, exact Explore desktop category/decision labels, and content starting at y=140. Mobile preserves the Explore identity/search/quick-chip shell through y=192 with content beginning immediately below. At the Saved mobile review viewport 524×1100, the text column reserves space for the bookmark; the long University of Rizal System title truncates correctly and tested cards maintain a 7px gap with zero title/bookmark overlap. All five comments were marked resolved only after these checks and zero console errors.

- **Third Drive asset sync:** completed on 2026-10-23 after rescanning `03 - Media Assets/photos/establishments` plus the marker/icon/vector folders through connected Google Drive. Marker/icon/vector packs had no new delta. Twelve newly uploaded establishment photos were imported into the canonical `assets/establishments/` tree and synchronized to `apps/web/public/assets/establishments/`, raising the library from 29 to **41 JPEGs across all 15 Morong establishment folders**. New runtime sets were registered for Mercury Drug - Morong T. Claudio (3), Commandancia / Museong Pambayan (3), East Systems Colleges of Rizal (3), Morong Rural Health Unit (2), and Morong Doctors Hospital (1). Mercury's PNG main upload was converted to the canonical JPEG role. Twelve establishments now have complete 3-image sets; Morong Public Market and Morong Rural Health Unit each have two images, and Morong Doctors Hospital has one. Browser validation on Explore confirmed all newly registered main-image URLs decode successfully.
- **Commentor Batch 4 polish:** processed and resolved on 2026-10-23 after exact-viewport browser validation. At 1464×1100, the Explore result-list header now keeps `Nearby Services` and its result subtitle on one line while reserving a compact fixed sort/filter region. Saved Explore cards now use a filled SerbisYO-blue bookmark with a light-blue selected background; the selected map-preview wait, reliability, and score numbers were promoted to 16px/700 emphasis. Community Intelligence now preserves the Explore shell instead of switching header geometry: desktop uses the same x=12/y=12/w=1440/h=121 shell and matching search/category structure with content beginning at y=140; mobile preserves the Explore identity/search/quick-chip shell through y=192 with content immediately below. At the Saved mobile review viewport 524×1100, service text reserves room for the bookmark, long titles truncate, and all tested cards keep a 7px title-to-bookmark gap with zero overlap. All five comments were marked resolved only after these browser checks and zero console errors.
- **Commentor Batch 4 follow-up:** two comments added during the previous timed-out run were also processed on 2026-10-23. The mobile Explore/Community Intelligence shell now uses a six-stop white-to-transparent gradient with lighter 1px backdrop blur so the lower edge fades more gradually into the map. Open mobile Service Profile overlays now keep a persistent top-edge drag handle above the profile content; the handle follows pointer movement with transitions disabled during the gesture, snaps from expanded to a minimized panel on a moderate downward drag, restores on an upward drag, and closes the profile on a longer downward drag while preserving the fixed bottom navigation. Browser validation at 524×1100 measured the expanded panel at y=308/h=716, minimized at y=550/h=474, restored to y=308/h=716, and a long drag returned to `/explore`; the page retained zero horizontal overflow and zero console errors.
- **Native real-map POI context restored:** on 2026-10-23 the shared OpenFreeMap style stopped suppressing native POI layers. High-priority OpenStreetMap/OpenFreeMap POIs now appear at Morong-wide Explore zooms (`poi_r1` and transit from ~13.6, `poi_r7` from 14, lower-priority `poi_r20` from 15) so the map carries real geographic/place context in addition to the 15 SerbisYO prototype providers. Native POIs use neutral gray text/icons in the SerbisYO theme and remain part of the MapLibre canvas only: they do not get custom SerbisYO click handlers, preview cards, scores, wait/reliability data, contribution actions, or Service Profile routes. The same context exposure is applied to Streets mode while retaining its native visual styling. Browser validation at 1562×992 confirmed the four POI layers are visible at the intended thresholds, one MapLibre canvas remains active, horizontal overflow is zero, and console errors are zero.
- **Map-context + MVP community-report refinement:** completed on 2026-10-23 from the Explore/map references and Commentor batch. The SerbisYO vector theme now uses a calmer modern spatial palette (page/background `#F3F4EF`, water `#C4E7F3`, softer buildings/parks/roads/boundaries and quieter labels) while retaining the project's own visual identity. Native OpenFreeMap sprite icons are hidden and replaced by a deterministic checked-in OSM context snapshot in `data/morong-osm-pois.json`, sourced from named Morong OpenStreetMap places; the snapshot is rendered with the project's food/commerce/default/neutral pin assets as low-z-index, pointer-inert markers. These background POIs remain neither searchable nor clickable and never receive SerbisYO score/wait/profile data. At the 1734×1100 Explore review viewport, 8 contextual POI pins and all 15 prototype provider pins are simultaneously visible; native pins have no pointer/keyboard interaction and only one provider pin has the selected color-matched glow. The selected desktop preview widened from 424px to 520px and now computes top/right/left/bottom attachment from the selected pin and available map bounds. Browser tests showed the Municipal Hall preview inside the map at x=673/y=545 and, after selecting East Systems Colleges of Rizal, the same card reattached at x=898/y=346 while remaining inside the map. Map attribution remains visible because the OpenStreetMap/OpenMapTiles/OpenFreeMap licenses require it, but global Leaflet attribution styling is reduced to 9px / 72% opacity with a subtle translucent background.
- **Structured community-experience records:** `communityExperiences.ts` now supplies deterministic per-provider prototype records plus browser-persisted new submissions under `serbisyo-community-experiences-v1`. Records carry IDs, provider/service, visit date/time, wait/processing values, availability, information accuracy, ratings, notes, sentiment, and source. Seed records are explicitly prototype data rather than claimed historical resident submissions. The new reusable `CommunityReportsModal` provides list + one-by-one detail browsing on Service Profile and Community Intelligence. Contribution Review now writes the submitted experience into this same record model before the success route. Validation on LTO showed 27 structured reports, and a reversible storage test increased the dataset 27→28 after a new submission and restored it to 27 afterward.
- **Commentor map/data batch:** all six notes from 2026-10-22 20:40–20:57Z were implemented and browser-validated before resolution. Contribution stage 1 now places a highlighted `Cancel contribution` action at y=89 on desktop while preserving the bottom Cancel on mobile. Community Intelligence metric cards are clickable report entry points and expose the actual structured-record count; LTO opened `Service Quality Reports` with all 27 report rows and one-by-one details. Busy Hours now derives its 23 half-hour bins from those records; hover/focus on a bar dims the other 22 and shows the exact observed timestamp (validated tooltip: `11:40 AM · 3 reports`). Service Profile now constrains its desktop main pane to the 948px overlay height, producing a real 220px scroll range for its 1168px content and making Recent Community Experiences reachable. The attribution comment was resolved by retaining required source credit while de-emphasizing it, not by removing it.
- **Two-phase Service Profile morph refinement:** on 2026-10-23 the Explore → Service Profile transition was changed so desktop morph geometry comes from the complete Nearby Services panel (validated source rect 536×948 at x=12/y=140) rather than the selected per-service row; mobile continues to use the whole selected-service bottom sheet (validated source 499×205 at x=0/y=606 on a 499×887 viewport). The temporary copied `ServiceCard` inside the overlay was removed. During the first ~390ms only panel geometry changes; profile information remains at opacity 0. Once the shell reaches its final 1051.64×948 desktop geometry, `.service-profile-reveal-item` elements animate upward/fade in with 52ms stagger orders: Back/image/title/status/category/address/hours/description/actions first, followed by summary/intelligence/busy-hours/services/accessibility and community-report rows. At 180ms desktop validation showed the shell mid-expand at ~1033px width with every sampled information line still opacity 0; at ~410ms only the earliest lines had begun revealing. No result-card ghost remains in the overlay. Reduced-motion mode collapses these reveals to 1ms.
- **Batch 6 Explore/Community Intelligence refinements:** the Open Now filter switch thumb now has an explicit 2px inset and 20px travel so its 20px circle remains inside the 44×24 track in both states (validated desktop and mobile). Re-clicking an already-selected provider pin now deselects it rather than opening the profile: browser validation changed glow count 1→0, selected result rows 1→0, and the 520px selected-service preview from visible to `display:none` with no profile overlay. Community Intelligence Busy Hours now reacts continuously on hover/focus with a distance-based curve: the hovered bar is the local peak while neighboring bars taper and fade progressively; URS validation around the 11:07 AM sample produced local heights about 34→50→65→85→111→63→34px and tooltip `11:07 AM · 1 report`. A reusable establishment gallery now uses each provider's approved `images[]`: URS renders all 3 thumbnails and a full-screen viewer; Next changed `01-main`→`02-place` and ArrowLeft returned to `01-main`, with Previous/Next plus Escape/arrow-key support.
- **Morong-wide context pin expansion:** the deterministic OSM snapshot in `data/morong-osm-pois.json` was expanded from a small handful to **56 named places whose OSM/Nominatim address explicitly resolves to Morong, Rizal**, covering schools, fuel, restaurants, convenience, banks, cafes, pharmacies, supermarkets, hospitals, fire/police, and university context. Explore supplements that snapshot with POIs from the already-loaded OpenMapTiles `poi` source when available. At 1734×1100, browser validation showed 47 static context pins + 1 live vector POI + 15 full SerbisYO provider pins, no horizontal overflow, and zero console errors. Context pins are clickable but intentionally open only a lightweight no-image basic map card (validated on Petron) with “No SerbisYO community data yet”; selecting one clears the SerbisYO glow/card and never grants a Service Profile or simulated community metrics. Mobile validation at 499×887 showed the context card bounded at x=16…483 with zero horizontal overflow.

## 6. Current Build Status

The inherited Vite typing issue involving `ImportMeta.env` has been corrected by restoring `vite/client` types in `apps/web/tsconfig.json`.

As of the latest Explore + Image Review pass:

```text
npm run check  -> passing
npm run build  -> passing
```

Keep both commands green after each major development batch.

### Development shortcuts

- Hold `Ctrl+C` for about 1 second — show/hide the AGAPAY UI Commentor when `Ctrl+C` is not being used for editable/selected text.
- `Ctrl+Shift+C` — toggle the AGAPAY UI Commentor immediately.
- `Esc` — close the active AGAPAY comment composer.
- `Ctrl+D` — reset SerbisYO same-origin state and return to Login as a fresh user.

UI Commentor project-file storage:

```text
dev-data/ui-commentor-comments.json
```

This file is intentionally gitignored so review notes remain local while still being readable in future DevSpace chats.

## 7. Current Visual / Implementation Drift To Correct

The current member prototype contains some temporary implementation choices that **must not be mistaken for approved design decisions**:

- Other pages outside the polished Explore flow may still use emoji/unicode approximations for icons and metrics and should be migrated when those screens are polished.
- The shared shell no longer uses the incorrect external female avatar; it currently uses a neutral Lucide profile placeholder until the canonical approved **male avatar** is available as a local runtime asset.
- Several service/provider images still use Unsplash placeholders.
- Some marker/icon treatments are constructed in CSS or text even though approved exported assets now exist.
- Some text contains encoding artifacts such as corrupted dashes, bullets, stars, or emoji characters and should be cleaned during polishing.

These should be corrected toward the approved UI references and the real asset library, not preserved simply because they currently render.

The first continuation pass also established `apps/web/public/assets/` as the runtime mirror of the canonical root asset library. Use `npm run sync:assets` after changing approved assets.

## 8. Asset Rule

Canonical asset source:

```text
assets/
```

The written asset rules and catalog are in:

```text
ASSET_CONTEXT.md
```

For exact machine-readable file lookup, use:

```text
assets/asset-manifest.json
```

Important rule:

> If an approved exported asset exists for a marker, icon, map illustration, or decorative vector, use that asset instead of recreating it with raw CSS, emoji, text symbols, or an unrelated library icon.

CSS/HTML/React should still create normal interface surfaces such as buttons, cards, sheets, chips, inputs, dividers, shadows, layout, and states. Do not turn normal UI into raster images.

## 9. Branding Rule

Canonical written branding reference:

```text
BRAND_CONTEXT.md
```

Canonical visual branding references:

```text
assets/branding/Color Pallete.png
assets/branding/Typography.png
```

Implementation should be checked against both the written rules and these images.

## 10. UI / UX References

The main page references remain under:

```text
ui-ux-references/
```

The current UI should follow the approved visual language even when the prototype implementation currently differs. For major layout corrections, compare against the appropriate desktop/mobile reference rather than improvising.

## 11. Continuation Priority

When resuming development, prefer this order:

1. Restore a clean TypeScript/build state.
2. Inventory the current prototype page by page before redesigning anything.
3. Replace temporary emoji/CSS marker approximations with approved assets where an exported asset exists.
4. Align shell, typography, colors, spacing, avatar, cards, and map behavior with approved references.
5. Preserve working interactions while visually refactoring.
6. Replace or localize placeholder imagery only where needed for the demo.
7. Connect PHP/PostgreSQL only where it materially improves the required prototype flow.
8. Test desktop and mobile responsiveness after every major page batch.

## 12. Development Discipline

- Do not overwrite member work without first understanding what it does.
- Do not rebuild working screens from scratch merely to make them cleaner.
- Make focused, reversible changes.
- Prefer approved assets over approximations.
- Prefer reusable components over repeated one-off markup.
- Keep the `development` branch as the working branch unless the Team Leader explicitly changes the branch strategy.
- Do not silently promote unfinished work to `main`.

## 13. Files Future Chats Should Read First

For implementation work, read in this order:

1. `DEVELOPMENT_CONTINUATION_CONTEXT.md`
2. `PROJECT_CONTEXT.md`
3. `BRAND_CONTEXT.md`
4. `ASSET_CONTEXT.md`
5. `APPROVED_UI_BASELINE.md`
6. `PRODUCT_SCOPE.md`
7. `TECHNICAL_PLAN.md`
8. The relevant page/component source files

For Explore/map/service-data work, also read `MORONG_REAL_PLACES_CONTEXT.md` and `data/morong-real-places.json` before adding, renaming, or relocating prototype providers.

For establishment-image work, read `IMAGE_COLLECTION_CONTEXT.md`. The approved zero-paid-API order is Wikimedia Commons first, then official/public page discovery with Cheerio, Playwright/Cheerio, and Puppeteer/Cheerio. Google Places API is not part of the prototype pipeline.

For a visual change, also inspect the matching folder under `ui-ux-references/` before editing.

