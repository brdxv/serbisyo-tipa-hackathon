# SerbisYO Source Structure

This structure is optimized for the hackathon sprint: it keeps the frontend and backend independent enough for parallel work, but avoids microservices, excessive packages, and abstractions the team cannot explain.

## Recommended Repository Layout

```text
serbisyo-tipa-hackathon/
├─ apps/
│  ├─ web/                         # React + Vite + Tailwind
│  │  ├─ public/
│  │  └─ src/
│  │     ├─ app/                   # route composition and app-level setup
│  │     ├─ components/
│  │     │  ├─ layout/             # reusable shells/navigation
│  │     │  └─ ui/                 # generic buttons, chips, cards, etc.
│  │     ├─ features/              # feature-first UI/domain code
│  │     │  ├─ explore/
│  │     │  ├─ providers/
│  │     │  ├─ contributions/
│  │     │  ├─ saved/
│  │     │  ├─ profile/
│  │     │  ├─ auth/
│  │     │  ├─ moderation/
│  │     │  └─ provider-dashboard/
│  │     ├─ lib/                   # API client and small utilities
│  │     ├─ pages/                 # route-level screen composition
│  │     ├─ styles/
│  │     └─ types/
│  └─ api/                         # Node + Express API
│     └─ src/
│        ├─ config/                # environment/configuration
│        ├─ db/                    # database pool/helpers
│        ├─ middleware/            # common Express middleware
│        ├─ modules/               # feature/domain API modules
│        │  ├─ providers/
│        │  ├─ search/
│        │  ├─ contributions/
│        │  ├─ reports/
│        │  ├─ moderation/
│        │  └─ auth/
│        ├─ routes/                # top-level route registration
│        └─ utils/
├─ database/
│  ├─ schema.sql                   # PostgreSQL source of truth
│  └─ seed.sql                     # demo data starting point
├─ docs/                           # optional future grouping for docs
├─ *.md                            # current canonical project documents
├─ package.json                    # npm workspaces / shared commands
└─ tsconfig.base.json
```

## Why This Fits SerbisYO

- **Feature-first frontend:** Explore, Service Profile, Contribute, Saved, Moderation, and Provider views remain easy to own by different developers.
- **Module-first backend:** API routes, validation, business logic, and queries for one feature stay near each other.
- **No premature shared package:** the sprint avoids build complexity from a third workspace package. API response types can be promoted into a shared package after the MVP stabilizes.
- **SQL stays explicit:** PostgreSQL schema and seed data remain easy to inspect and explain during judging.
- **UI reference stays separate from code:** the existing approved UI/UX Markdown files remain the visual source of truth while implementation code stays under `apps/web`.

## Frontend Rule

Route-level files in `pages/` should stay thin. Reusable behavior belongs in `features/`, while generic presentational primitives belong in `components/ui/`.

Example:

```text
pages/ExplorePage.tsx
  -> features/explore/components/ServiceResults.tsx
  -> features/explore/components/ServiceMap.tsx
  -> components/ui/FilterChip.tsx
  -> lib/api.ts
```

Do not create a giant `components/` folder containing every product feature.

## Backend Rule

Each backend module should eventually follow this small pattern only when needed:

```text
modules/providers/
├─ providers.routes.ts
├─ providers.controller.ts
├─ providers.service.ts
├─ providers.repository.ts
└─ providers.schemas.ts
```

For very small modules, combine files instead of creating empty layers. Hackathon speed is more important than ceremonial architecture.

## API Boundary

The frontend should never query PostgreSQL directly. All data goes through `/api/*`.

Core MVP endpoints remain aligned with `TECHNICAL_PLAN.md`:

- `GET /api/providers`
- `GET /api/providers/:id`
- `GET /api/providers/:id/services`
- `GET /api/providers/:id/insights`
- `GET /api/search`
- `POST /api/providers/:id/contributions`
- `GET /api/providers/:id/contributions`
- `POST /api/providers/:id/reports`

## Development Priority

Implement in this order:

1. Explore shell + seeded provider list
2. Map integration + marker/card synchronization
3. Service Profile
4. Contribution workflow
5. PostgreSQL persistence
6. Insight aggregation / SerbisYO Score
7. Search + filters
8. Report/moderation path
9. Responsive polish
10. Optional Saved/Auth/Comparison only if core flow is stable

The provider dashboard remains future-scope and should not block the MVP.
