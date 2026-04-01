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

function buildSitemap(modules) {
  const base = process.env.SITE_BASE || 'https://gitsimulator.xyz';
  const today = new Date().toISOString().split('T')[0];
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const m of modules) {
    const loc = m.id === 'home' ? `${base}/` : `${base}/${m.id}`;
    const priority = m.id === 'home' ? '1.0' : m.id === 'quiz' ? '0.8' : '0.9';
    const changefreq = m.id === 'home' ? 'weekly' : 'monthly';
    lines.push('  <url>');
    lines.push(`    <loc>${loc}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push(`    <changefreq>${changefreq}</changefreq>`);
    lines.push(`    <priority>${priority}</priority>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return lines.join('\n') + '\n';
}

async function main() {
  const MODULES = await loadModules();
  const xml = buildSitemap(MODULES);
  const outPath = path.resolve(projectRoot, 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('Wrote', outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
