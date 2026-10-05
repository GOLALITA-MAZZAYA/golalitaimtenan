import { rewriteAssetUrl } from "../../../../utils/rewriteAssetUrl";

export const transformBrandsData = (brands) => {
  return brands.map((brand) => ({
    name: brand.merchant_name,
    image_icon: rewriteAssetUrl(brand.merchant_logo),
    id: brand.merchant_id,
    parent_id: [18],
  }));
};
