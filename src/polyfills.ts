/**
 * Polyfills for the browser environment.
 * Node.js globals like Buffer and process are handled by vite-plugin-node-polyfills in vite.config.ts.
 */

// Telegram legacy warnings suppression (safe)
(function () {
  if (typeof console === 'undefined') return;

  const methods: ('log' | 'warn' | 'error' | 'info' | 'debug')[] = ['log', 'warn', 'error', 'info', 'debug'];
  
  // 1. Extremely Aggressive Console Interception
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

    // Spoof version to 6.9 to stop internal SDK warnings
    const actualVersion = tg.version || '6.0';
    const v = parseFloat(actualVersion);
    
    if (v < 6.9) {
      try {
        Object.defineProperty(tg, 'version', {
          get: () => '6.9',
          configurable: true,
          enumerable: true,
        });
        
        const originalIsVersionAtLeast = tg.isVersionAtLeast;
        tg.isVersionAtLeast = (ver: string) => {
          const targetV = parseFloat(ver);
          if (targetV <= 6.9) return true;
          if (typeof originalIsVersionAtLeast === 'function') {
            return originalIsVersionAtLeast.call(tg, ver);
          }
          return false;
        };
      } catch (e) {}
    }

    // Shadow CloudStorage with a working mock
    const mockCloudStorage = {
      setItem: (key: string, value: string, cb?: (error: string | null, success: boolean) => void) => {
        localStorage.setItem(key, value);
        if (cb) setTimeout(() => cb(null, true), 0);
      },
      getItem: (key: string, cb: (error: string | null, value: string | null) => void) => {
        const val = localStorage.getItem(key);
        if (cb) setTimeout(() => cb(null, val), 0);
      },
      getItems: (keys: string[], cb: (error: string | null, values: (string | null)[]) => void) => {
        const vals = keys.map((k) => localStorage.getItem(k));
        if (cb) setTimeout(() => cb(null, vals), 0);
      },
      removeItem: (key: string, cb?: (error: string | null, success: boolean) => void) => {
        localStorage.removeItem(key);
        if (cb) setTimeout(() => cb(null, true), 0);
      },
      removeItems: (keys: string[], cb?: (error: string | null, success: boolean) => void) => {
        keys.forEach((k) => localStorage.removeItem(k));
        if (cb) setTimeout(() => cb(null, true), 0);
      },
      getKeys: (cb: (error: string | null, keys: string[]) => void) => {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) keys.push(key);
        }
        if (cb) setTimeout(() => cb(null, keys), 0);
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

    // Shadow HapticFeedback
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
      version: '6.9', // Mock version
      isVersionAtLeast: (ver: string) => parseFloat(ver) <= 6.9,
    };
  } else {
    applyShadows(win.Telegram.WebApp);
  }

  // Continuous Polling
  setInterval(() => {
    if (win.Telegram && win.Telegram.WebApp) {
      applyShadows(win.Telegram.WebApp);
    }
  }, 100);
})();

export {};
