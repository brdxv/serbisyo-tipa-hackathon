# SerbisYO Technical Plan

## 1. System Type

Responsive web application.

## 2. Agreed Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Languages | TypeScript + PHP | TypeScript for the React frontend; PHP for the backend API |
| Frontend | React + Vite | Interactive UI and fast development/build tooling |
| Styling | Tailwind CSS | Responsive styling and consistent UI implementation |
| Backend | PHP 8.2+ | JSON API, validation, business logic, scoring, and database access |
| Database | PostgreSQL | Relational storage for providers, services, contributions, users, and moderation data |

## 3. Technical Principles

- Keep architecture simple enough to finish and explain.
- Use TypeScript consistently in the frontend and PHP 8.2+ consistently in the backend.
- Separate UI, API/business logic, and persistence concerns.
- Build the core user flow before optional infrastructure.
- Use sample/seed data so frontend work can proceed immediately.
- Avoid unnecessary microservices or infrastructure.
- All core pages must be responsive.
- Do not depend on AI-generated code that developers cannot explain.

## 4. Suggested High-Level Architecture

```text
React + Vite Frontend
        |
        | HTTP/JSON API
        v
PHP Backend
        |
        | Queries / ORM or SQL layer
        v
PostgreSQL Database

Map Provider / Geospatial UI
        ^
        |
Frontend map integration
```

For the hackathon, use lightweight PHP with PDO rather than introducing a framework or ORM unless the team has a clear need for one. PostgreSQL remains the database source of truth.

## 5. Core Data Entities

### User

- id
- name/display name
- email or login identifier if authentication is implemented
- role
- created_at

### ServiceProvider

- id
- name
- category
- description
- address
- latitude
- longitude
- contact information
- operating hours
- status/verification fields if needed

### Service

- id
- provider_id
- name
- description
- expected/official processing information if known
- active/available state

### Contribution / Experience

- id
- user_id or anonymous/session reference if allowed
- provider_id
- service_id
- visit_at
- waiting_minutes
- processing_minutes
- service_available
- information_accurate
- service_quality_rating
- accessibility_rating
- overall_rating
- comment
- created_at
- moderation_status

### ProviderMetric / Aggregated Insight

This may be calculated dynamically rather than stored.

- average_waiting_time
- average_processing_time
- reliability_score
- information_accuracy_score
- service_quality_score
- accessibility_score
- overall_serbisyo_score
- contribution_count
- confidence_level

### Report / Correction

- id
- provider_id and/or contribution_id
- submitted_by
- type
- description
- status
- created_at

## 6. SerbisYO Score - Prototype Model

Keep the scoring model simple and explainable.

Suggested weighting:

| Dimension | Weight |
|---|---:|
| Service Quality | 25% |
| Reliability / Consistency | 25% |
| Time & Efficiency | 20% |
| Information Accuracy | 20% |
| Accessibility | 10% |
| **Total** | **100%** |

Prototype formula:

```text
SerbisYO Score =
  Service Quality * 0.25
  + Reliability * 0.25
  + Time & Efficiency * 0.20
  + Information Accuracy * 0.20
  + Accessibility * 0.10
```

All dimensions should first be normalized to the same 0-100 scale.

Suggested display labels:

- 90-100: Excellent
- 80-89: Very Reliable
- 70-79: Reliable
- 60-69: Needs Improvement
- Below 60: Low Reliability

These labels and weights are prototype decisions and may be adjusted after research. Do not present them as scientific standards.

## 7. Time & Efficiency Calculation Direction

Do not punish a provider simply because one service naturally takes longer than another.

Prefer one of these prototype approaches:

- Compare user-reported actual time with the provider's expected/posted time when that reference exists.
- Use consistency and predictability rather than raw speed alone.
- For demo data, clearly define expected service times so the calculation is explainable.

## 8. Community Confidence

The confidence indicator prevents a score based on very little data from appearing equally trustworthy.

Simple prototype example:

- **Low** - fewer than 5 recent contributions
- **Moderate** - 5 to 19 recent contributions
- **High** - 20 or more recent contributions

If development time permits, recency and consistency may also influence confidence.

The exact thresholds are implementation choices for the prototype, not research-backed universal standards.

## 9. Suggested API Surface

Routes may be adjusted to the team's backend conventions.

### Providers

- `GET /api/providers`
- `GET /api/providers/:id`
- `GET /api/providers/:id/services`
- `GET /api/providers/:id/insights`

### Search

- `GET /api/search?q=...`
- Optional filters: category, openNow, accessibility, reliability, maxWait

### Contributions

- `POST /api/providers/:id/contributions`
- `GET /api/providers/:id/contributions`

### Reports / Corrections

- `POST /api/providers/:id/reports`
- Optional admin endpoints for moderation if implemented

## 10. Suggested Development Order

1. Initialize repository/project structure.
2. Define environment/config conventions.
3. Draft PostgreSQL schema.
4. Prepare sample/seed providers and contributions.
5. Build Home/Discovery shell.
6. Integrate map.
7. Implement search and result cards.
8. Implement Service Profile.
9. Implement contribution form.
10. Persist contributions.
11. Aggregate metrics.
12. Implement SerbisYO Score and confidence.
13. Add filters and moderation only if core flow is stable.
14. Responsive refinement.
15. QA fixes and presentation polish.

## 11. AI-Assisted Development Rules

AI may be used to accelerate implementation, but developers must retain full ownership.

- Understand code before accepting it.
- Review generated code manually.
- Test every generated feature.
- Keep generated code consistent with the project's architecture.
- Do not allow an AI tool to silently change product scope.
- Developers must be able to explain core logic during Q&A.
- Commit work regularly if Git is initialized.
- Avoid copying large generated solutions that the team cannot maintain.

Project rule:

> **AI can assist implementation, but the team owns the architecture, logic, decisions, and final code.**

