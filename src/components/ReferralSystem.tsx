import React, { useState } from 'react';
import { Users, Share2, Copy, Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { generateReferralLink } from '@/lib/referral';

interface ReferralSystemProps {
  userId: string;
  referrals: string[];
}

export const ReferralSystem: React.FC<ReferralSystemProps> = ({ userId, referrals }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const refLink = generateReferralLink(userId);

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    } catch (e) {}
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent('Join AdHarvest and farm ADH tokens with me! 🌾💰')}`;
    try {
      window.Telegram?.WebApp?.openTelegramLink(shareUrl);
    } catch (e) {}
  };

  return (
    <div className="w-full space-y-6 px-4 pb-20">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{t('invite_friends')}</h3>
            <p className="text-xs text-gray-500">+5 {t('extra_ads')} per referral</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Share2 size={18} />
            {t('share_link')}
          </button>
          <button
            onClick={handleCopy}
            className="w-14 bg-gray-100 text-gray-600 py-3 rounded-xl flex items-center justify-center active:scale-95 transition-all"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-400 px-2 uppercase tracking-wider">
          {t('friends_invited')} ({referrals.length})
        </h4>
        
        <div className="space-y-2">
          {referrals.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">{t('invite_friends')}</p>
            </div>
          ) : (
            referrals.map((ref, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                    {i + 1}
                  </div>
                  <span className="font-medium text-gray-700">User...{ref.slice(-8)}</span>
                </div>
                <div className="text-green-500 font-bold text-sm">+5 Ads</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
