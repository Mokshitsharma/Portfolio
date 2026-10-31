// True in the static build (`npm run build:static`, used for the S3 copy): no server functions exist, so the
// contact form uses the visitor's mail app and the assistant answers from the site's own records in the browser.
export const STATIC_SITE = import.meta.env.VITE_STATIC === '1';
