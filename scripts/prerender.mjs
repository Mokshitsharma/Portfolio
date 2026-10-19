// Writes a fully rendered HTML file for every public route, a 404 page and sitemap.xml.
// Runs after `vite build` (client) and `vite build --ssr` (server entry). See the "build" script.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverDir = path.join(root, 'dist-server');
const SITE = 'https://mokshitsharma27.vercel.app';

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const entry = fs.readdirSync(serverDir).find((f) => f.startsWith('entry-server') && f.endsWith('.js'));
const { render, routes } = await import(pathToFileURL(path.join(serverDir, entry)).href);

const headPattern = /<!--head:start-->[\s\S]*?<!--head:end-->/;
if (!headPattern.test(template) || !template.includes('<!--app-html-->')) {
  throw new Error('index.html is missing the head or app placeholders');
}

function page(url) {
  const { html, head } = render(url);
  return template.replace(headPattern, head).replace('<!--app-html-->', html);
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

// Each route is written twice: /about/index.html and /about.html. Static hosts differ in which one
// they serve for "/about" (Vercel with cleanUrls uses the .html file; others use the folder index).
for (const url of routes) {
  const html = page(url);
  if (url === '/') {
    write(path.join(dist, 'index.html'), html);
  } else {
    write(path.join(dist, url.slice(1), 'index.html'), html);
    write(path.join(dist, `${url.slice(1)}.html`), html);
  }
}
write(path.join(dist, '404.html'), page('/404'));

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc><lastmod>${today}</lastmod></url>`),
  '</urlset>',
  '',
].join('\n');
write(path.join(dist, 'sitemap.xml'), sitemap);

fs.rmSync(serverDir, { recursive: true, force: true });
console.log(`Prerendered ${routes.length} routes plus 404.html and sitemap.xml`);
