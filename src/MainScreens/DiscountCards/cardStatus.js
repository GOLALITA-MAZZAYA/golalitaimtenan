// Normalizes a Complimentary Coupon card from API 1.1 / 1.2 (discount_card/customer/*).
// The server's `status` / `is_usable` are authoritative; stamp counts are only used for display.
export const getCardState = (card) => {
  const total = Math.max(0, Number(card?.total_stamps) || 0);
  const used = Math.min(total, Math.max(0, Number(card?.used_stamps) || 0));
  const balance =
    card?.balance_stamps !== undefined && card?.balance_stamps !== null
      ? Math.max(0, Number(card.balance_stamps) || 0)
      : Math.max(0, total - used);

  const status = card?.status || (balance > 0 ? 'active' : 'used');
  const isUsable =
    typeof card?.is_usable === 'boolean' ? card.is_usable : status === 'active' && balance > 0;

  return { total, used, balance, status, isUsable };
};

export const STATUS_COLORS = {
  active: '#10B981',
  used: '#6B7280',
  expired: '#EF4444',
};
