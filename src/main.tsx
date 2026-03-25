import './polyfills';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App';
import './index.css';
import './lib/i18n';

// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Sync theme
document.documentElement.className = tg.colorScheme;
tg.onEvent('themeChanged', () => {
  document.documentElement.className = tg.colorScheme;
});

// Haptic feedback on init
tg.HapticFeedback.impactOccurred('medium');

const manifestUrl = "https://ais-dev-3j3fakgdgxuy7i62sowap5-255228596859.europe-west1.run.app/tonconnect-manifest.json";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
);
