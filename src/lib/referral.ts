export const handleReferral = (
  startParam: string | undefined,
  referrals: string[],
  setReferrals: (refs: string[]) => void
) => {
  if (!startParam || !startParam.startsWith('ref_')) return;

  const referrerId = startParam.replace('ref_', '');
  
  if (referrerId && !referrals.includes(referrerId)) {
    const newReferrals = [...referrals, referrerId];
    setReferrals(newReferrals);
    console.log(`New referral added: ${referrerId}`);
  }
};
