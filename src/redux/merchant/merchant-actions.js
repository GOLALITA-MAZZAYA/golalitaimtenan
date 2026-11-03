import {
  SET_ADVERT,
  SET_FAVORITE_OFFERS,
  SET_MERCHANT_DETAILS,
  SET_MERCHANT_OFFERS,
  SET_MERCHANTS,
  SET_OFFERS,
  SET_PREMIUM_MERCHANTS,
  SET_PARENT_CATEGORIES,
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

export const setMerchantDetails = (merchantDetails) => ({
  type: SET_MERCHANT_DETAILS,
  merchantDetails,
});

export const setMerchantDetailsLoading = (loading) => ({
  type: SET_MERCHANT_DETAILS_LOADING,
  loading,
});

export const setFavoriteOffers = (favoriteOffers) => ({
  type: SET_FAVORITE_OFFERS,
  favoriteOffers,
});

export const setAdvert = (advert) => ({ type: SET_ADVERT, advert });
