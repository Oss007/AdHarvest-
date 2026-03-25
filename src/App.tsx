import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sprout, 
  Users, 
  User as UserIcon, 
  Trophy, 
  AlertCircle,
  CheckCircle2,
  Globe
} from 'lucide-react';

import { FarmField, CropState } from './components/FarmField';
import { AdWatcher } from './components/AdWatcher';
import { ReferralSystem } from './components/ReferralSystem';
import { Profile } from './components/Profile';
import { rewardUser } from './lib/ton';
import { handleReferral } from './lib/referral';

import { safeStorage } from './lib/storage';

type Tab = 'farm' | 'referral' | 'profile';

export default function App() {
  const { t, i18n } = useTranslation();
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  
  const userId = window.Telegram.WebApp.initDataUnsafe.user?.id?.toString() || 'DEV_USER_123';
  
  // States
  const [activeTab, setActiveTab] = useState<Tab>('farm');
  const [cells, setCells] = useState<CropState[]>(new Array(9).fill('barren'));
  const [adsLeft, setAdsLeft] = useState(10);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);
  const [referrals, setReferrals] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isHarvestReady, setIsHarvestReady] = useState(false);

  // Persistence keys
  const STORAGE_KEY = `adh_state_${userId}`;

  // Load state
  useEffect(() => {
    const loadData = async () => {
      const saved = await safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setTotalEarned(data.totalEarned || 0);
        setTotalBurned(data.totalBurned || 0);
        setReferrals(data.referrals || []);
        
        // Daily reset logic
        const lastReset = await safeStorage.getItem(`lastReset_${userId}`);
        const today = new Date().toDateString();
        if (lastReset !== today) {
          const extraAds = (data.referrals?.length || 0) * 5;
          setAdsLeft(10 + extraAds);
          await safeStorage.setItem(`lastReset_${userId}`, today);
        } else {
          setAdsLeft(data.adsLeft ?? 10);
        }
      }
      
      // Handle referral param
      if (handleReferral(referrals, setReferrals)) {
        showToast("Referral successful! +5 Ads unlocked.", 'success');
      }
    };
    
    loadData();
  }, []);

  // Save state
  useEffect(() => {
    const saveData = async () => {
      const state = {
        totalEarned,
        totalBurned,
        referrals,
        adsLeft
      };
      await safeStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    };
    
    saveData();
  }, [totalEarned, totalBurned, referrals, adsLeft]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdComplete = async () => {
    try {
      setAdsLeft(prev => Math.max(0, prev - 1));
      
      // TON Reward
      await rewardUser(tonConnectUI, userAddress);
      
      setTotalEarned(prev => prev + 10);
      setTotalBurned(prev => prev + 2);
      
      // Update farm
      const barrenIndex = cells.findIndex(c => c === 'barren');
      if (barrenIndex !== -1) {
        const newCells = [...cells];
        newCells[barrenIndex] = 'watered';
        setCells(newCells);
        
        // Transition to harvested after a short delay
        setTimeout(() => {
          const harvestedCells = [...newCells];
          harvestedCells[barrenIndex] = 'harvested';
          setCells(harvestedCells);
          
          if (harvestedCells.every(c => c === 'harvested')) {
            setIsHarvestReady(true);
          }
        }, 2000);
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#8BC34A', '#FFEB3B']
      });

      showToast("ADH Earned! 10 Minted, 2 Burned.", 'success');
    } catch (err) {
      showToast("Transaction failed. Try again.", 'error');
    }
  };

  const handleHarvest = () => {
    setCells(new Array(9).fill('barren'));
    setIsHarvestReady(false);
    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    showToast("Farm Reset! Ready for more.", 'success');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
            <Sprout size={18} />
          </div>
          <h1 className="text-lg font-black text-gray-900 tracking-tight">AdHarvest</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-all"
          >
            <Globe size={16} />
          </button>
          <div className="px-3 py-1 bg-gold/20 text-amber-700 rounded-full text-xs font-bold border border-gold/30">
            {totalEarned} ADH
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'farm' && (
            <motion.div
              key="farm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-gray-900">{t('farm_level')}</h2>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
                  {totalEarned < 50 ? t('levels.novice') : t('levels.green')}
                </p>
              </div>

              <FarmField 
                cells={cells} 
                onCellClick={() => {}} 
                onHarvest={handleHarvest}
                isHarvestReady={isHarvestReady}
                adsLeft={adsLeft}
              />

              <AdWatcher 
                adsLeft={adsLeft} 
                onComplete={handleAdComplete} 
                onError={(msg) => showToast(msg, 'error')} 
              />
            </motion.div>
          )}

          {activeTab === 'referral' && (
            <motion.div
              key="referral"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ReferralSystem userId={userId} referrals={referrals} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Profile totalEarned={totalEarned} totalBurned={totalBurned} referrals={referrals} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between pb-8">
        <button 
          onClick={() => setActiveTab('farm')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'farm' ? 'text-primary scale-110' : 'text-gray-300'}`}
        >
          <Sprout size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Farm</span>
        </button>
        <button 
          onClick={() => setActiveTab('referral')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'referral' ? 'text-primary scale-110' : 'text-gray-300'}`}
        >
          <Users size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Referral</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-primary scale-110' : 'text-gray-300'}`}
        >
          <UserIcon size={24} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </button>
      </nav>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-4 right-4 z-[100]"
          >
            <div className={`rounded-2xl p-4 flex items-center gap-3 shadow-xl border ${
              toast.type === 'success' ? 'bg-green-500 border-green-400 text-white' : 'bg-red-500 border-red-400 text-white'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-bold">{toast.msg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
