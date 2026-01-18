import {
  SET_ADVERT,
  SET_CATEGORIES,
  SET_CURRENT_VIDEO,
  SET_FAVORITE_OFFERS,
  SET_INTERNATIONAL_CLIENTS,
  SET_LOCAL_CLIENTS,
  SET_MERCHANT_DETAILS,
  SET_MERCHANT_OFFERS,
  SET_MERCHANT_PRODUCTS,
  SET_MERCHANTS,
  SET_OFFERS,
  SET_ORGANIZATIONS,
  SET_PREMIUM_BANNERS,
  SET_PREMIUM_MERCHANTS,
  SET_SOCIAL_MEDIA,
  SET_PREMIUM_BANNERS_LOADING,
  SET_PARENT_CATEGORIES,
  SET_TRAVEL_CATEGORIES,
  SET_MERCHANT_DETAILS_LOADING,
  SET_PARENT_CATEGORIES_LOADING,
  SET_CATEGORIES_TYPE,
} from "./merchant-types";

export const setMerchants = (merchants) => ({ type: SET_MERCHANTS, merchants });

export const setPremiumMerchants = (premiumMerchants) => ({
  type: SET_PREMIUM_MERCHANTS,
  premiumMerchants,
});
export const setOffers = (offers) => ({ type: SET_OFFERS, offers });

export const setMerchantOffers = (merchantOffers) => ({
  type: SET_MERCHANT_OFFERS,
  merchantOffers,
});
export const setCategories = (categories) => ({
  type: SET_CATEGORIES,
  categories,
});

export const setCategoriesType = (categoriesType) => ({
  type: SET_CATEGORIES_TYPE,
  categoriesType,
});

export const setParentCategories = (parentCategories) => ({
  type: SET_PARENT_CATEGORIES,
  parentCategories,
});

export const setParentCategoriesLoading = (loading) => ({
  type: SET_PARENT_CATEGORIES_LOADING,
  loading,
});

export const setTravelCategories = (travelCategories) => ({
  type: SET_TRAVEL_CATEGORIES,
  travelCategories,
});
export const setMerchantDetails = (merchantDetails) => ({
  type: SET_MERCHANT_DETAILS,
  merchantDetails,
});

export const setMerchantDetailsLoading = (loading) => ({
  type: SET_MERCHANT_DETAILS_LOADING,
  loading,
});

export const setMerchantProducts = (merchantProducts) => ({
  type: SET_MERCHANT_PRODUCTS,
  merchantProducts,
});
export const setFavoriteOffers = (favoriteOffers) => ({
  type: SET_FAVORITE_OFFERS,
  favoriteOffers,
});
export const setPremiumBannersLoading = (premiumBanners) => ({
  type: SET_PREMIUM_BANNERS_LOADING,
  premiumBanners,
});
export const setPremiumBanners = (premiumBanners) => ({
  type: SET_PREMIUM_BANNERS,
  premiumBanners,
});
export const setLocalClients = (localClients) => ({
  type: SET_LOCAL_CLIENTS,
  localClients,
});
export const setInternationalClients = (internationalClients) => ({
  type: SET_INTERNATIONAL_CLIENTS,
  internationalClients,
});
export const setOrganizations = (organizations) => ({
  type: SET_ORGANIZATIONS,
  organizations,
});

export const setAdvert = (advert) => ({ type: SET_ADVERT, advert });
export const setCurrentVideo = (currentVideo) => ({
  type: SET_CURRENT_VIDEO,
  currentVideo,
});
export const setSocialMedia = (socialMedia) => ({
  type: SET_SOCIAL_MEDIA,
  socialMedia,
});
