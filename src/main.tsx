import './polyfills';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App';
import './index.css';
import './lib/i18n';

// Initialize Telegram WebApp safely
const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  // Sync theme
  document.documentElement.className = tg.colorScheme || 'light';
  tg.onEvent('themeChanged', () => {
    document.documentElement.className = tg.colorScheme || 'light';
  });

  // Haptic feedback on init
  try {
    tg.HapticFeedback?.impactOccurred('medium');
  } catch (e) {
    // Silently fail
  }
}

const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
);
