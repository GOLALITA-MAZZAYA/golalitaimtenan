export const getCommission = (amount) => {
  if (!amount) return 0;

  // Work in integer cents so the 1.85% rate can't leave a binary-float
  // remainder (e.g. 25.92 * 0.0185 + 0.5 => 0.9795000000000001) that
  // toFixed(2) would otherwise round unpredictably.
  const amountCents = Math.round(Number(amount) * 100);
  const commissionCents = Math.round(amountCents * 0.0185) + 50;

  return commissionCents / 100;
};
