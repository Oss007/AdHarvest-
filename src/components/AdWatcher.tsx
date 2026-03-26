import React, { useState } from 'react';
import { Play, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface AdWatcherProps {
  adsLeft: number;
  onAdComplete: () => void;
  onAdError: (msg: string) => void;
}

const AdWatcher: React.FC<AdWatcherProps> = ({ adsLeft, onAdComplete, onAdError }) => {
  const { t } = useTranslation();
  const [isWatching, setIsWatching] = useState(false);

  const handleWatchAd = async () => {
    if (adsLeft <= 0) {
      onAdError(t('no_ads'));
      return;
    }

    if (!window.show_10780044) {
      console.warn("Monetag SDK not loaded, simulating ad in dev mode...");
      setIsWatching(true);
      setTimeout(() => {
        setIsWatching(false);
        onAdComplete();
      }, 2000);
      return;
    }

    try {
      setIsWatching(true);
      // Monetag SDK call - try without arguments first as some versions throw on unexpected objects
      if (typeof window.show_10780044 === 'function') {
        await window.show_10780044();
      } else {
        throw new Error("Monetag SDK function not found");
      }
      onAdComplete();
    } catch (error) {
      console.error("Ad failed:", error);
      onAdError(t('toast_ad_error'));
    } finally {
      setIsWatching(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 px-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleWatchAd}
        disabled={isWatching || adsLeft <= 0}
        className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xl shadow-xl transition-all duration-300 ${
          adsLeft > 0 
            ? 'bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] text-white' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isWatching ? (
          <Loader2 className="animate-spin" size={24} />
        ) : adsLeft > 0 ? (
          <Play size={24} fill="currentColor" />
        ) : (
          <AlertCircle size={24} />
        )}
        {isWatching ? t('minting') : adsLeft > 0 ? t('watch_ad') : t('no_ads')}
      </motion.button>
      
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            {t('ads_left', { count: adsLeft })}
          </span>
        </div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
          Powered by Monetag
        </div>
      </div>
    </div>
  );
};

export default AdWatcher;
