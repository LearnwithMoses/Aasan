import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker immediately for reliable offline caching and PWA installation
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("[Aasan PWA] New update available, refreshing...");
    updateSW(true);
  },
  onOfflineReady() {
    console.log("[Aasan PWA] Offline cache initialized successfully.");
  },
  onRegisterError(error) {
    console.error("[Aasan PWA] Service worker registration error:", error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
