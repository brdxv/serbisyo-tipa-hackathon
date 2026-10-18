# SerbisYO Research, QA, Pitch, and Presentation Guide

## 1. Research Direction

Research should support decisions, not become a long academic paper.

### Problem Evidence to Gather

- Effects of inaccurate or outdated service information.
- Waiting/service-time uncertainty and its effect on users.
- Public-service transparency and accountability.
- Accessibility barriers when finding or using services.
- Value of community-generated information and its limitations.

### Comparative Research

Study existing platforms for patterns and gaps, such as:

- Map/location discovery products
- General review platforms
- Queue/wait-time systems
- Government/public service portals
- Community reporting platforms

For each comparison, identify:

- What it already does well
- What SerbisYO should not duplicate unnecessarily
- What information remains missing for service decision-making
- What design or trust mechanisms can be adapted

### Trust and Moderation Research

Investigate practical approaches for:

- Fake or malicious contributions
- Reputation abuse
- Outdated submissions
- Conflicting reports
- Provider corrections/responses
- Privacy considerations
- Confidence based on contribution volume and recency

## 2. Research Output Format

Keep findings actionable.

Recommended format:

```text
Finding:
Why it matters to SerbisYO:
Recommended project action:
Source:
```

Do not send the team large unfiltered link dumps.

## 3. QA Test Areas

### Discovery and Map

- Map loads correctly.
- Markers appear for sample providers.
- Selecting a marker opens/corresponds to the correct provider.
- Search returns expected providers.
- Empty search is handled properly.
- No-results state is understandable.

### Service Profile

- Correct provider details appear.
- Metrics correspond to the selected provider.
- Score and confidence display correctly.
- Long addresses/names do not break the layout.
- Buttons navigate or open the correct interactions.

### Contribution Flow

- Required fields are enforced.
- Invalid waiting/processing time is rejected.
- Rating bounds are enforced.
- Optional comment can be empty.
- Successful submission shows clear feedback.
- Contribution is saved or represented correctly.

### Score and Aggregation

- Use known test data and manually calculate the expected score.
- Verify averages.
- Verify contribution count.
- Verify confidence threshold behavior.
- Test providers with zero contributions.
- Test providers with very few contributions.

### Responsive UI

- Common desktop widths.
- Narrow laptop widths.
- Tablet-like widths if time permits.
- Common mobile widths.
- Long text.
- Browser zoom / content scaling where practical.
- No unwanted horizontal overflow.

### General

- Broken links/routes.
- Console errors.
- API failures.
- Loading states.
- Empty states.
- Error states.
- Form keyboard navigation if practical.
- Basic accessibility: labels, contrast, focus visibility, readable controls.

## 4. Bug Report Format

Use a concise standard format:

```text
Title:
Severity: Critical / Major / Minor / Cosmetic
Environment: Desktop/Mobile + browser/width if relevant
Steps to reproduce:
Expected:
Actual:
Screenshot/video if useful:
Status: Open / In Progress / Retest / Fixed
```

## 5. Pitch Positioning

Do not frame SerbisYO as:

> "a website where people rate services"

Preferred framing:

> **SerbisYO transforms community service experiences into practical service intelligence.**

The reputation effect is important, but the immediate product value is better decision-making and reduced uncertainty.

## 6. Pitch Story

Recommended narrative:

1. **Problem** - people can find where a service is, but often cannot know what the actual experience will be.
2. **Real scenario** - a person travels to an office/service only to find a long wait, unavailable service, outdated information, or unexpected processing time.
3. **Insight** - communities already have this information, but it is scattered and unstructured.
4. **Solution** - SerbisYO converts community experiences into structured, map-based service intelligence.
5. **How it works** - discover, inspect, decide, contribute.
6. **What makes it different** - structured metrics, time/service reliability, information accuracy, accessibility, confidence, recent community insight.
7. **Live demo**.
8. **SDG impact**.
9. **Future scope**.

## 7. Suggested Pitch Deck Structure

1. **SerbisYO**
   - Name
   - Tagline
   - Team 10

2. **The Problem**
   - What users currently cannot easily know

3. **Real-Life Scenario**
   - Show the cost of uncertainty

4. **Our Solution**
   - One clear paragraph/diagram

5. **How SerbisYO Works**
   - Discover -> Inspect -> Decide -> Contribute

6. **Core Features**
   - Map discovery
   - Community intelligence
   - Service profile
   - Contributions
   - SerbisYO Score + confidence

7. **Technology / Architecture**
   - React + Vite
   - Tailwind CSS
   - Node.js + Express
   - PostgreSQL

8. **Live Demonstration**

9. **SDG Alignment**

10. **Impact and Future Scope**

## 8. Demo Scenario

Use one controlled, believable scenario instead of clicking randomly.

Example:

1. User needs a dental/clinic/government service.
2. Search from Home/Discovery.
3. Compare two nearby results.
4. Open one Service Profile.
5. Show wait time, reliability, information accuracy, accessibility, confidence, and recent contribution.
6. Explain why the user chooses one provider/time.
7. Submit a community experience.
8. Show how the new contribution becomes part of the provider's service intelligence or demonstrate the expected updated state.

Prepare demo data so this flow is reliable.

## 9. Presenter Q&A Preparation

Presenters should be ready to answer:

- How is SerbisYO different from Google Maps/general review sites?
- How do you prevent fake or malicious contributions?
- How is the SerbisYO Score calculated?
- Why should users contribute data?
- What happens when data is outdated or conflicting?
- Why are waiting time and processing time important but not the whole system?
- How does this support SDG 11 and SDG 16?
- How would service providers benefit rather than simply being criticized?
- How would the project scale beyond the prototype?
- Why was this tech stack chosen?
- Which features are prototype-only and which are planned for future development?

## 10. Final Submission / Presentation Preparation

Before October 22 at 11:59 PM:

- Final build works on the demonstration machine/browser.
- Final database/sample data is stable.
- Demo account(s) are ready if authentication is used.
- Pitch deck matches the final UI.
- Source code is organized.
- Presentation video is prepared if required.
- Presenters have rehearsed the exact demo path.
- Team has a fallback plan if map/network/API data fails.
- Screenshots or a short backup recording of the core flow are available for emergency presentation recovery.

