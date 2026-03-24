#!/usr/bin/env node
import { launch } from 'chrome-launcher';
import puppeteer from 'puppeteer-core';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import http from 'http';
import MODULES from '../src/constants/modules.js';

const DIST = path.resolve(process.cwd(), 'dist');
const PORT = process.env.PRERENDER_PORT || 5173;

async function findChrome() {
  const chrome = await launch({ chromeFlags: ['--headless','--disable-gpu','--no-sandbox'] });
  return chrome;
}

function createStaticServer(root, port) {
  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath === '/') urlPath = '/index.html';
    const filePath = path.join(root, decodeURIComponent(urlPath));
    fs.readFile(filePath).then((data) => {
      const ext = path.extname(filePath).toLowerCase();
      const map = {
        '.html': 'text/html; charset=utf-8',
        '.xml': 'application/xml',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain',
      };
      res.writeHead(200, { 'Content-Type': map[ext] || 'application/octet-stream' });
      res.end(data);
    }).catch(() => {
      // fallback to index.html for SPA routes
      fs.readFile(path.join(root, 'index.html')).then((data) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }).catch(() => {
        res.writeHead(404);
        res.end('Not found');
      });
    });
  });
  return new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) reject(err); else resolve(server);
    });
  });
}

async function prerender() {
  console.log('Starting prerender...');
  if (!fsSync.existsSync(DIST)) {
    console.error('dist/ not found — run `npm run build` first');
    process.exit(1);
  }

  const server = await createStaticServer(DIST, PORT);
  console.log('Static server listening on', PORT);

  const chrome = await findChrome();
  const browser = await puppeteer.connect({ browserURL: `http://localhost:${chrome.port}` }).catch(async () => {
    const browserWSEndpoint = chrome.webSocketDebuggerUrl;
    return puppeteer.connect({ browserWSEndpoint });
  });

  const page = await browser.newPage();

  async function renderRoute(id, urlPath) {
    const url = `http://localhost:${PORT}${urlPath}`;
    console.log('Rendering', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    // wait for Helmet to update head (title/canonical). Retry up to 3s.
    try {
      await page.waitForFunction((expectedPath) => {
        const link = document.querySelector('link[rel="canonical"]');
        if (!link) return false;
        return link.href.includes(expectedPath);
      }, { timeout: 3000 }, id === 'home' ? '/' : `/${id}`);
    } catch (e) {
      // fallback short delay if canonical update didn't appear
      await page.waitForTimeout(800);
    }
    let html = await page.content();
    // Ensure prerendered head has correct SEO meta (use MODULES metadata as source of truth)
    try {
      const meta = MODULES.find((m) => m.id === id) || {};
      const title = meta.title || (meta.label ? `${meta.label} — GitSimulator` : 'GitSimulator — Master GitHub');
      const description = meta.description || 'Interactive Git and GitHub learning with live terminal, commit graphs, and quizzes.';
      const canonical = meta.canonical || (id === 'home' ? 'https://gitsimulator.xyz/' : `https://gitsimulator.xyz/${id}`);

      html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      if (/meta name="description"/i.test(html)) {
        html = html.replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`);
      } else {
        html = html.replace(/<head>/i, `<head>\n    <meta name="description" content="${description}" />`);
      }
      if (/link rel="canonical"/i.test(html)) {
        html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
      } else {
        html = html.replace(/<head>/i, `<head>\n    <link rel="canonical" href="${canonical}" />`);
      }
      // Open Graph
      if (/meta property="og:title"/i.test(html)) {
        html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
      }
      if (/meta property="og:description"/i.test(html)) {
        html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
      }
    } catch (e) {
      // ignore, fallback to captured HTML
    }

    const outDir = id === 'home' ? DIST : path.join(DIST, id);
    await fs.mkdir(outDir, { recursive: true });
    const outPath = id === 'home' ? path.join(DIST, 'index.html') : path.join(outDir, 'index.html');
    await fs.writeFile(outPath, html, 'utf8');
    console.log('Wrote', outPath);
  }

  // render home
  await renderRoute('home', '/');
  for (const m of MODULES) {
    if (m.id === 'home') continue;
    await renderRoute(m.id, `/${m.id}`);
  }

  await browser.close();
  try { await chrome.kill(); } catch (e) {}
  server.close();
  console.log('Prerender complete');
}

prerender().catch((err) => { console.error(err); process.exit(1); });
        
