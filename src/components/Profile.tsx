import React from 'react';
import { Trophy, TrendingUp, Flame, User, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

interface ProfileProps {
  totalEarned: number;
  totalBurned: number;
  referrals: string[];
}

export const Profile: React.FC<ProfileProps> = ({ totalEarned, totalBurned, referrals }) => {
  const { t } = useTranslation();
  const inviteCount = Array.isArray(referrals) ? referrals.length : 0;
  const extraAds = inviteCount * 5;

  const getLevel = (earned: number) => {
    if (earned < 50) return t('levels.novice');
    if (earned < 150) return t('levels.green');
    if (earned < 300) return t('levels.master');
    return t('levels.tycoon');
  };

  const leaderboard = [
    { name: 'TON_Master', score: 1250, rank: 1 },
    { name: 'ADH_Farmer', score: 980, rank: 2 },
    { name: 'Crypto_Grower', score: 840, rank: 3 },
    { name: 'AlgeriaKing', score: 720, rank: 4 },
  ];

  return (
    <div className="w-full space-y-6 px-4 pb-20">
      <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-black text-lg leading-none">{getLevel(totalEarned)}</h3>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mt-1">{t('farm_level')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div className="flex items-center gap-2 text-gold mb-1">
                <TrendingUp size={14} />
                <span className="text-[10px] font-bold uppercase">{t('total_earned')}</span>
              </div>
              <div className="text-xl font-black">{totalEarned} ADH</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div className="flex items-center gap-2 text-orange-300 mb-1">
                <Flame size={14} />
                <span className="text-[10px] font-bold uppercase">{t('burns_contributed')}</span>
              </div>
              <div className="text-xl font-black">{totalBurned} ADH</div>
            </div>
          </div>
        </div>
        <Award className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <TrendingUp size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">{t('invites')}</div>
            <div className="font-black text-gray-900">{inviteCount}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
            <Flame size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase">{t('extra_ads')}</div>
            <div className="font-black text-gray-900">+{extraAds}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-400 px-2 uppercase tracking-wider flex items-center gap-2">
          <Trophy size={14} />
          {t('leaderboard')}
        </h4>
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          {leaderboard.map((user, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-between p-4 ${i !== leaderboard.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? 'bg-gold text-amber-900' : 
                  i === 1 ? 'bg-gray-200 text-gray-600' : 
                  i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'
                }`}>
                  {user.rank}
                </div>
                <span className="font-bold text-gray-700 text-sm">{user.name}</span>
              </div>
              <span className="font-black text-primary text-sm">{user.score} ADH</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
