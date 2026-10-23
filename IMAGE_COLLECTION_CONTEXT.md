# SerbisYO Place Image Collection Context

Updated: **2026-10-22**

This document defines the approved **zero-paid-API** image-discovery workflow for the 15-place real Morong prototype dataset.

## Source priority

1. **Wikimedia Commons API** — primary automated source for reusable real-place images when a matching file exists.
2. **Official/public webpages + Cheerio** — inspect static pages for original/high-resolution images.
3. **Playwright + Cheerio** — use when the official/public page is JavaScript-rendered.
4. **Puppeteer + Cheerio** — second browser-automation fallback when Playwright is unsuitable.
5. **Generated representative imagery** — last resort when no suitable reusable real image exists. Never present a generated building as if it were a verified photograph of the real establishment.

Google Places API (New) is **not part of the SerbisYO prototype pipeline** because the project is intentionally avoiding paid/billing-dependent APIs for this hackathon build.

## Installed packages

```text
playwright
puppeteer
cheerio
```

No API key is required for the Wikimedia Commons or webpage-scanning workflow.

Playwright and Puppeteer share Puppeteer's installed Chrome binary when Playwright's own browser download is unavailable. This avoids keeping two separate Chromium installations solely for the fallback crawler.

## Wikimedia Commons command

Search all 15 real Morong places and save ranked candidate metadata:

```text
npm run images:commons:search
```

Output:

```text
data/wikimedia-image-candidates.json
```

Search/preview candidates for only one dataset place:

```text
npm run images:commons:search -- morong-municipal-hall
```

The candidate metadata includes, when available:

- original image URL
- Commons description page
- width and height
- MIME type
- author/artist
- credit
- license name
- license URL
- attribution requirement
- image description

Every candidate still requires **visual identity verification** before becoming a SerbisYO establishment asset.

## Official/public webpage scanning

Static page:

```text
npm run images:web:scan -- --url "https://example.com/page"
```

JavaScript-rendered page using Playwright:

```text
npm run images:web:scan -- --url "https://example.com/page" --engine playwright
```

Alternative Chromium engine using Puppeteer:

```text
npm run images:web:scan -- --url "https://example.com/page" --engine puppeteer
```

The scanner ranks likely high-resolution candidates from:

- Open Graph images
- Twitter image metadata
- `image_src`
- normal `<img src>`
- lazy-load attributes
- `srcset`
- `<picture>/<source>` resources
- supplied width/height hints

It suppresses obvious logos, seals, icons, avatars, sprites, favicons, and emoji assets.

## Image approval rule

The crawler is a **candidate discovery tool**, not a blind downloader. Before copying an image into `assets/establishments/`, verify:

- the image actually depicts the intended Morong establishment
- the source and license/usage terms permit the intended prototype use
- any required attribution is preserved
- it is not merely a logo, seal, unrelated stock image, or another branch/location
- it is the best available resolution without artificial upscaling

For Wikimedia Commons, retain the license and attribution metadata beside the asset inventory.

## Local review page

Use the dedicated development-only review workspace:

```text
http://localhost:5173/image-review
```

The page merges the 15 real Morong establishments with all currently discovered candidates and provides:

- approve / reject decisions
- `Make main image` selection
- persistent local review state
- fullscreen image inspection
- zoom in / zoom out
- previous / next image navigation
- source, author, credit, dimensions, MIME type, license, and attribution details
- filters for pending, needs-more, and ready establishments
- `Find another` to run another Commons search for an establishment
- end-of-review readiness summary
- final approved-image export into the canonical asset tree

`Continue & download approved images` stays disabled until every currently displayed candidate has been reviewed. If an establishment still has fewer than three approved images or no selected main image after the review round, the page offers `Find another`; the reviewer may also continue with the incomplete approved set and receive warnings.

The final export writes directly to:

```text
assets/establishments/<place-id>/
```

and generates:

```text
assets/establishments/image-sources.json
```

No unzip step is required for the local project workflow.

## Target local image library

Continue using the established 3-image structure per place:

```text
assets/establishments/<place-id>/
  <place-id>-01-main.jpg
  <place-id>-02-place.jpg
  <place-id>-03-service.jpg
```

The first image is the canonical identity image reused by Explore cards, map previews, search results, Saved, comparison, and the Service Profile hero. The second and third images extend the profile gallery.

## OpenStreetMap role

OpenStreetMap/Overpass may be used for **place identity, map features, and location data**, not as the primary establishment-photo source. Overpass is specifically a read-only query API over OpenStreetMap data. Public OSM services have usage policies and should be used responsibly rather than treated as unlimited infrastructure.

