import React, { useState } from 'react';
import { Share2, Copy, Check, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface ReferralSystemProps {
  userId: string;
  referrals: string[];
  onCopySuccess: () => void;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ userId, referrals, onCopySuccess }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const botUsername = import.meta.env.VITE_BOT_USERNAME || "AdHarvestBot";
  const referralLink = `https://t.me/${botUsername}/app?startapp=ref_${userId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    onCopySuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join AdHarvest and farm ADH with me! 🌾💰")}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl border border-gray-100 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#4CAF50]/10 rounded-2xl">
          <Users size={24} className="text-[#4CAF50]" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">{t('referrals')}</h2>
          <p className="text-sm text-gray-500 font-medium">+5 extra ads/day per unique referral</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-3 border border-gray-200"
        >
          {copied ? <Check size={20} className="text-[#4CAF50]" /> : <Copy size={20} />}
          {t('copy_link')}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full py-4 bg-[#2196F3] text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg"
        >
          <Share2 size={20} />
          {t('share_tg')}
        </motion.button>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('referral_list')}</h3>
          <span className="text-xs font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-1 rounded-lg">
            {referrals.length} {t('invites')}
          </span>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {referrals.length === 0 ? (
            <div className="text-center py-6 text-gray-400 italic text-sm">
              No referrals yet. Share your link to earn extra ads!
            </div>
          ) : (
            referrals.map((ref, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {ref.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="font-mono text-sm text-gray-600">User_{ref.slice(-8)}</span>
                </div>
                <Sparkles size={16} className="text-[#FFEB3B]" />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
