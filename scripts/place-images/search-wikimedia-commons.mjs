import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const inputPath = resolve(root, 'data', 'morong-real-places.json');
const outputPath = resolve(root, 'data', 'wikimedia-image-candidates.json');
const dataset = JSON.parse(await readFile(inputPath, 'utf8'));
const requestedId = process.argv[2] ?? null;

function cleanHtml(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function metadataValue(metadata, key) {
  return cleanHtml(metadata?.[key]?.value ?? '');
}

function scoreCandidate(place, page) {
  const title = String(page.title ?? '').toLowerCase();
  const placeWords = place.name.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2);
  const wordScore = placeWords.filter((word) => title.includes(word)).length * 50;
  const locationBonus = /morong|rizal/.test(title) ? 120 : 0;
  const imageInfo = page.imageinfo?.[0] ?? {};
  const resolutionScore = Math.min(120, ((imageInfo.width ?? 0) * (imageInfo.height ?? 0)) / 250000);
  return wordScore + locationBonus + resolutionScore;
}

async function searchCommons(place) {
  const query = `${place.name} Morong Rizal`;
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiextmetadatafilter: 'Artist|Credit|LicenseShortName|LicenseUrl|UsageTerms|ImageDescription|AttributionRequired',
  });

  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
    headers: {
      'User-Agent': 'SerbisYOPrototypeImageCollector/1.0 (hackathon prototype; Wikimedia Commons discovery)',
      'Accept-Language': 'en-PH,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Wikimedia Commons returned ${response.status}`);
  }

  const body = await response.json();
  const pages = Object.values(body.query?.pages ?? {});
  return pages
    .map((page) => {
      const info = page.imageinfo?.[0] ?? {};
      const ext = info.extmetadata ?? {};
      return {
        title: page.title,
        score: scoreCandidate(place, page),
        originalUrl: info.url ?? null,
        descriptionUrl: info.descriptionurl ?? null,
        width: info.width ?? null,
        height: info.height ?? null,
        mime: info.mime ?? null,
        author: metadataValue(ext, 'Artist'),
        credit: metadataValue(ext, 'Credit'),
        license: metadataValue(ext, 'LicenseShortName') || metadataValue(ext, 'UsageTerms'),
        licenseUrl: metadataValue(ext, 'LicenseUrl'),
        attributionRequired: metadataValue(ext, 'AttributionRequired'),
        description: metadataValue(ext, 'ImageDescription'),
      };
    })
    .filter((candidate) => candidate.originalUrl)
    .sort((a, b) => b.score - a.score);
}

const places = requestedId
  ? dataset.places.filter((place) => place.id === requestedId)
  : dataset.places;

if (requestedId && places.length === 0) {
  console.error(`Unknown dataset place id: ${requestedId}`);
  process.exit(1);
}

const results = [];

for (const place of places) {
  process.stdout.write(`Searching Wikimedia Commons for ${place.name}... `);
  try {
    const candidates = await searchCommons(place);
    console.log(`${candidates.length} candidate(s)`);
    results.push({
      id: place.id,
      name: place.name,
      searchedAt: new Date().toISOString(),
      candidates: candidates.slice(0, 8),
    });
  } catch (error) {
    console.log('failed');
    results.push({
      id: place.id,
      name: place.name,
      searchedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      candidates: [],
    });
  }
}

const payload = {
  generatedAt: new Date().toISOString(),
  source: 'Wikimedia Commons Action API',
  note: 'Candidates require visual verification. License/attribution metadata must be retained when reused.',
  places: results,
};

if (requestedId) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(payload, null, 2) + '\n');
  console.log(`\nSaved Wikimedia candidate metadata to ${outputPath}`);
}

