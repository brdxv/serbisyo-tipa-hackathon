# SerbisYO AI / Coding Agent Instructions

This file defines project rules for AI-assisted development inside the SerbisYO hackathon workspace.

## Read First

Before making meaningful changes, read:

1. `DEVELOPMENT_CONTINUATION_CONTEXT.md`
2. `PROJECT_CONTEXT.md`
3. `BRAND_CONTEXT.md`
4. `ASSET_CONTEXT.md`
5. `MORONG_REAL_PLACES_CONTEXT.md` when working on Explore, map, providers, search, service profiles, or prototype data
6. `PRODUCT_SCOPE.md`
7. `USER_FLOWS_UI.md`
8. `TECHNICAL_PLAN.md`

For visual/UI concept generation or major interface work, also read:

- `DESIGN_BLUEPRINT.md`
- `UI_IMAGE_PROMPTS.md`
- `UI_IMAGE_PROMPTS_MASTER.md`
- `APPROVED_UI_BASELINE.md`

When returning or using an image-generation prompt, include its **Continuity / reference instruction**. If the referenced earlier SerbisYO image exists in the current conversation or project workflow, treat it as the visual source of truth instead of generating a new design language.

For UI image prompts, also include the canonical frame and shell rules from `APPROVED_UI_BASELINE.md`: **1536×1024 desktop**, **941×1672 mobile**, and the **canonical male profile avatar** from the approved mobile screens. Never alternate the profile avatar between pages.

Use the current ordered prompt IDs from `UI_IMAGE_PROMPTS_MASTER.md`. Do not use the old numbering after the October 18 prompt-library reorder. In particular, the approved Explore pair is **P01 Desktop + P02 Mobile**.

For role, QA, research, or presentation work also read:

- `TEAM_WORKPLAN.md`
- `QA_RESEARCH_PITCH.md`

## Product Rules

- Preserve the core concept: **community-powered service intelligence and transparency**.
- Do not reduce SerbisYO to only a review site or queue tracker.
- Prioritize the complete MVP flow over optional features.
- Do not add major product features outside `PRODUCT_SCOPE.md` without explicit user/team-leader direction.
- Treat October 22 at 11:59 PM as the hard submission deadline.
- The primary UI color is still controlled by the team leader; do not invent a final brand color unless explicitly instructed.

## Technical Rules

- System type: responsive web app.
- Languages: TypeScript for the frontend; PHP 8.2+ for the backend.
- Frontend: React + Vite.
- Styling: Tailwind CSS.
- Backend: PHP 8.2+ JSON API.
- Database: PostgreSQL.
- Node.js remains frontend build tooling for Vite only; do not reintroduce Node/Express as the API runtime unless explicitly requested.
- Prefer plain PHP + PDO for the hackathon backend. Composer/framework adoption should be deliberate, not automatic.
- Keep architecture understandable and hackathon-feasible.
- Avoid unnecessary dependencies and infrastructure.
- Prefer reusable typed components and clear API contracts.
- Desktop and mobile behavior are both required.
- Treat the root `assets/` directory as the canonical graphic asset library.
- When an approved icon, marker, vector, or logo asset exists, use it instead of recreating the graphic with emoji, Unicode, raw CSS, or an unrelated icon library.
- Normal UI structure such as cards, buttons, tabs, chips, forms, sheets, and layout must remain HTML/React/CSS rather than raster images.

## AI Assistance Rule

AI may generate implementation ideas or code, but the human developers must remain able to understand, control, modify, test, and explain the result.

Do not silently redesign architecture, scoring logic, data model, or product scope.

## SerbisYO Score

The current scoring weights in `TECHNICAL_PLAN.md` are a prototype model, not a universal standard. If changed, update the documentation and make the reasoning explainable.

## Change Discipline

- Keep changes focused.
- Do not overwrite unrelated work.
- Preserve working functionality when refactoring.
- If a requested change conflicts with MVP scope or the current project direction, surface the conflict clearly before making a large change.
- When implementation begins, test important changes before considering them complete.

## Development UI Commentor

- In Vite development mode, SerbisYO mounts the canonical AGAPAY UI Commentor port from `apps/web/src/components/dev/DevElementCommentor.jsx` with `apps/web/src/styles/dev-commentor.css`.
- Project-persisted comments are stored in `dev-data/ui-commentor-comments.json` through `/api/dev/comments`. The file is intentionally gitignored.
- When the user says they left comments or asks to process Commentor feedback, read that JSON file before editing code, group related issues, validate the affected UI, then resolve/delete comments only after the requested behavior is confirmed.
- Hold `Ctrl+C` for about 1 second to toggle the Commentor when normal copy is not in use; `Ctrl+Shift+C` toggles it immediately. `Esc` closes the active AGAPAY comment composer.
- `Ctrl+D` is reserved in development for a fresh-user reset. It clears SerbisYO same-origin browser/application state and returns to `/login`; it does not and cannot purge the browser's global HTTP disk cache.

