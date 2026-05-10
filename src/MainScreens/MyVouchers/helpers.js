export const getCommission = (amount) => {
  if (!amount) return 0;

  return +((amount / 100) * 1.85 + 0.5).toFixed(2);
};
