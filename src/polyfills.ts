/**
 * Polyfills for the browser environment.
 * Node.js globals like Buffer and process are handled by vite-plugin-node-polyfills in vite.config.ts.
 */

// Telegram legacy warnings suppression (safe)
(function () {
  if (typeof console === 'undefined') return;

  const methods: ('log' | 'warn' | 'error' | 'info' | 'debug')[] = ['log', 'warn', 'error', 'info', 'debug'];
  
  // 1. Console Interception (Immediate & Aggressive)
  const suppressPatterns = [
    /CloudStorage/i,
    /HapticFeedback/i,
    /Telegram\.WebApp/i,
    /version 6\./i,
    /not supported/i
  ];

  function shouldSuppress(args: any[]) {
    let combined = "";
    for (let i = 0; i < args.length; i++) {
      try {
        const arg = args[i];
        if (arg === null || arg === undefined) combined += String(arg) + " ";
        else if (typeof arg === 'string') combined += arg + " ";
        else if (arg instanceof Error) combined += arg.message + " " + (arg.stack || "") + " ";
        else {
          try {
            combined += String(arg) + " " + JSON.stringify(arg) + " ";
          } catch(e) {
            combined += String(arg) + " ";
          }
        }
      } catch(e) {}
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
      return original.apply(console, args);
    };
  });
})();

// Safe Telegram WebApp fallback & Shadowing
(function () {
  if (typeof window === 'undefined') return;
  
  const win = window as any;
  
  function applyShadows(tg: any) {
    if (!tg) return;

    const v = parseFloat(tg.version || '0');
    const isAtLeast = (ver: string) => {
      if (typeof tg.isVersionAtLeast === 'function') return tg.isVersionAtLeast(ver);
      return v >= parseFloat(ver);
    };

    if (!isAtLeast('6.9')) {
      const mockCloudStorage = {
        setItem: (key: string, value: string, cb?: (error: string | null, success: boolean) => void) => {
          localStorage.setItem(key, value);
          if (cb) cb(null, true);
        },
        getItem: (key: string, cb: (error: string | null, value: string | null) => void) => {
          const val = localStorage.getItem(key);
          if (cb) cb(null, val);
        },
        getItems: (keys: string[], cb: (error: string | null, values: (string | null)[]) => void) => {
          const vals = keys.map((k) => localStorage.getItem(k));
          if (cb) cb(null, vals);
        },
        removeItem: (key: string, cb?: (error: string | null, success: boolean) => void) => {
          localStorage.removeItem(key);
          if (cb) cb(null, true);
        },
        removeItems: (keys: string[], cb?: (error: string | null, success: boolean) => void) => {
          keys.forEach((k) => localStorage.removeItem(k));
          if (cb) cb(null, true);
        },
        getKeys: (cb: (error: string | null, keys: string[]) => void) => {
          const keys = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) keys.push(key);
          }
          if (cb) cb(null, keys);
        },
      };
      try {
        Object.defineProperty(tg, 'CloudStorage', {
          get: () => mockCloudStorage,
          set: () => {},
          configurable: true,
          enumerable: true,
        });
      } catch (e) {}
    }

    if (!isAtLeast('6.1')) {
      const dummyHaptic = {
        impactOccurred: () => {},
        notificationOccurred: () => {},
        selectionChanged: () => {},
      };
      try {
        Object.defineProperty(tg, 'HapticFeedback', {
          get: () => dummyHaptic,
          set: () => {},
          configurable: true,
          enumerable: true,
        });
      } catch (e) {}
    }
  }

  // Intercept window.Telegram assignment
  let _telegram = win.Telegram;
  try {
    Object.defineProperty(win, 'Telegram', {
      get: () => _telegram,
      set: (v) => {
        _telegram = v;
        if (_telegram && _telegram.WebApp) {
          applyShadows(_telegram.WebApp);
        }
      },
      configurable: true
    });
  } catch (e) {}

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
      isVersionAtLeast: () => false,
    };
  } else {
    applyShadows(win.Telegram.WebApp);
  }

  // Polling just in case
  let count = 0;
  const interval = setInterval(() => {
    if (win.Telegram && win.Telegram.WebApp) {
      applyShadows(win.Telegram.WebApp);
    }
    if (++count > 20) clearInterval(interval);
  }, 100);
})();

export {};
