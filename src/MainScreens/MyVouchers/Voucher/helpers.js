export const getVoucherTotalValue = (voucher) => {
  if (!voucher) {
    return 0;
  }

  const isCash = voucher.cash;

  if (isCash) {
    return voucher.voucher_amount;
  }

  const amount = voucher.voucher_amount;
  const deliveryCharge = amount > 200 ? 0 : voucher.delivery_charge || 0;

  return amount + deliveryCharge;
};
