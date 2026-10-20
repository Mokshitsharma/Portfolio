import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// Self-hosted variable fonts: Archivo with its width axis, Source Serif 4 with optical size.
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/source-serif-4/opsz.css';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production pages arrive prerendered; the dev server sends an empty shell.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
