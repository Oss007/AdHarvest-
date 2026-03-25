import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;

// Ensure global is defined for some older libraries
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Fix for Telegram CloudStorage warning on legacy versions (< 6.9)
// 1. Suppress the warning message itself across all console methods
(function() {
  var methods = ['log', 'warn', 'error', 'info'];
  methods.forEach(function(method) {
    var original = (console as any)[method];
    (console as any)[method] = function() {
      if (arguments[0] && typeof arguments[0] === 'string' && 
          (arguments[0].indexOf('CloudStorage is not supported') !== -1 || 
           arguments[0].indexOf('[Telegram.WebApp] CloudStorage') !== -1)) {
        return;
      }
      original.apply(console, arguments);
    };
  });
})();

// 2. Shadow the property on legacy versions
(function() {
  const tg = (window as any).Telegram?.WebApp;
  if (tg) {
    try {
      const version = tg.version || '0';
      const parts = version.split('.');
      const major = parseInt(parts[0], 10) || 0;
      const minor = parseInt(parts[1], 10) || 0;
      
      if (major < 6 || (major === 6 && minor < 9)) {
        // Version is too old for CloudStorage
        Object.defineProperty(tg, 'CloudStorage', {
          value: null,
          writable: false,
          configurable: true,
          enumerable: true
        });
      }
    } catch (e) {
      // Silently fail if we can't shadow it
    }
  }
})();
