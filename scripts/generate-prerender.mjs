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

const SITE_BASE = process.env.SITE_BASE || 'https://gitsimulator.xyz';

function buildBreadcrumbSchema(mod, canonicalUrl) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${SITE_BASE}/`
      }
    ]
  };
  if (mod.id !== 'home') {
    breadcrumb.itemListElement.push({
      "@type": "ListItem",
      "position": 2,
      "name": mod.label,
      "item": canonicalUrl
    });
  }
  return JSON.stringify(breadcrumb);
}

function buildArticleSchema(mod, canonicalUrl) {
  if (mod.id === 'home') return null;
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": mod.title,
    "description": mod.description,
    "url": canonicalUrl,
    "image": `${SITE_BASE}/social/${mod.id}.png`,
    "author": {
      "@type": "Organization",
      "name": "GitSimulator",
      "url": `${SITE_BASE}/`
    },
    "publisher": {
      "@type": "Organization",
      "name": "GitSimulator",
      "url": `${SITE_BASE}/`
    },
    "isAccessibleForFree": true,
    "inLanguage": "en"
  };
  return JSON.stringify(article);
}

function buildStaticBodyContent(mod, allModules) {
  const keywords = (mod.keywords || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)
    .slice(0, 12);

  const navLinks = allModules
    .filter(m => m.id !== 'home')
    .map(m => `<li><a href="/${m.id}">${escapeAttr(m.icon)} ${escapeAttr(m.label)} — ${escapeAttr(m.title.split('|')[0].split('—')[0].trim())}</a></li>`)
    .join('\n            ');

  const topicsList = keywords.length
    ? `<h2>What You&#39;ll Learn</h2>
          <p>In this interactive module you will practice:</p>
          <ul>${keywords.map(k => `<li>${escapeAttr(k)}</li>`).join('')}</ul>`
    : '';

  const moduleCount = allModules.filter(m => m.id !== 'home').length;

  if (mod.id === 'home') {
    return `<div id="ssr-fallback" style="max-width:820px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;color:#e6edf3;background:#060b18">
        <header><h1>GitSimulator — Free Interactive Git &amp; GitHub Course</h1></header>
        <main>
          <p>${escapeAttr(mod.description)}</p>
          <h2>What is Git?</h2>
          <p>Git is a free, open-source distributed version control system created by Linus Torvalds in 2005. It tracks changes in any set of files and coordinates work among multiple developers. Every change is recorded as a commit — a permanent snapshot of your project.</p>
          <h2>What is GitHub?</h2>
          <p>GitHub is a web-based platform built on top of Git. It provides a central place to host Git repositories online with powerful collaboration features: pull requests, issues, code review, GitHub Actions CI/CD pipelines, project boards, and more. Owned by Microsoft since 2018, GitHub hosts over 420 million repositories.</p>
          <h2>${moduleCount} Interactive Learning Modules</h2>
          <p>GitSimulator offers ${moduleCount} structured modules covering everything from git init to GitHub Actions CI/CD, Dependabot security automation, and Git internals. Every module includes story-based introductions, concept diagrams, an interactive terminal, and copy-ready command cards.</p>
          <nav><ul>
            ${navLinks}
          </ul></nav>
          <h2>Who Is This For?</h2>
          <p>Students, bootcamp learners, self-taught developers, and professionals. No sign-up, no installation — everything runs in your browser for free.</p>
        </main>
        <footer style="margin-top:32px;border-top:1px solid #21262d;padding-top:16px">
          <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a> |
          <a href="https://github.com/SiliconBeachIN/git-simulator">GitHub</a> | &copy; 2026 GitSimulator
        </footer>
      </div>`;
  }

  return `<div id="ssr-fallback" style="max-width:820px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;color:#e6edf3;background:#060b18">
        <header><h1>${escapeAttr(mod.title.split('|')[0].trim())}</h1></header>
        <main>
          <p>${escapeAttr(mod.description)}</p>
          ${topicsList}
          <p>GitSimulator provides a hands-on terminal simulator where you can type real commands and see instant output — no installation required.</p>
          <h2>All Learning Modules</h2>
          <nav><ul>
            ${navLinks}
          </ul></nav>
        </main>
        <footer style="margin-top:32px;border-top:1px solid #21262d;padding-top:16px">
          <a href="/">Home</a> | <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a> |
          <a href="https://github.com/SiliconBeachIN/git-simulator">GitHub</a> | &copy; 2026 GitSimulator
        </footer>
      </div>`;
}

function injectStaticContent(html, mod, allModules) {
  const content = buildStaticBodyContent(mod, allModules);
  const rootElementPattern = /<div\b([^>]*\bid=(['"])root\2[^>]*)>([\s\S]*?)<\/div>/i;

  if (!rootElementPattern.test(html)) {
    throw new Error('Failed to inject static content: could not find <div id="root"> in dist/index.html');
  }

  return html.replace(rootElementPattern, `<div$1>${content}</div>`);
}

function injectAllMeta(html, mod, canonicalUrl, allModules) {
  const image = `${SITE_BASE}/social/${mod.id}.png`;
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

  // Inject per-page structured data
  const breadcrumbTag = `<script type="application/ld+json">${buildBreadcrumbSchema(mod, canonicalUrl)}</script>`;
  const articleSchema = buildArticleSchema(mod, canonicalUrl);
  const articleTag = articleSchema ? `\n    <script type="application/ld+json">${articleSchema}</script>` : '';
  html = html.replace('</head>', `    ${breadcrumbTag}${articleTag}\n  </head>`);

  // Inject static body content for crawlers
  html = injectStaticContent(html, mod, allModules);

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
    const canonicalUrl = `${SITE_BASE}/${mod.id}`;
    const html = injectAllMeta(indexHtml, mod, canonicalUrl, MODULES);
    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
    count++;
  }

  // Patch root index.html with home meta
  const homeMod = MODULES.find((m) => m.id === 'home');
  if (homeMod) {
    const homeHtml = injectAllMeta(indexHtml, homeMod, `${SITE_BASE}/`, MODULES);
    fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml, 'utf8');
  }

  console.log(`Prerendered ${count + 1} route files (including home).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
