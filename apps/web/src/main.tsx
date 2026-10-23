import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { App } from './app/App';
import { DevFreshReset } from './components/dev/DevFreshReset';
// Canonical development UI Commentor ported from AGAPAY.
import DevElementCommentor from './components/dev/DevElementCommentor.jsx';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import './map/maplibreSetup';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles/index.css';

function DevelopmentTools() {
  const location = useLocation();

  if (!import.meta.env.DEV) return null;

  return (
    <>
      <DevFreshReset />
      {location.pathname !== '/image-review' ? <DevElementCommentor /> : null}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <DevelopmentTools />
    </BrowserRouter>
  </StrictMode>,
);
