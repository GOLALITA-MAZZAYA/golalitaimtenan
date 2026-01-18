export const transformMerchantsData = (merchants) => {
  return merchants.map((merchant) => ({
    name: merchant.merchant_name,
    image_icon: merchant.merchant_logo,
    id: merchant.merchant_id,
  }));
};
