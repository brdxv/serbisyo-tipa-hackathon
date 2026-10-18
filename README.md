# SerbisYO Hackathon Project

SerbisYO is Team 10's finalized T.I.P.A. CS Hackathon 2026 project concept. This folder is the canonical project reference for product direction, system scope, UI/UX, development, research, QA, and presentation preparation.

## Core Idea

SerbisYO is a community-powered, map-based service intelligence and transparency platform. It helps people know **where to go, when to go, what to expect, and which service provider is more reliable** before they commit time, money, and effort to a service.

Instead of relying only on ordinary star ratings, SerbisYO turns community experiences into structured service information such as waiting time, processing time, service reliability, information accuracy, accessibility, service quality, availability, and recent community updates.

## Canonical Project Files

- `PROJECT_CONTEXT.md` - project vision, problem, users, principles, SDG alignment, and terminology.
- `PRODUCT_SCOPE.md` - hackathon MVP, priorities, non-goals, and feature freeze rules.
- `USER_FLOWS_UI.md` - required pages, elements, interactions, responsive behavior, and UI/UX direction.
- `DESIGN_BLUEPRINT.md` - detailed page-by-page visual direction, responsive layouts, interaction patterns, and design priorities.
- `UI_IMAGE_PROMPTS.md` - reusable image-generation prompts for exploring 2-3 visual directions per primary page/state.
- `UI_IMAGE_PROMPTS_MASTER.md` - canonical detailed image-generation prompts for every required page, workflow step, system state, optional screen, and future-scope concept. Core Group 1 includes dedicated desktop and mobile prompts and uses one-screen-per-image generation.
- `APPROVED_UI_BASELINE.md` - approved P01/P02 desktop and mobile visual baseline, pairing rules, and consistency requirements for all later SerbisYO screens.
- `UI_GENERATION_STATUS.md` - live checklist of generated, approved, pending, and not-yet-generated UI concept screens.
- `TECHNICAL_PLAN.md` - tech stack, architecture, data model, scoring logic, and implementation order.
- `TEAM_WORKPLAN.md` - team composition, role responsibilities, collaboration rules, and timeline.
- `QA_RESEARCH_PITCH.md` - research direction, QA plan, pitch deck structure, demo flow, and presentation preparation.
- `AGENTS.md` - instructions for AI-assisted development inside this project.
- `SOURCE_STRUCTURE.md` - implementation-oriented repository structure, boundaries, and development order.

## Development Workspace

The codebase now uses a small npm-workspace structure:

- `apps/web` - React + Vite + Tailwind responsive frontend.
- `apps/api` - Node.js + Express API.
- `database` - explicit PostgreSQL schema and seed data.

Install dependencies from the repository root:

```bash
npm install
```

Run frontend and API together:

```bash
npm run dev
```

### Windows one-click launcher

Developers on Windows can also double-click:

```text
RUN_SERBISYO.bat
```

The launcher will:

1. Verify that Node.js and npm are available.
2. Install/sync the project dependencies.
3. Start the frontend and API in a separate development-server window.
4. Wait for Vite to become available.
5. Open `http://localhost:5173` automatically in the default browser.

Keep the **SerbisYO Development Server** window open while working. Closing that window, or pressing `Ctrl+C` inside it, stops the local servers.

For launcher testing without automatically opening a browser, run:

```bat
RUN_SERBISYO.bat --no-browser
```

Default local addresses:

- Web: `http://localhost:5173`
- API: `http://localhost:4000`
- API health check: `http://localhost:4000/api/health`

Copy `apps/api/.env.example` to `apps/api/.env` when PostgreSQL is ready. The frontend can start before the database integration is complete by using seeded/mock feature data.

## Hackathon Deadline Mindset

Treat **October 22, 2026 at 11:59 PM** as the hard submission deadline even if the event allows activity or presentation work to continue on October 23.

The main rule for the sprint is:

> Build one complete, understandable, responsive, and reliable core experience before adding optional features.

