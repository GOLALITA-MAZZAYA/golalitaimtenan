export const transformBrandsData = (brands) => {
  return brands.map((brand) => ({
    name: brand.merchant_name,
    image_icon: brand.merchant_logo,
    id: brand.merchant_id,
    parent_id: [18],
  }));
};
