import React, { useState, useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sprout, Users, User as UserIcon, Globe, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

import FarmField, { CropState } from './components/FarmField';
import AdWatcher from './components/AdWatcher';
import ReferralSystem from './components/ReferralSystem';
import Profile from './components/Profile';
import { rewardUser } from './lib/ton';
import { handleReferral } from './lib/referral';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [tonConnectUI] = useTonConnectUI();
  
  // States
  const [activeTab, setActiveTab] = useState<'farm' | 'referrals' | 'profile'>('farm');
  const [cropState, setCropState] = useState<CropState>('barren');
  const [adsLeft, setAdsLeft] = useState(10);
  const [referrals, setReferrals] = useState<string[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const userId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'DEV_USER_123';
  const startParam = (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param;

  // Persistence
  useEffect(() => {
    const savedState = localStorage.getItem(`adh_state_${userId}`);
    const savedAds = localStorage.getItem(`adsLeft_${userId}`);
    const savedLastReset = localStorage.getItem(`lastReset_${userId}`);
    const savedRefs = localStorage.getItem(`referrals_${userId}`);
    const savedEarned = localStorage.getItem(`totalEarned_${userId}`);
    const savedBurned = localStorage.getItem(`totalBurned_${userId}`);

    if (savedState) setCropState(savedState as CropState);
    if (savedEarned) setTotalEarned(parseInt(savedEarned));
    if (savedBurned) setTotalBurned(parseInt(savedBurned));
    
    const today = new Date().toDateString();
    const extraAds = (savedRefs ? JSON.parse(savedRefs).length : 0) * 5;

    if (savedLastReset !== today) {
      setAdsLeft(10 + extraAds);
      localStorage.setItem(`lastReset_${userId}`, today);
    } else if (savedAds) {
      setAdsLeft(parseInt(savedAds));
    }

    if (savedRefs) {
      const refs = JSON.parse(savedRefs);
      setReferrals(refs);
      handleReferral(startParam, refs, (newRefs) => {
        setReferrals(newRefs);
        localStorage.setItem(`referrals_${userId}`, JSON.stringify(newRefs));
      });
    } else {
      handleReferral(startParam, [], (newRefs) => {
        setReferrals(newRefs);
        localStorage.setItem(`referrals_${userId}`, JSON.stringify(newRefs));
      });
    }

    setLoading(false);
  }, [userId, startParam]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(`adh_state_${userId}`, cropState);
      localStorage.setItem(`adsLeft_${userId}`, adsLeft.toString());
      localStorage.setItem(`totalEarned_${userId}`, totalEarned.toString());
      localStorage.setItem(`totalBurned_${userId}`, totalBurned.toString());
    }
  }, [cropState, adsLeft, totalEarned, totalBurned, loading, userId]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdComplete = async () => {
    try {
      setAdsLeft(prev => prev - 1);
      
      // TON Reward
      const userAddress = tonConnectUI.account?.address || 'DEV_ADDRESS';
      await rewardUser(tonConnectUI, userAddress);
      
      setTotalEarned(prev => prev + 10);
      setTotalBurned(prev => prev + 2);
      setCropState('watered');
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#8BC34A', '#FFEB3B']
      });

      setTimeout(() => setCropState('harvested'), 1500);
    } catch (error) {
      showToast(t('toast_ad_error'), 'error');
    }
  };

  const handleHarvest = () => {
    setCropState('barren');
    showToast("10 ADH Added to Balance!", 'success');
  };

  const toggleLanguage = () => {
    const newLng = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLng);
    document.dir = newLng === 'ar' ? 'rtl' : 'ltr';
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 size={48} className="text-[#4CAF50]" />
        </motion.div>
        <p className="mt-4 font-black text-[#4CAF50] uppercase tracking-widest">AdHarvest</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <header className="p-6 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4CAF50] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sprout size={24} />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter">{t('app_name')}</h1>
        </div>
        <button 
          onClick={toggleLanguage}
          className="p-3 bg-gray-50 rounded-xl text-gray-500 hover:text-[#4CAF50] transition-colors"
        >
          <Globe size={20} />
        </button>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'farm' && (
            <motion.div
              key="farm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FarmField 
                cropState={cropState} 
                onHarvest={handleHarvest} 
                adsLeft={adsLeft} 
              />
              <AdWatcher 
                adsLeft={adsLeft} 
                onAdComplete={handleAdComplete} 
                onAdError={(msg) => showToast(msg, 'error')} 
              />
            </motion.div>
          )}

          {activeTab === 'referrals' && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReferralSystem 
                userId={userId} 
                referrals={referrals} 
                onCopySuccess={() => showToast(t('toast_copy_success'), 'success')} 
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Profile 
                totalEarned={totalEarned} 
                totalBurned={totalBurned} 
                referrals={referrals} 
                extraAdsUnlocked={referrals.length * 5} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 flex items-center justify-around z-40">
        <button 
          onClick={() => setActiveTab('farm')}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'farm' ? 'text-[#4CAF50] scale-110' : 'text-gray-400'}`}
        >
          <Sprout size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('farm')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('referrals')}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'referrals' ? 'text-[#4CAF50] scale-110' : 'text-gray-400'}`}
        >
          <Users size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('referrals')}</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'profile' ? 'text-[#4CAF50] scale-110' : 'text-gray-400'}`}
        >
          <UserIcon size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('profile')}</span>
        </button>
      </nav>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed bottom-24 left-4 right-4 p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 ${
              toast.type === 'success' ? 'bg-[#4CAF50] text-white' : 'bg-[#FF5722] text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-bold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
