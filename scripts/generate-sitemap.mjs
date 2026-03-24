import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const modulesFile = path.resolve(projectRoot, 'src', 'constants', 'modules.js');

async function loadModules() {
  const url = pathToFileURL(modulesFile).href;
  const mod = await import(url);
  return mod.default || [];
}

function buildSitemap(urls) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  urls.forEach(u => {
    lines.push('  <url>');
    lines.push(`    <loc>${u}</loc>`);
    lines.push('  </url>');
  });
  lines.push('</urlset>');
  return lines.join('\n') + '\n';
}

async function main() {
  const MODULES = await loadModules();
  const base = process.env.SITE_BASE || 'https://gitsimulator.xyz';
  const urls = MODULES.map(m => (m.id === 'home' ? `${base}/` : `${base}/${m.id}`));
  const xml = buildSitemap(urls);
  const outPath = path.resolve(projectRoot, 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('Wrote', outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
