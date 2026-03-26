import React from 'react';
import { Package, Droplets, Sprout, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export type CropState = 'barren' | 'watered' | 'harvested';

interface FarmFieldProps {
  cropState: CropState;
  onHarvest: () => void;
  adsLeft: number;
}

const FarmField: React.FC<FarmFieldProps> = ({ cropState, onHarvest, adsLeft }) => {
  const { t } = useTranslation();

  const getEmoji = (state: CropState) => {
    switch (state) {
      case 'barren': return '🟫🌾';
      case 'watered': return '💧🌱';
      case 'harvested': return '🌾💰';
    }
  };

  const getStatusText = (state: CropState) => {
    switch (state) {
      case 'barren': return t('barren');
      case 'watered': return t('watered');
      case 'harvested': return t('harvested');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-4 bg-gradient-to-br from-[#4CAF50]/10 to-[#8BC34A]/10 rounded-3xl shadow-2xl border border-[#4CAF50]/20">
      <div className="grid grid-cols-3 gap-3 aspect-square">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-center text-4xl rounded-2xl shadow-inner transition-colors duration-500 ${
              cropState === 'barren' ? 'bg-[#795548]/20' : 
              cropState === 'watered' ? 'bg-[#2196F3]/10' : 
              'bg-[#FFEB3B]/20'
            }`}
          >
            <motion.span
              animate={cropState === 'harvested' ? {
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {getEmoji(cropState)}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-bold text-[#4CAF50] mb-2">{getStatusText(cropState)}</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Droplets size={16} className="text-[#2196F3]" />
          <span>{t('ads_left', { count: adsLeft })}</span>
        </div>
      </div>

      <AnimatePresence>
        {cropState === 'harvested' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-8 z-50"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-full p-6 mb-6 shadow-[0_0_30px_rgba(255,235,59,0.5)]"
            >
              <Package size={64} className="text-[#FFEB3B]" />
            </motion.div>
            
            <h2 className="text-2xl font-black text-white mb-2">{t('harvested')}!</h2>
            <p className="text-white/70 mb-8 text-center">10 ADH minted, 2 ADH burned</p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHarvest}
              className="w-full py-4 bg-[#FFEB3B] text-[#795548] font-black rounded-2xl shadow-xl flex items-center justify-center gap-2"
            >
              <Coins size={24} />
              {t('harvest_adh')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmField;
