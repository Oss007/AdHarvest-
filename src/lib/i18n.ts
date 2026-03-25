import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      watch_ad: "Watch Ad to Water",
      watching_ad: "Watching Ad...",
      harvest_adh: "HARVEST ADH",
      no_ads_left: "No more ads today or SDK not loaded",
      ads_left: "Ads left: {{count}}",
      total_earned: "Total Earned",
      burns_contributed: "Burns Contributed",
      invites: "Invites",
      extra_ads: "Extra Ads",
      share_link: "Share Link",
      copy_link: "Copy Link",
      copied: "Copied!",
      friends_invited: "Friends Invited",
      invite_friends: "Invite Friends",
      leaderboard: "Leaderboard",
      farm_level: "Farm Level",
      levels: {
        novice: "Novice Farmer",
        green: "Green Thumb",
        master: "Master Harvester",
        tycoon: "ADH Tycoon"
      },
      ad_error: "Watch full ad to earn ADH!"
    }
  },
  ar: {
    translation: {
      watch_ad: "شاهد إعلان للري",
      watching_ad: "جاري مشاهدة الإعلان...",
      harvest_adh: "حصاد ADH",
      no_ads_left: "لا يوجد إعلانات اليوم أو لم يتم تحميل SDK",
      ads_left: "الإعلانات المتبقية: {{count}}",
      total_earned: "إجمالي الأرباح",
      burns_contributed: "المساهمة في الحرق",
      invites: "الدعوات",
      extra_ads: "إعلانات إضافية",
      share_link: "مشاركة الرابط",
      copy_link: "نسخ الرابط",
      copied: "تم النسخ!",
      friends_invited: "الأصدقاء المدعوون",
      invite_friends: "دعوة الأصدقاء",
      leaderboard: "لوحة المتصدرين",
      farm_level: "مستوى المزرعة",
      levels: {
        novice: "مزارع مبتدئ",
        green: "إبهام أخضر",
        master: "خبير حصاد",
        tycoon: "تايكون ADH"
      },
      ad_error: "شاهد الإعلان كاملاً لربح ADH!"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
