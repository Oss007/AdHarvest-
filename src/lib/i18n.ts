import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "AdHarvest",
      "farm": "Farm",
      "profile": "Profile",
      "referrals": "Referrals",
      "harvest_adh": "HARVEST ADH",
      "ads_left": "Ads remaining: {{count}}",
      "no_ads": "No more ads today or SDK not loaded",
      "watch_ad": "Watch Ad to Water",
      "barren": "Barren Soil",
      "watered": "Watered",
      "harvested": "Ready to Harvest",
      "total_earned": "Total Earned",
      "total_burned": "Total Burned",
      "invites": "Invites",
      "extra_ads": "Extra Ads Unlocked",
      "leaderboard": "Leaderboard",
      "copy_link": "Copy Referral Link",
      "share_tg": "Share on Telegram",
      "referral_list": "Your Referrals",
      "level_novice": "Novice Farmer",
      "level_green": "Green Thumb",
      "level_master": "Master Harvester",
      "level_tycoon": "ADH Tycoon",
      "toast_ad_error": "Watch full ad to earn ADH!",
      "toast_copy_success": "Link copied to clipboard!",
      "minting": "Minting 10 ADH...",
      "burning": "Burning 2 ADH..."
    }
  },
  ar: {
    translation: {
      "app_name": "حصاد الإعلانات",
      "farm": "المزرعة",
      "profile": "الملف الشخصي",
      "referrals": "الإحالات",
      "harvest_adh": "احصد ADH",
      "ads_left": "الإعلانات المتبقية: {{count}}",
      "no_ads": "لا توجد إعلانات اليوم أو لم يتم تحميل SDK",
      "watch_ad": "شاهد إعلان للري",
      "barren": "تربة قاحلة",
      "watered": "مروية",
      "harvested": "جاهز للحصاد",
      "total_earned": "إجمالي المكتسب",
      "total_burned": "إجمالي المحروق",
      "invites": "الدعوات",
      "extra_ads": "إعلانات إضافية مفتوحة",
      "leaderboard": "لوحة المتصدرين",
      "copy_link": "نسخ رابط الإحالة",
      "share_tg": "مشاركة عبر تلغرام",
      "referral_list": "إحالاتك",
      "level_novice": "مزارع مبتدئ",
      "level_green": "إبهام أخضر",
      "level_master": "خبير الحصاد",
      "level_tycoon": "تايكون ADH",
      "toast_ad_error": "شاهد الإعلان كاملاً لكسب ADH!",
      "toast_copy_success": "تم نسخ الرابط!",
      "minting": "سك 10 ADH...",
      "burning": "حرق 2 ADH..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
