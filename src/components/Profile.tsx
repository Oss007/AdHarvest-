import React from 'react';
import { User, Award, Flame, TrendingUp, Crown, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface ProfileProps {
  totalEarned: number;
  totalBurned: number;
  referrals: string[];
  extraAdsUnlocked: number;
}

const Profile: React.FC<ProfileProps> = ({ totalEarned, totalBurned, referrals, extraAdsUnlocked }) => {
  const { t } = useTranslation();

  const getLevelName = (earned: number) => {
    if (earned < 50) return t('level_novice');
    if (earned < 150) return t('level_green');
    if (earned < 300) return t('level_master');
    return t('level_tycoon');
  };

  const leaderboard = [
    { name: "TON_Master", earned: 1250, rank: 1, icon: <Crown className="text-[#FFD700]" /> },
    { name: "ADH_Farmer", earned: 980, rank: 2, icon: <Star className="text-[#C0C0C0]" /> },
    { name: "Crypto_Grower", earned: 740, rank: 3, icon: <Shield className="text-[#CD7F32]" /> },
    { name: "AlgeriaKing", earned: 520, rank: 4, icon: <Zap className="text-[#2196F3]" /> },
  ];

  const inviteCount = Array.isArray(referrals) ? referrals.length : 0;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl border border-gray-100 mt-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] rounded-3xl flex items-center justify-center text-white shadow-lg">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">{getLevelName(totalEarned)}</h2>
          <p className="text-sm font-bold text-[#4CAF50] uppercase tracking-widest">AdHarvest Farmer</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#4CAF50]" />
            <span className="text-xs font-black text-gray-400 uppercase">{t('total_earned')}</span>
          </div>
          <p className="text-xl font-black text-gray-900">{totalEarned} ADH</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-[#FF5722]" />
            <span className="text-xs font-black text-gray-400 uppercase">{t('total_burned')}</span>
          </div>
          <p className="text-xl font-black text-gray-900">{totalBurned} ADH</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-[#FFEB3B]" />
            <span className="text-xs font-black text-gray-400 uppercase">{t('invites')}</span>
          </div>
          <p className="text-xl font-black text-gray-900">{inviteCount}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#2196F3]" />
            <span className="text-xs font-black text-gray-400 uppercase">{t('extra_ads')}</span>
          </div>
          <p className="text-xl font-black text-gray-900">+{extraAdsUnlocked}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 px-2">{t('leaderboard')}</h3>
        <div className="space-y-3">
          {leaderboard.map((user, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  {user.icon}
                </div>
                <span className="font-bold text-gray-700">{user.name}</span>
              </div>
              <span className="font-mono font-black text-[#4CAF50]">{user.earned} ADH</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
