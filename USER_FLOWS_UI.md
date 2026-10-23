# SerbisYO User Flows and UI/UX Direction

## 1. UX Objective

SerbisYO should feel like **maps + community intelligence + service transparency**.

It should not feel like a generic admin dashboard, government-only portal, social network, or e-commerce site.

The interface should help users understand important service information quickly, with the map and decision-relevant metrics as the visual focus.

## 2. Visual Direction

- **Primary color:** `[TBD - to be provided by Team Leader]`
- Designers should establish supporting colors for:
  - Secondary/accent
  - Success
  - Warning
  - Error
  - Background/surface
  - Primary/secondary text
  - Borders/dividers
- Define a small, consistent typography system.
- Use reusable components and spacing rules.
- Prioritize readability and trust over decoration.
- Avoid overwhelming users with too many metrics at once.

## 3. Core User Flow A - Discover a Service

1. User opens SerbisYO.
2. Home/Discovery page shows a search bar, map, categories, and nearby results.
3. User searches for a service, category, or provider.
4. Matching providers appear as map markers and result cards.
5. User selects a provider.
6. Service Profile opens.
7. User reviews service intelligence.
8. User decides where/when to go.

Example decision:

> Clinic A has a 22-minute average wait, 89% reliability, and is busiest from 12 PM to 2 PM. The user chooses to visit at 3 PM.

### Search autocomplete behavior

- Focusing the Explore search field opens a contextual autocomplete layer without immediately replacing the underlying Nearby Services list or map markers.
- The autocomplete can surface a matching service category, top matching providers, recent searches, and nearby intent suggestions such as open, shortest-wait, or accessible services.
- Choosing a suggestion commits the search/filter and returns focus to the Explore canvas. Typing alone should remain a preview state until the user commits or leaves the search.
- Desktop keeps the autocomplete attached to the header search field over the existing split map/results workspace.
- Mobile uses an inset search sheet over the live map, keeps map controls accessible in the uncovered edge, hides the ordinary selected-service bottom sheet while searching, and preserves the bottom navigation.

### Filters & Sorting behavior

- Explore exposes Filters & Sorting without replacing the global discovery shell or map context.
- Desktop opens a bounded floating panel beginning beside the results list and over the map/content region. The underlying list remains visible at the left and the global header remains active.
- Mobile opens an inset bottom sheet above the persistent bottom navigation while leaving the upper map visible.
- Filter groups include Open now, service category, accessibility, waiting time, reliability, community confidence, and Sort By.
- Primary filter actions use white text on the approved Primary blue; selected secondary options use approved blue text on the Primary Lighter surface.
- Applying filters updates the Explore results; selecting a top-level category/decision chip clears hidden modal filter state so the visible controls remain the source of truth.

## 4. Core User Flow B - Contribute an Experience

1. User opens a Service Profile.
2. User selects **Contribute Experience**.
3. User chooses the service received.
4. User enters structured experience data.
5. User optionally adds a short comment.
6. User submits.
7. System confirms the contribution.
8. Contribution becomes part of the service intelligence/demo dataset.

Confirmation message direction:

> **Thank you. Your experience helps the next person make a better service decision.**

## 5. Core User Flow C - Check Community Intelligence

1. User opens a Service Profile.
2. User sees the overall SerbisYO Score and high-priority metrics.
3. User opens the Community Intelligence / Busy Hours drill-down.
4. User reviews community confidence, service-quality dimensions, busy-hour patterns, typical wait windows, and recent trends.

### Community Intelligence detail behavior

- The dedicated route is /services/:providerId/community-intelligence.
- Desktop preserves the SerbisYO discovery shell and a live map on the right while the intelligence detail scrolls independently on the left.
- Mobile removes the live map from the detail surface and prioritizes a compact provider card, stacked intelligence metrics, Busy Hours, typical wait windows, trend guidance, and persistent bottom navigation.
- A visible Back to Service Profile action returns to the same provider.
- Community Intelligence and Busy Hours summary cards on Service Profile are interactive entry points to this detail view.

## 6. Core User Flow D - Correct Information

1. User opens a Service Profile.
2. User selects **Suggest an Update** or **Report Incorrect Information**.
3. User identifies the incorrect detail or issue.
4. User submits the correction/report.
5. Moderator/admin can review it in the prototype moderation flow.

### Suggest an Update behavior

- Opens above the current Service Profile without replacing the underlying Explore/Profile context.
- Desktop uses a centered modal. Mobile uses a bottom sheet that leaves part of the provider context visible above it.
- The selected provider card uses the real current provider image/name/category/address.
- The form supports correction topic selection, current displayed hours, replacement opening/closing times, optional explanation, optional supporting photo, and a moderation notice.
- Suggestions do not immediately change provider data. The submit state explicitly says the update was sent for review.

### Report Information / Contribution behavior

- Opens above the current Service Profile and references the contribution being reported plus its provider context.
- Desktop uses a centered modal. Mobile stops above the persistent bottom navigation rather than covering it.
- Report reasons include spam, fake/misleading contribution, abusive/harmful content, irrelevant content, privacy concern, and other.
- The form includes an optional explanation and clearly states that reporting does not automatically remove or change the contribution.
- Report and Suggest overlays render at the document level so they remain above the persistent Explore shell and morphed Service Profile overlay.

## 7. Required Screen: Home / Discovery

### Main Elements

- SerbisYO logo/brand
- Search bar
- Map
- Current area/location indicator if available
- Category filters
- Map markers
- Nearby/search result cards
- Filter button
- Sort control
- Open Now status where possible
- SerbisYO Score or reliability indicator on cards
- Estimated waiting time on cards when available
- Contribute shortcut where appropriate
- User/profile/menu control

### Desktop Layout Direction

- Split layout is recommended: **results/list panel + large map panel**.
- Map remains useful while browsing results.
- Selected card and selected marker should visibly correspond.

### Mobile Layout Direction

- Search and category controls at the top.
- Map remains central.
- Results can appear as bottom cards, bottom sheet, or a switchable list.
- Do not compress the desktop layout into a tiny two-column screen.
- Primary actions must be thumb-friendly.

## 8. Required Screen: Service Profile

### Header Information

- Provider/service name
- Category
- Address
- Open/Closed state if available
- Operating hours
- Contact information if included
- Overall rating/community experience
- SerbisYO Score

### High-Priority Service Intelligence

- Average waiting time
- Average processing time
- Reliability
- Information accuracy
- Service quality
- Accessibility
- Community confidence
- Number of contributions

Example presentation:

> **SerbisYO Score: 87/100**  
> Average Wait: 24 min  
> Processing Time: 15-20 min  
> Reliability: 91%  
> Information Accuracy: 94%  
> Community Confidence: High

### Other Sections

- Services offered
- Peak/busy hours
- Recent community experiences
- Comments/feedback
- Service details
- Accessibility information

### Main Actions

- **Contribute Experience**
- **Suggest an Update**
- **Report Incorrect Information**
- **View on Map**

## 9. Required Screen: Contribution Form

Keep it short and structured.

### Fields

- Service received
- Date/time of visit
- Waiting time
- Processing/service time
- Was the service available?
- Was posted information accurate?
- Service quality rating
- Accessibility rating
- Overall experience
- Optional comment

### Interaction Requirements

- Clear required/optional fields.
- Numeric time fields should be easy to enter on mobile.
- Validation errors should be human-readable.
- Submission should show a success state.

### Contribution Workflow Board behavior

- The contribution experience is one continuous four-stage flow: **Service → Visit → Experience → Review**.
- The selected provider card stays visible across all four stages so users never lose context about which service/location they are contributing to.
- Stage 1 collects the specific service used plus visit date/time.
- Stage 2 collects waiting time, processing time, service availability, information accuracy, and an optional community note.
- Stage 3 collects Service Quality, Accessibility, Overall Experience, and an optional accessibility note.
- Stage 4 presents an editable summary of all prior answers before submission.
- Previous, Back, Next, and Edit actions preserve the in-progress answers while moving between stages.
- Desktop uses a focused full-width contribution surface under the recurring SerbisYO header. The provider card includes a compact map preview rather than preserving the older large contribution/map split.
- Mobile keeps the compact SerbisYO header, four-step progress indicator, provider card, one-column contribution content, and persistent bottom navigation with Contribute active.
- Do not shrink controls below the project typography minimum to force the board to fit. On narrower phones, allow vertical scrolling while keeping the choice rows readable.

### Contribution Success behavior

- Review submission navigates to /contribute/success?provider=:providerId and passes the in-progress contribution summary into the confirmation state.
- The success screen confirms that the experience was added, summarizes the provider/service/visit/wait/processing details, and demonstrates the prototype community-data update.
- It shows the contribution count increasing by one while preserving the provider's current Community Confidence label.
- It summarizes which intelligence areas the contribution helps improve.
- Primary follow-up action is **View Updated Insights**; secondary action is **Back to Service**.
- Desktop keeps the full SerbisYO header/category shell. Mobile keeps the compact header and persistent bottom navigation with Contribute active.

## 10. Saved Services

- Saved Services uses the shared SerbisYO product shell and keeps Saved active in the mobile bottom navigation.
- Desktop uses a dense saved-provider list plus a right-side saved-map/context rail. Five saved providers should fit in the normal desktop frame without document scrolling.
- Each row includes provider image, category/address, open state/hours, average-wait range, reliability, SerbisYO Score, recent community insight, and a saved/bookmark control.
- The saved list can be sorted by recently saved, score, or waiting time. Removing a bookmark immediately removes that provider from the local prototype list.
- Mobile removes the map/context rail and presents full-width stacked provider cards. Vertical scrolling is expected for the saved collection.
- Provider identity, address, image, distance, reliability, score, and prototype intelligence come from the shared Morong prototype dataset rather than reference-only placeholder names.

## 11. User Profile Activity

- Profile uses a community-impact header with avatar, location, Account Settings, and three summary metrics: experiences shared, saved services, and updates suggested.
- Desktop shows Recent Contributions beside a Saved Services panel.
- Mobile replaces the desktop saved sidebar with four compact activity-navigation rows: My Contributions, Saved Services, Recent Activity, and Account Settings.
- Mobile Recent Contributions shows the two latest contribution cards in the default viewport; desktop shows four.
- Contribution rows expose provider, service type, date, wait, comment, moderation/published state, and clear status treatment.
- Account Settings remains a lightweight prototype modal and can update the displayed name/location locally.

## 12. Simple Service Comparison

- Compare uses a decision-focused side-by-side layout under the shared product shell.
- Desktop displays three provider cards; mobile displays two cards side by side and hides the third provider rather than collapsing into a one-card carousel.
- Each comparison card includes image, provider/category, score, open state, distance, wait, processing time, reliability, accessibility, community confidence, and follow-up actions.
- The best value for selected dimensions can use a subtle Success-background highlight and short badge such as Nearest, Shortest wait, or Fastest.
- Desktop may show Recent Insight as an additional comparison row. Mobile omits this lower-priority row to keep the full two-card comparison within one screen while preserving the 12px type minimum.
- View Profile opens the real provider profile; View on Map returns to Explore with that provider in context; Add Service returns to service discovery.

## 13. Resilience and Empty States

### No Results / Empty Search

- A committed search with zero matching providers keeps the Morong map useful instead of blanking the entire screen.
- Desktop replaces the left service-list surface with a full empty-search panel while the map remains visible with a small set of contextual Morong markers.
- Mobile keeps the map in the upper region and uses a bottom-sheet empty state above the persistent navigation.
- The empty state includes Clear filters, Search a wider area, Try another category, and popular-category shortcuts.
- Clearing the state restores the real provider list immediately.

### No Community Data

- Service Profile must not fabricate ratings, wait estimates, confidence, or recent experiences when a provider has no community reports.
- The empty-data state keeps the real provider identity, category, address, hours placeholder, save/share actions, location context, and contribution entry point.
- Community Experience becomes a clear “No community experience yet” state with **Contribute Experience** as the primary action and short explanations of how a first report helps.
- Mobile uses the compact identity/location header only, rather than retaining Explore search/category controls above a focused service state.
- The production condition is zero community reports. The query parameter `community=empty` is retained as a deterministic prototype/QA preview hook.

### Map Loading Failure

- Explore remains usable when the map cannot initialize or the browser goes offline.
- Desktop preserves the service list and replaces only the map surface with a map-unavailable state.
- Mobile shows a compact map-failure card followed by the real service list, with the persistent bottom navigation unchanged.
- Retry Map attempts to restore the live map; Use Service List moves attention to the fallback list.
- The query parameter `map=failed` is retained as a deterministic prototype/QA preview hook.

## 14. Moderator and Future Provider Workspaces

### Moderator Queue

- Route: `/moderation`.
- Desktop uses the SerbisYO moderator role shell: persistent top header, compact left navigation, queue tabs, scrollable review list, and a selected-report review panel.
- Mobile removes the desktop sidebar and uses Queue / Approved / Rejected / Profile bottom navigation.
- Queue tabs cover Pending Review, Reported Contributions, and Suggested Corrections.
- Queue cards preserve provider identity and imagery from the shared Morong prototype dataset while report reasons, timestamps, authors, and moderation status remain prototype data.
- On desktop, selecting a queue card updates the adjacent review context. Opening the report enters the full report-review route.
- On mobile, the chevron on each card opens the full report review.

### Moderator Detail Report Review

- Route: `/moderation/:reportId`.
- Keeps provider context, report reason, original contribution, reporter explanation, official information, recent contribution context, previous moderation status, moderator notes, and moderation decisions.
- Desktop follows a two-column review workspace and remains fitted to the 1536×1024 reference frame.
- Mobile stacks the review evidence in decision order: provider/report → original contribution → reporter explanation → official information → recent context → previous status → moderator notes.
- Mobile replaces the moderator bottom navigation with a fixed Keep Contribution / Remove Contribution / Request Review decision bar for the duration of the focused review task.

### Future Provider Dashboard

- Route: `/provider`.
- This is an explicitly future/provider-facing prototype workspace and does not change the current community-user MVP permissions.
- Desktop uses a provider role shell with provider navigation, public-profile access, Overview / Reviews & Feedback / Manage Information tabs, community intelligence, official-information editing, feedback response, recurring issues, and recent community insights.
- Mobile removes the provider sidebar, preserves the provider identity card and three-tab header, and allows vertical scrolling rather than shrinking content below the brand typography floor.
- The mobile page exposes a direct Official vs Community comparison action because the desktop-only sidebar is unavailable.

### Future Official vs Community

- Route: `/provider/official-vs-community`.
- Compares official provider information with structured community-reported experience for processing time, operating hours, service availability, accessibility, and information accuracy.
- Every comparison includes an explicit Insight & Opportunity result; positive/consistent findings use Success treatment, while improvement opportunities use Warning treatment.
- Desktop exposes the workspace through both the provider sidebar and the provider tab row and fits the full five-row comparison in the 1536×1024 frame.
- Mobile is intentionally focused: no desktop comparison tabs or side navigation, just Back to Dashboard, provider identity, the comparison heading, context notice, and stacked comparison cards.

## 15. Reusable Components to Design

- Navigation bar
- Search bar
- Category chips
- Filter controls
- Map marker states
- Service result card
- Score badge
- Status badge
- Metric/stat card
- Community contribution card
- Buttons
- Form controls
- Modal/dialog/bottom sheet
- Tabs if used
- Loading state
- Empty state
- Error state
- Toast/feedback message
- Mobile navigation
- Moderator role shell
- Provider role shell
- Moderation queue card
- Moderation decision bar
- Official vs Community comparison row

## 16. Responsive Requirements

- Design at least one desktop and one mobile composition for every core screen.
- Components should adapt fluidly, not only at one fixed breakpoint.
- Check long names, long addresses, comments, and large metric values.
- Avoid horizontal scrolling for normal mobile usage.
- Keep touch targets large enough for mobile interaction.
- Preserve hierarchy when width becomes narrow.
- Do not hide critical information just to make the layout fit.

## 17. Designer Work Direction

- Research map, service discovery, review, community, and civic-service interfaces.
- Build a reference/mood board.
- Establish design tokens early.
- Wireframe the complete core flow before polishing visuals.
- Share wireframes with developers before final high-fidelity screens.
- Define component states, not only static screenshots.
- Coordinate with developers when a design requires difficult or unnecessary functionality.
- The final design should be feasible within the sprint.

