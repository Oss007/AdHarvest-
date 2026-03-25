/**
 * Safe storage utility that handles Telegram CloudStorage with fallback to localStorage.
 */

const getWebApp = () => (window as any).Telegram?.WebApp;

/**
 * Safely checks if a feature is supported by the current Telegram WebApp version.
 */
const isVersionAtLeast = (version: string): boolean => {
  try {
    const tg = getWebApp();
    if (!tg) return false;
    
    // Use native method if available (added in 6.0)
    if (typeof tg.isVersionAtLeast === 'function') {
      return tg.isVersionAtLeast(version);
    }
    
    if (!tg.version) return false;
    
    const currentParts = tg.version.split('.');
    const targetParts = version.split('.');
    
    for (let i = 0; i < Math.max(currentParts.length, targetParts.length); i++) {
      const current = parseInt(currentParts[i] || '0', 10);
      const target = parseInt(targetParts[i] || '0', 10);
      
      if (current > target) return true;
      if (current < target) return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safely retrieves the CloudStorage object if available and supported.
 */
const getCloudStorage = () => {
  if (isVersionAtLeast('6.9')) {
    const tg = getWebApp();
    // Accessing the property only if version check passes
    return tg?.CloudStorage;
  }
  return null;
};

export const safeStorage = {
  setItem: (key: string, value: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const cloud = getCloudStorage();
      if (cloud && typeof cloud.setItem === 'function') {
        try {
          cloud.setItem(key, value, (error: any, success: boolean) => {
            if (error) {
              console.warn("CloudStorage setItem error, falling back to localStorage:", error);
              localStorage.setItem(key, value);
              resolve(true);
            } else {
              resolve(success);
            }
          });
        } catch (e) {
          console.warn("CloudStorage setItem exception, falling back to localStorage:", e);
          localStorage.setItem(key, value);
          resolve(true);
        }
      } else {
        localStorage.setItem(key, value);
        resolve(true);
      }
    });
  },

  getItem: (key: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const cloud = getCloudStorage();
      if (cloud && typeof cloud.getItem === 'function') {
        try {
          cloud.getItem(key, (error: any, value: string | null) => {
            if (error) {
              console.warn("CloudStorage getItem error, falling back to localStorage:", error);
              resolve(localStorage.getItem(key));
            } else {
              resolve(value || localStorage.getItem(key));
            }
          });
        } catch (e) {
          console.warn("CloudStorage getItem exception, falling back to localStorage:", e);
          resolve(localStorage.getItem(key));
        }
      } else {
        resolve(localStorage.getItem(key));
      }
    });
  }
};
