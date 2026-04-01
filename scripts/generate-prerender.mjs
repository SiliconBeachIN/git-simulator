import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const modulesFile = path.resolve(projectRoot, 'src', 'constants', 'modules.js');
const distDir = path.resolve(projectRoot, 'dist');

async function loadModules() {
  const url = pathToFileURL(modulesFile).href;
  const mod = await import(url);
  return mod.default || [];
}

function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);
}

function replaceMetaName(html, name, content) {
  const re = new RegExp(`<meta\\b[^>]*\\bname="${name}"[^>]*>`, 'i');
  const tag = `<meta name="${name}" content="${escapeAttr(content)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

function replaceMetaProperty(html, property, content) {
  const re = new RegExp(`<meta\\b[^>]*\\bproperty="${property}"[^>]*>`, 'i');
  const tag = `<meta property="${property}" content="${escapeAttr(content)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

function replaceCanonical(html, url) {
  const re = /<link\b[^>]*\brel="canonical"[^>]*>/i;
  const tag = `<link rel="canonical" href="${url}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

function injectAllMeta(html, mod, canonicalUrl) {
  const image = `https://githubsimulator.xyz/social/${mod.id}.png`;
  html = replaceTitle(html, mod.title);
  html = replaceMetaName(html, 'description', mod.description);
  html = replaceMetaName(html, 'keywords', mod.keywords);
  html = replaceCanonical(html, canonicalUrl);
  html = replaceMetaProperty(html, 'og:url', canonicalUrl);
  html = replaceMetaProperty(html, 'og:title', mod.title);
  html = replaceMetaProperty(html, 'og:description', mod.description);
  html = replaceMetaProperty(html, 'og:image', image);
  html = replaceMetaName(html, 'twitter:title', mod.title);
  html = replaceMetaName(html, 'twitter:description', mod.description);
  html = replaceMetaName(html, 'twitter:image', image);
  return html;
}

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error('dist/ not found — run vite build first');
    process.exit(1);
  }

  const MODULES = await loadModules();
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  let count = 0;

  for (const mod of MODULES) {
    if (mod.id === 'home') continue;
    const routeDir = path.join(distDir, mod.id);
    if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });
    const canonicalUrl = `https://githubsimulator.xyz/${mod.id}`;
    const html = injectAllMeta(indexHtml, mod, canonicalUrl);
    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
    count++;
  }

  // Patch root index.html with home meta
  const homeMod = MODULES.find((m) => m.id === 'home');
  if (homeMod) {
    const homeHtml = injectAllMeta(indexHtml, homeMod, 'https://githubsimulator.xyz/');
    fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml, 'utf8');
  }

  console.log(`Prerendered ${count + 1} route files (including home).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
