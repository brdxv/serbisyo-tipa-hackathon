import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(root, 'assets');
const publicRoot = join(root, 'apps', 'web', 'public', 'assets');

await mkdir(publicRoot, { recursive: true });

for (const group of ['avatars', 'backdrops', 'establishments', 'icons', 'pinpoints', 'vectors']) {
  try {
  await cp(join(sourceRoot, group), join(publicRoot, group), {
    recursive: true,
    force: true,
  });
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

const manifest = await readFile(join(sourceRoot, 'asset-manifest.json'));
await writeFile(join(publicRoot, 'asset-manifest.json'), manifest);

console.log('SerbisYO runtime assets synchronized to apps/web/public/assets.');
