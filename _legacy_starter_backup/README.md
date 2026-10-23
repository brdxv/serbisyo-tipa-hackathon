# SerbisYO — HTML, CSS, PHP Starter

A responsive front-end prototype inspired by the supplied SerbisYO interface images. It includes a service directory, category filters, search, sorting, save buttons, service-profile modal, and an illustrative map-style panel.

## Requirements
- PHP 8.2+ installed and available in PATH
- Browser

This starter is intentionally plain HTML/CSS/JavaScript with PHP-rendered service cards. It is not the original React/Vite/TypeScript application. It is a separate lightweight prototype based on your request for HTML, CSS, and PHP.

## Run on Windows
1. Install PHP 8.2+ and make sure `php -v` works in Command Prompt.
2. Double-click `RUN_SERBISYO.bat`.
3. Open `http://localhost:8000`.

Or start manually from this folder:
```bash
php -S 127.0.0.1:8000 api/index.php
```
The router serves the homepage and API endpoints.

## API demo routes
- `GET /api/health` — API status
- `GET /api/services` — sample service records

## Folder structure
```text
SerbisYO_HTML_CSS_PHP/
├── index.php
├── RUN_SERBISYO.bat
├── README.md
├── assets/
│   ├── style.css
│   └── app.js
└── api/
    └── index.php
```

## Current demo behavior
- Search services by name/category
- Filter by category and open status
- Sort by distance, waiting time, reliability, and score
- Open a service detail modal
- Toggle saved state (browser session only; not persisted)
- Show demo map pins and community-intelligence busy-hour bars

## Important limitations
- Service information is sample data.
- The map panel is a visual mockup, not a live map or GPS integration.
- PostgreSQL is not connected yet.
- Save and contribution actions are demo interactions only.
- Do not use the sample wait times or scores as real public-service information.

## Next development steps
1. Add PostgreSQL connection settings and schema migrations.
2. Add API modules for service listings, reports, saved services, and user profiles.
3. Implement authentication and authorization.
4. Replace the illustrative map with a map provider and real location data.
5. Add moderation for community contributions and update/report submissions.
