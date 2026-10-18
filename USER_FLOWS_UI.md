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
3. User expands or scrolls to Community Insights.
4. User reviews recent experiences, trends, and confidence level.

## 6. Core User Flow D - Correct Information

1. User opens a Service Profile.
2. User selects **Suggest an Update** or **Report Incorrect Information**.
3. User identifies the incorrect detail or issue.
4. User submits the correction/report.
5. Moderator/admin can review it in the prototype moderation flow.

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

## 10. Optional/Admin Moderation Screen

If implemented:

- Pending information corrections
- Reported contributions
- Basic approve/reject action
- Reason/context
- Avoid building a large admin dashboard for the hackathon.

## 11. Reusable Components to Design

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

## 12. Responsive Requirements

- Design at least one desktop and one mobile composition for every core screen.
- Components should adapt fluidly, not only at one fixed breakpoint.
- Check long names, long addresses, comments, and large metric values.
- Avoid horizontal scrolling for normal mobile usage.
- Keep touch targets large enough for mobile interaction.
- Preserve hierarchy when width becomes narrow.
- Do not hide critical information just to make the layout fit.

## 13. Designer Work Direction

- Research map, service discovery, review, community, and civic-service interfaces.
- Build a reference/mood board.
- Establish design tokens early.
- Wireframe the complete core flow before polishing visuals.
- Share wireframes with developers before final high-fidelity screens.
- Define component states, not only static screenshots.
- Coordinate with developers when a design requires difficult or unnecessary functionality.
- The final design should be feasible within the sprint.

