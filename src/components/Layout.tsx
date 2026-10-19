import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import SiteFooter from './SiteFooter';
import { canonical, metaFor } from '../seo';

// Keeps the document head in step with client-side navigation. The first load already has the right
// head from the prerendered HTML.
function useHead(pathname: string) {
  useEffect(() => {
    const meta = metaFor(pathname);
    document.title = meta.title;
    const set = (selector: string, attr: string, value: string) => document.querySelector(selector)?.setAttribute(attr, value);
    set('meta[name="description"]', 'content', meta.description);
    set('link[rel="canonical"]', 'href', canonical(meta.path));
    set('meta[property="og:title"]', 'content', meta.title);
    set('meta[property="og:description"]', 'content', meta.description);
    set('meta[property="og:url"]', 'content', canonical(meta.path));
    set('meta[name="twitter:title"]', 'content', meta.title);
    set('meta[name="twitter:description"]', 'content', meta.description);
  }, [pathname]);
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  useHead(pathname);

  // On navigation: go to the #section if there is one, otherwise to the top, and move focus to the
  // new page's main region so screen-reader and keyboard users start at the content.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    }
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="ui sr-only z-[60] bg-ink px-4 py-3 text-surface focus:not-sr-only focus:fixed focus:left-4 focus:top-3">
        Skip to content
      </a>
      <Header />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
