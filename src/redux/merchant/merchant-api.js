import instance from "../instance";

export const merchantApi = {
  getCategories: (body) => instance.post("/partner.category/search", body),
  getParentCategories: (body) => instance.post("/parent/category/v2", body),
  getParentCategoriesById: (body) => instance.post("/child/category/v2", body),
  getMerchant: (body) => instance.post("/res.partner/search", body),
  getAllMerchant: (body) =>
    instance.post("/user/category/merchant/lists", body),
  getAllMerchantSearch: (body) =>
    instance.post("/user/category/merchant/lists/new_backend", body),
  getMerchantDetails: (body) => instance.post("/user/merchant/details", body),
  getOffers: (body) => instance.post("/user/offers/v2", body),
  getNewOffers: (body) => instance.post("/user/offers/golalita/v3", body),
  getVouchers: () => instance.post("/user/voucher/list"),
  getProducts: (body) => instance.post("/product.template/search", body),
  getProductById: (body) => instance.post("user/offers/product/v2", body),
  getFavoriteOffers: (body) => instance.post("/get/favourite/products", body),
  getOrganizations: (body) => instance.post("/user/org/lists", body),
  getOrganizationDetails: (body) => instance.post("/user/org/details", body),
  bookNow: (body) => instance.post("/merchant/hotel/enquiry", body),
  deleteAccount: (body) => instance.post("/user/account/delete", body),
  getAdvert: (body) => instance.post("/advertisement/banner", body),
  trackBanner: (body) => instance.post("/advertisement_tracking", body),
  getSocialMedia: (body) => instance.post("/user/social/v2", body),
  saveOffer: (body) => instance.post("/save/offer/as/favourite", body),
  saveMerchant: (body) => instance.post("/save/merchant/as/favourite", body),
  removeMerchant: (body) => instance.post("/remove/favourite/merchant", body),
  track: (body) => instance.post("/merchant/track/v2", body),
  sendEmail: (body) => instance.post("/send/mail/v2", body),
  redeem: (body) => instance.post("/merchant/redeem/v2", body),

  changePassword: (body) => instance.post("/user/pass/update/v2", body),
};
