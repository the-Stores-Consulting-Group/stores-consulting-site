import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist/client');
const ORIGIN = 'https://storesconsulting.com';
const manifest = JSON.parse(await readFile(join(ROOT, 'src/data/route-manifest.json'), 'utf8'));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.name === 'index.html') files.push(path);
  }
  return files;
}

function publicRoute(file) {
  const route = relative(DIST, file).split(sep).join('/');
  return route === 'index.html' ? '/' : `/${route.slice(0, -'index.html'.length)}`;
}

const pageFiles = await walk(DIST);
const pages = new Map(pageFiles.map((file) => [publicRoute(file), file]));
const graph = new Map();

for (const [route, file] of pages) {
  const $ = cheerio.load(await readFile(file, 'utf8'));
  const targets = new Set();
  for (const element of $('a[href]').toArray()) {
    const href = $(element).attr('href');
    if (!href || /^(#|mailto:|tel:|javascript:)/.test(href)) continue;
    const url = new URL(href, `${ORIGIN}${route}`);
    if (url.origin !== ORIGIN) continue;
    const pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    if (pages.has(pathname)) targets.add(pathname);
  }
  graph.set(route, targets);
}

const reachable = new Set(['/']);
const queue = ['/'];
while (queue.length) {
  const route = queue.shift();
  for (const target of graph.get(route) ?? []) {
    if (reachable.has(target)) continue;
    reachable.add(target);
    queue.push(target);
  }
}

const required = new Set([
  '/', '/about/', '/approach/', '/results/', '/clients/', '/contact-us/', '/services/', '/insights/',
  '/services/shrink-profit-recovery/', '/services/fresh-inventory-operations/',
  '/services/workforce-store-execution/', '/services/technology-adoption-change-management/',
]);

for (const entry of manifest) {
  if (entry.status !== 200 || !entry.targetPath?.endsWith('/')) continue;
  if (entry.type === 'post' || entry.type === 'project') required.add(entry.targetPath);
}

for (const [route, file] of pages) {
  if (!route.startsWith('/author/') && !route.startsWith('/category/')) continue;
  const $ = cheerio.load(await readFile(file, 'utf8'));
  if ($('.blog-list article').length > 0) required.add(route);
}

const failures = [];
for (const route of required) {
  if (!pages.has(route)) failures.push(`${route}: missing generated HTML`);
  else if (!reachable.has(route)) failures.push(`${route}: not reachable from the homepage link graph`);
}

const legacyPageRoutes = new Set(manifest.filter((entry) => entry.type === 'page').map((entry) => entry.targetPath));
const promotedLegacyRoutes = [];
const approvedGlobalPages = new Set(['/', '/about/', '/clients/', '/contact-us/', '/services/', '/insights/']);
const home = cheerio.load(await readFile(pages.get('/'), 'utf8'));
for (const element of home('.site-header a[href], .site-footer a[href]').toArray()) {
  const href = home(element).attr('href');
  if (!href) continue;
  const route = new URL(href, ORIGIN).pathname;
  if (legacyPageRoutes.has(route) && !approvedGlobalPages.has(route)) promotedLegacyRoutes.push(route);
}
if (promotedLegacyRoutes.length) failures.push(`global navigation promotes legacy pages: ${[...new Set(promotedLegacyRoutes)].join(', ')}`);

if (failures.length) {
  console.error(`Navigation reachability failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const intentional = [...pages.keys()].filter((route) => !reachable.has(route));
  console.log(`Validated ${required.size} required destinations; ${intentional.length} documented system, empty-archive, or legacy routes remain intentionally unlinked.`);
}
