import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const docs = path.join(repoRoot, 'docs');
const out = path.join(repoRoot, 'android', 'app', 'src', 'main', 'assets', 'wrenchlife', 'index.html');

let html = await fs.readFile(path.join(docs, 'index.html'), 'utf8');
const css = await fs.readFile(path.join(docs, 'css', 'app.css'), 'utf8');
html = html.replace(/<link[^>]*href=["']css\/app\.css["'][^>]*>/i, () => `<style>\n${css}\n</style>`);

const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
for (const src of scripts) {
  const js = await fs.readFile(path.join(docs, src), 'utf8');
  const safe = js.replace(/<\/script/gi, '<\\/script');
  html = html.replace(`<script src="${src}"></script>`, () => `<script>\n/* ${src} */\n${safe}\n</script>`);
}

await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, html, 'utf8');
console.log(`Bundled ${scripts.length} scripts into ${path.relative(repoRoot, out)}`);
