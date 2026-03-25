export function handleReferral(referrals: string[], setReferrals: (refs: string[]) => void) {
  const urlParams = new URLSearchParams(window.location.search);
  const startParam = urlParams.get('tgWebAppStartParam') || window.Telegram?.WebApp?.initDataUnsafe?.start_param;

  if (startParam && startParam.startsWith('ref_')) {
    const referrerId = startParam.replace('ref_', '');
    if (!referrals.includes(referrerId)) {
      const newReferrals = [...referrals, referrerId];
      setReferrals(newReferrals);
      return true;
    }
  }
  return false;
}

export function generateReferralLink(userId: string) {
  return `https://t.me/AdHarvestBot/app?startapp=ref_${userId}`;
}
