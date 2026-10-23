# SerbisYO Asset Context and Usage Contract

This file defines the canonical asset library and how code should use it.

## 1. Canonical Asset Root

All approved reusable visual assets are stored under:

```text
C:\Users\Admin\Documents\Documents\4 - E\External Projects\HACKATHON\serbisyo\assets
```

Repository-relative path:

```text
assets/
```

Treat `assets/` as the **master/source-of-truth library**.

Machine-readable lookup:

```text
assets/asset-manifest.json
```

The manifest maps semantic IDs such as `search`, `government-service`, `selected-government-marker`, and `no-results-map-illustration` to the exact current repository paths. Future DevSpace work should prefer this lookup instead of guessing filenames.

## 2. Asset Groups

```text
assets/
├─ avatars/
├─ backdrops/
├─ branding/
├─ establishments/
├─ icons/
├─ pinpoints/
├─ vectors/
└─ media files/
```

### `branding/`

- `Color Pallete.png`
- `Typography.png`

These are visual references. Their written implementation rules are in `BRAND_CONTEXT.md`.

### `backdrops/`

Login/environment layers intended to remain separate for responsive composition:

- `login-page-main-backdrop.png` — scenery/photo layer
- `3d-map-overlay.png` — transparent 3D map layer

Do not flatten these two assets into one static login background. Compose them independently in the frontend so their scale and position can respond to viewport dimensions.

### `establishments/`

Approved real-place images exported from the `/image-review` workflow are written here after explicit review:

```text
assets/establishments/<place-id>/
  <place-id>-01-main.jpg
  <place-id>-02-place.jpg
  <place-id>-03-service.jpg
  ...optional additional approved images

assets/establishments/image-sources.json
```

`image-sources.json` preserves source URL, author/credit, license, and attribution metadata for downloaded approved images. Do not manually copy unreviewed crawler candidates into this folder.

#### Drive-import status — 2026-10-23

The shared Drive collection at `SerbisYO Project Resources/03 - Media Assets/photos/establishments/` has been pulled into the canonical local asset tree and synced to `apps/web/public/assets/establishments/`.

- Imported: **41 JPEG images** across all 15 establishment folders after the third Drive sync on 2026-10-23.
- Complete 3-image sets: `morong-municipal-hall`, `lto-morong-district-office`, `morong-fire-station`, `registry-of-deeds-morong`, `savemore-market-morong`, `rizal-provincial-hospital-system-morong`, `supreme-care-medical-diagnostic`, `morong-national-high-school`, `urs-morong-campus`, `mercury-drug-morong-t-claudio`, `commandancia-museong-pambayan`, `east-systems-colleges-of-rizal`.
- Partial sets: `morong-public-market` (2 images; `01-main` still missing), `morong-rural-health-unit` (2 images; `02-place` still missing), and `morong-doctors-hospital` (1 image; `02-place` / `03-service` still missing).
- No establishment folder in the shared Drive collection is empty after this sync.
- `.jfif` / `.JPG` Drive uploads were normalized to lowercase `.jpg` filenames locally while preserving the `01-main`, `02-place`, and `03-service` roles.
- The Mercury Drug `01-main` Drive upload was PNG and was converted to the canonical local JPEG role during import. Unstructured one-off filenames in the newly populated folders were assigned to the missing canonical role before runtime registration.

### `avatars/`

The second Drive asset pass added three fictional community avatar placeholders used for community-report stacks and temporary profile presentation:

- `community-avatar-placeholder-1.png`
- `community-avatar-placeholder-2.png`
- `community-avatar-placeholder-3.png`

### `pinpoints/`

Canonical map/state assets:

- `active-open-location-marker.png`
- `bookmark-marker.png`
- `closed-unavailable-marker.png`
- `cluster-marker.png`
- `current-location-dot.png`
- `default-government-marker.png`
- `default-location-marker.png`
- `selected-bookmark-marker.png`
- `selected-government-marker.png`
- `verified-high-confidence-marker.png`
- `clinic-marker-default.png`
- `clinic-marker-selected.png`
- `food-marker-default.png`
- `food-marker-selected.png`
- `education-marker-default.png`
- `education-marker-selected.png`
- `commerce-marker-default.png`
- `commerce-marker-selected.png`
- `utilities-marker-default.png`
- `utilities-marker-selected.png`
- `transportation-marker-default.png`
- `transportation-marker-selected.png`
- `neutral-place-marker.png`
- `neutral-place-marker-muted.png`

These names are semantic. Select the file by the intended state rather than approximating the marker with CSS.

### `vectors/`

Canonical standalone illustrations/motifs:

- `bush-cluster-large.png`
- `bush-cluster-small.png`
- `closed-map-pin.png`
- `cloud-large.png`
- `cloud-medium.png`
- `current-location-map-tile.png`
- `default-map-pin.png`
- `landscape-hills.png`
- `map-unavailable-illustration.png`
- `no-results-map-illustration.png`
- `pinned-location-map-tile.png`
- `route-path-motif.png`
- `sparkle-motifs.png`
- `tree-large.png`
- `tree-small.png`

Use these for their intended empty/map/error/decorative states rather than redrawing similar artwork in CSS.

### `icons/`

The icon collection contains the original 54 cropped PNG icons plus the Explore-specific generated additions from Drive `pinpoints-pt2`. Existing examples include:

- `01_search.png`
- `02_location_pin.png`
- `03_bookmark_outline.png`
- `04_bookmark_filled.png`
- `05_close_x.png`
- `06_chevron_right.png`
- `07_grid_view.png`
- `08_map_folded.png`
- `10_filters_sliders.png`
- `13_notification_bell.png`
- `14_check_circle.png`
- `15_information.png`
- `16_warning_triangle.png`
- `17_error.png`
- `18_community.png`
- `19_star.png`
- `20_shield_check.png`
- `21_Time.png`
- `22_calendar.png`
- `24_government_bank.png`
- `28_healthcare_.png`
- `29_goverment service_.png`
- `30_graduation_cap.png`
- `31_bus.png`
- `42_wheelchair_accessible.png`
- `52_phone.png`
- `53_mail.png`
- `54_cost_coins.png`
- `food-category.png`
- `bank-category.png`
- `shortest-wait.png`
- `highest-reliability.png`
- `accessible-category.png`
- `layers-map.png`
- `locate-crosshair.png`

Some icon filenames are not yet clean kebab-case even though the semantic labels were designed for asset naming. **Do not guess-renumber or silently rename them while implementing a feature.** If filenames are normalized later, update this document and runtime references together.

### `media files/`

These are the original grouped/reference sheets:

- `icons.png`
- `pinpoints.png`
- `vectors.png`

Use the individually exported files for implementation. Keep these sheets as reference/source material.

## 3. Runtime Copies

The current React app serves synchronized runtime copies under:

```text
apps/web/public/assets/icons/
apps/web/public/assets/pinpoints/
apps/web/public/assets/vectors/
apps/web/public/assets/backdrops/
apps/web/public/assets/establishments/
apps/web/public/assets/avatars/
```

The root `assets/` library is canonical. `apps/web/public/assets/` exists so Vite can serve those files using URLs such as `/assets/icons/...` and `/assets/pinpoints/...`.

When an asset is added or renamed in `assets/`, run:

```text
npm run sync:assets
```

Then update any affected code paths. Do not edit the public copy as the master asset.

## 4. Critical Implementation Rule

Use actual exported assets for:

- map pins and marker states
- standalone navigation/status icons when the approved matching icon exists
- empty-state illustrations
- map failure illustrations
- route/map motifs
- decorative environment vectors
- brand/logo artwork

Do **not** replace an approved asset with:

- emoji
- Unicode symbols
- improvised CSS shapes
- arbitrary icon libraries
- unrelated stock graphics

when the approved asset already exists.

## 5. What Should Still Be CSS / HTML / React

Do not rasterize normal interface components. Build these normally in React/CSS/Tailwind:

- buttons
- chips
- tabs
- cards
- bottom sheets
- modal shells
- inputs
- toggles
- borders
- shadows
- progress indicators
- text labels
- layout containers
- metric rows
- service cards and their structure

The asset library supplies the **graphic/icon element**, not the entire UI component.

## 6. Asset Selection Examples

If implementing a normal government location marker:

```text
assets/pinpoints/default-government-marker.png
```

If that government service is selected:

```text
assets/pinpoints/selected-government-marker.png
```

If a location is unavailable:

```text
assets/pinpoints/closed-unavailable-marker.png
```

If the map cannot load:

```text
assets/vectors/map-unavailable-illustration.png
```

If a search has no matching services:

```text
assets/vectors/no-results-map-illustration.png
```

If a search field needs a search icon, use the exported search icon rather than a text magnifying-glass character.

## 7. Asset Naming Direction

For any newly exported assets, prefer readable semantic kebab-case:

```text
selected-government-marker.png
notification-bell.png
no-results-map-illustration.png
```

The filename should answer **what the asset is or what state it represents**, not where it happened to appear in a mockup.

## 8. Before Editing UI

Before creating or replacing a visible icon/marker/illustration:

1. Search `assets/` for an approved equivalent.
2. Search `apps/web/public/` for the current runtime copy.
3. Use the approved asset if it exists.
4. Only create a CSS/icon-library substitute when no approved asset exists and the Team Leader has not requested a new graphic asset.

