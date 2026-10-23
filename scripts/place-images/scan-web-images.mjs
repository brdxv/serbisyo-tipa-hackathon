import * as cheerio from 'cheerio';

const args = process.argv.slice(2);

function argValue(name, fallback = null) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? fallback : fallback;
}

const url = argValue('--url');
const engine = argValue('--engine', 'cheerio');
const limit = Number(argValue('--limit', '20'));

if (!url) {
  console.error('Usage: npm run images:web:scan -- --url <official-or-public-page-url> [--engine cheerio|playwright|puppeteer] [--limit 20]');
  process.exit(1);
}

function absolute(base, value) {
  if (!value || value.startsWith('data:') || value.startsWith('blob:')) return null;
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
}

function parseSrcset(value, base) {
  if (!value) return [];
  return value.split(',').map((entry) => {
    const [src, descriptor = ''] = entry.trim().split(/\s+/);
    const candidateUrl = absolute(base, src);
    const widthMatch = descriptor.match(/^(\d+)w$/);
    return candidateUrl ? { url: candidateUrl, widthHint: widthMatch ? Number(widthMatch[1]) : 0 } : null;
  }).filter(Boolean);
}

function extractCandidates(html, baseUrl) {
  const $ = cheerio.load(html);
  const candidates = new Map();

  function add(candidateUrl, meta = {}) {
    const resolved = absolute(baseUrl, candidateUrl);
    if (!resolved) return;
    const lower = `${resolved} ${meta.alt ?? ''}`.toLowerCase();
    if (/logo|seal|icon|sprite|avatar|emoji|favicon/.test(lower)) return;
    const current = candidates.get(resolved) ?? { url: resolved, score: 0 };
    candidates.set(resolved, {
      ...current,
      ...meta,
      score: Math.max(current.score ?? 0, meta.score ?? 0),
    });
  }

  $('meta[property="og:image"], meta[property="og:image:secure_url"]').each((_, element) => {
    add($(element).attr('content'), { source: 'og:image', score: 10000 });
  });
  $('meta[name="twitter:image"], meta[property="twitter:image"]').each((_, element) => {
    add($(element).attr('content'), { source: 'twitter:image', score: 9000 });
  });
  $('link[rel="image_src"]').each((_, element) => {
    add($(element).attr('href'), { source: 'image_src', score: 8500 });
  });

  $('img').each((_, element) => {
    const image = $(element);
    const width = Number(image.attr('width')) || 0;
    const height = Number(image.attr('height')) || 0;
    const alt = image.attr('alt') ?? '';
    const baseScore = Math.min(8000, width * height / 500);
    for (const attr of ['src', 'data-src', 'data-lazy-src', 'data-original']) {
      add(image.attr(attr), { source: `img:${attr}`, widthHint: width, heightHint: height, alt, score: baseScore });
    }
    for (const candidate of parseSrcset(image.attr('srcset') || image.attr('data-srcset'), baseUrl)) {
      add(candidate.url, { source: 'img:srcset', widthHint: candidate.widthHint, alt, score: candidate.widthHint * 5 });
    }
  });

  $('source[srcset]').each((_, element) => {
    for (const candidate of parseSrcset($(element).attr('srcset'), baseUrl)) {
      add(candidate.url, { source: 'source:srcset', widthHint: candidate.widthHint, score: candidate.widthHint * 5 });
    }
  });

  return [...candidates.values()]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, Number.isFinite(limit) ? Math.max(1, limit) : 20);
}

async function htmlViaCheerio(targetUrl) {
  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SerbisYOPrototypeImageReview/1.0)',
      'Accept-Language': 'en-PH,en;q=0.9',
    },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${targetUrl}`);
  return { html: await response.text(), finalUrl: response.url };
}

async function htmlViaPlaywright(targetUrl) {
  const { chromium } = await import('playwright');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    const puppeteer = await import('puppeteer');
    const executablePath = await puppeteer.default.executablePath();
    if (!executablePath) throw error;
    browser = await chromium.launch({ headless: true, executablePath });
  }
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 45000 });
    return { html: await page.content(), finalUrl: page.url() };
  } finally {
    await browser.close();
  }
}

async function htmlViaPuppeteer(targetUrl) {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    return { html: await page.content(), finalUrl: page.url() };
  } finally {
    await browser.close();
  }
}

const loaders = {
  cheerio: htmlViaCheerio,
  playwright: htmlViaPlaywright,
  puppeteer: htmlViaPuppeteer,
};

if (!loaders[engine]) {
  console.error(`Unknown engine: ${engine}. Use cheerio, playwright, or puppeteer.`);
  process.exit(1);
}

const { html, finalUrl } = await loaders[engine](url);
const candidates = extractCandidates(html, finalUrl);

console.log(`\nImage candidates from ${finalUrl}`);
console.log(`Engine: ${engine}`);
console.log('Review licensing/source ownership before using any candidate as a local asset.\n');

candidates.forEach((candidate, index) => {
  console.log(`[${index + 1}] ${candidate.url}`);
  console.log(`    source=${candidate.source ?? 'unknown'} widthHint=${candidate.widthHint ?? '?'} heightHint=${candidate.heightHint ?? '?'} alt=${candidate.alt || '(none)'}`);
});

