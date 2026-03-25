/**
 * Polyfills for the browser environment.
 * Node.js globals like Buffer and process are handled by vite-plugin-node-polyfills in vite.config.ts.
 */

// Telegram legacy warnings suppression (safe)
(function () {
  if (typeof console === 'undefined') return;

  const methods: ('log' | 'warn' | 'error' | 'info')[] = ['log', 'warn', 'error', 'info'];
  methods.forEach((method) => {
    const original = console[method];
    console[method] = function (...args: any[]) {
      const msg = args[0];
      if (typeof msg === 'string') {
        if (
          msg.includes('CloudStorage is not supported') ||
          msg.includes('HapticFeedback is not supported') ||
          msg.includes('[Telegram.WebApp] CloudStorage') ||
          msg.includes('[Telegram.WebApp] HapticFeedback')
        ) {
          return; // Suppressed
        }
      }
      original.apply(console, args);
    };
  });
})();

// Shadow legacy Telegram properties if version < required
(function () {
  const tg = (window as any).Telegram?.WebApp;
  if (!tg) return;

  try {
    const version = tg.version || '0';
    const [major = 0, minor = 0] = version.split('.').map(Number);

    // CloudStorage (needs 6.9+)
    if (major < 6 || (major === 6 && minor < 9)) {
      Object.defineProperty(tg, 'CloudStorage', {
        value: null,
        writable: false,
        configurable: true,
        enumerable: true,
      });
    }

    // HapticFeedback (needs 6.1+)
    if (major < 6 || (major === 6 && minor < 1)) {
      Object.defineProperty(tg, 'HapticFeedback', {
        value: {
          impactOccurred: () => {},
          notificationOccurred: () => {},
          selectionChanged: () => {},
        },
        writable: false,
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Silently fail
  }
})();

export {};
