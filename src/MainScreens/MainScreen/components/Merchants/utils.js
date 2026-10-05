import { rewriteAssetUrl } from "../../../../utils/rewriteAssetUrl";

export const transformMerchantsData = (merchants) => {
  return merchants.map((merchant) => ({
    name: merchant.merchant_name,
    image_icon: rewriteAssetUrl(merchant.merchant_logo),
    id: merchant.merchant_id,
  }));
};
