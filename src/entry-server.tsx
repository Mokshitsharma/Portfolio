import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { headTags, metaFor, notFoundMeta, publicPages } from './seo';

// Used only at build time by scripts/prerender.mjs.
export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  const meta = url === '/404' ? notFoundMeta : metaFor(url);
  return { html, head: headTags(meta) };
}

export const routes = publicPages.map((p) => p.path);
