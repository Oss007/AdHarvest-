/**
 * Polyfills for the browser environment.
 * Node.js globals like Buffer and process are handled by vite-plugin-node-polyfills in vite.config.ts.
 */

// Telegram legacy warnings suppression (safe)
(function () {
  if (typeof console === 'undefined') return;

  const methods: ('log' | 'warn' | 'error' | 'info' | 'debug')[] = ['log', 'warn', 'error', 'info', 'debug'];
  
  const suppressPatterns = [
    /CloudStorage is not supported/i,
    /HapticFeedback is not supported/i,
    /\[Telegram\.WebApp\] CloudStorage/i,
    /\[Telegram\.WebApp\] HapticFeedback/i,
    /version 6\.[0-8]/i,
    /version 6\.0/i,
    /not supported in version/i,
    /\[Telegram\.WebApp\]/i
  ];

  function shouldSuppress(args: any[]) {
    let combined = "";
    try {
      combined = args.map(a => {
        if (typeof a === 'string') return a;
        try { return JSON.stringify(a); } catch(e) { return String(a); }
      }).join(' ');
    } catch(e) {
      combined = args.join(' ');
    }
    for (let i = 0; i < suppressPatterns.length; i++) {
      if (suppressPatterns[i].test(combined)) return true;
    }
    return false;
  }

  methods.forEach((method) => {
    const original = console[method];
    if (typeof original !== 'function') return;
    console[method] = function (...args: any[]) {
      if (shouldSuppress(args)) return;
      original.apply(console, args);
    };
  });
})();

// Safe Telegram WebApp fallback
(function () {
  if (typeof window === 'undefined') return;
  
  const win = window as any;
  if (!win.Telegram) win.Telegram = {};
  if (!win.Telegram.WebApp) {
    win.Telegram.WebApp = {
      ready: () => {},
      expand: () => {},
      onEvent: () => {},
      HapticFeedback: {
        impactOccurred: () => {},
        notificationOccurred: () => {},
        selectionChanged: () => {},
      },
      initDataUnsafe: { user: {} },
      colorScheme: 'light',
      version: '6.0',
    };
  }
})();

export {};
