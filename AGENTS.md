# SerbisYO AI / Coding Agent Instructions

This file defines project rules for AI-assisted development inside the SerbisYO hackathon workspace.

## Read First

Before making meaningful changes, read:

1. `PROJECT_CONTEXT.md`
2. `PRODUCT_SCOPE.md`
3. `USER_FLOWS_UI.md`
4. `TECHNICAL_PLAN.md`

For visual/UI concept generation or major interface work, also read:

- `DESIGN_BLUEPRINT.md`
- `UI_IMAGE_PROMPTS.md`

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
- Language: TypeScript.
- Frontend: React + Vite.
- Styling: Tailwind CSS.
- Backend: Node.js + Express.
- Database: PostgreSQL.
- Keep architecture understandable and hackathon-feasible.
- Avoid unnecessary dependencies and infrastructure.
- Prefer reusable typed components and clear API contracts.
- Desktop and mobile behavior are both required.

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

