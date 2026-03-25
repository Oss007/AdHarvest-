import React, { useState } from 'react';
import { Play, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

interface AdWatcherProps {
  adsLeft: number;
  onComplete: () => void;
  onError: (msg: string) => void;
}

export const AdWatcher: React.FC<AdWatcherProps> = ({ adsLeft, onComplete, onError }) => {
  const { t } = useTranslation();
  const [isWatching, setIsWatching] = useState(false);

  const handleWatchAd = () => {
    if (adsLeft <= 0) {
      onError(t('no_ads_left'));
      return;
    }

    if (typeof window.show_10780044 !== 'function') {
      onError(t('no_ads_left'));
      return;
    }

    setIsWatching(true);
    
    try {
      window.show_10780044({ type: 'rewarded' });
      
      // Monetag doesn't have a direct callback in this simple SDK script
      // Usually you'd listen for a custom event or the SDK handles the reward
      // For this demo, we'll simulate completion after a delay if the SDK is called
      // In production, you'd use the proper SDK callbacks
      
      setTimeout(() => {
        setIsWatching(false);
        onComplete();
      }, 5000); // Simulate ad duration

    } catch (err) {
      setIsWatching(false);
      onError(t('ad_error'));
    }
  };

  return (
    <div className="w-full px-4">
      <button
        onClick={handleWatchAd}
        disabled={isWatching || adsLeft <= 0}
        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
          isWatching || adsLeft <= 0 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-primary text-white hover:bg-green-600 active:scale-95 shadow-green-200'
        }`}
      >
        {isWatching ? (
          <>
            <RefreshCw size={20} className="animate-spin" />
            {t('watching_ad')}
          </>
        ) : (
          <>
            <Play size={20} fill="currentColor" />
            {t('watch_ad')}
          </>
        )}
      </button>
      
      <p className="text-center mt-3 text-xs font-medium text-gray-400">
        {t('ads_left', { count: adsLeft })}
      </p>
    </div>
  );
};
