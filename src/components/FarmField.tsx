import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Droplets, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type CropState = 'barren' | 'watered' | 'harvested';

interface FarmFieldProps {
  cells: CropState[];
  onCellClick: (index: number) => void;
  onHarvest: () => void;
  isHarvestReady: boolean;
  adsLeft: number;
}

export const FarmField: React.FC<FarmFieldProps> = ({ 
  cells, 
  onCellClick, 
  onHarvest, 
  isHarvestReady,
  adsLeft 
}) => {
  const { t } = useTranslation();

  const getEmoji = (state: CropState) => {
    switch (state) {
      case 'barren': return '🟫🌾';
      case 'watered': return '💧🌱';
      case 'harvested': return '🌾💰';
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="farm-grid">
        {cells.map((state, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`crop-cell ${state}`}
            onClick={() => onCellClick(index)}
          >
            <span className="select-none">{getEmoji(state)}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isHarvestReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl space-y-6"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <Package size={40} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900">{t('harvest_adh')}</h2>
                <p className="text-gray-500 text-sm">{t('ads_left', { count: adsLeft })}</p>
              </div>

              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-green-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(adsLeft / 15) * 100}%` }}
                />
              </div>

              <button
                onClick={onHarvest}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95"
              >
                {t('harvest_adh')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
