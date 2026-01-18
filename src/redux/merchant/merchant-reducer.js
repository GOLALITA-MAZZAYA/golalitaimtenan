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
  SET_PARENT_CATEGORIES,
  SET_TRAVEL_CATEGORIES,
  SET_MERCHANT_DETAILS_LOADING,
  SET_PARENT_CATEGORIES_LOADING,
  SET_CATEGORIES_TYPE,
} from "./merchant-types";

const initialState = {
  merchants: [],
  merchantsPage: 1,
  premiumMerchants: [],

  offers: [],
  currentOffer: [],
  currentOfferLoading: false,
  offersPage: 1,
  merchantIdsToGroup: {},

  merchantOffers: [],

  categories: [],
  parentCategoriesLoading: false,
  parentCategories: null,
  categoriesType: "local",
  travelCategories: null,

  merchantDetails: null,
  merchantDetailsLoading: false,
  merchantProducts: [],
  merchantProductsPage: 1,

  favoriteOffers: [],
  premiumBannersLoading: false,
  premiumBanners: [],
  premiumBannersPage: 1,
  localClients: [],
  internationalClients: [],
  organizations: [],
  advert: null,
  currentVideo: 0,
  socialMedia: null,
};

export const merchantReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MERCHANTS:
      const { data = [], concat = false, page = 1 } = action.merchants;

      return {
        ...state,
        merchants: concat ? state.merchants.concat(data) : data,
        searchedMerchants: [],
        merchantsPage: page,
      };

    case SET_PREMIUM_MERCHANTS:
      return { ...state, premiumMerchants: action.premiumMerchants };
    case SET_OFFERS:
      const {
        data: offfers = [],
        concat: offersConcat = false,
        page: offersPage = 1,
      } = action.offers;

      return {
        ...state,
        offers: offersConcat ? state.offers.concat(offfers) : offfers,
        offersPage,
        merchantIdsToGroup: action.offers.merchantIdsToGroup
      };
    case SET_MERCHANT_OFFERS:
      return { ...state, merchantOffers: action.merchantOffers };
    case SET_CATEGORIES:
      return { ...state, categories: action.categories };
    case SET_CATEGORIES_TYPE:
      return { ...state, categoriesType: action.categoriesType };
    case SET_PARENT_CATEGORIES:
      return { ...state, parentCategories: action.parentCategories };
    case SET_PARENT_CATEGORIES_LOADING:
      return { ...state, parentCategoriesLoading: action.loading };
    case SET_TRAVEL_CATEGORIES:
      return { ...state, travelCategories: action.travelCategories };
    case SET_MERCHANT_DETAILS_LOADING:
      return { ...state, merchantDetailsLoading: action.loading };
    case SET_MERCHANT_DETAILS:
      return { ...state, merchantDetails: action.merchantDetails };
    case SET_MERCHANT_PRODUCTS:
      const { merchantProducts, merchantProductsPage } =
        action.merchantProducts;
      return {
        ...state,
        merchantProducts:
          page === 1
            ? merchantProducts
            : state.merchantProducts.concat(merchantProducts),
        merchantProductsPage,
      };
    case SET_FAVORITE_OFFERS:
      return { ...state, favoriteOffers: action.favoriteOffers };
    case SET_PREMIUM_BANNERS:
      const {
        data: premiumBanners = [],
        concat: premiumBannersConcat = false,
        page: premiumBannersPage = 1,
      } = action.premiumBanners;

      return {
        ...state,
        premiumBanners: premiumBannersConcat
          ? state.premiumBanners.concat(premiumBanners)
          : premiumBanners,
        premiumBannersPage: premiumBannersPage,
        premiumBannersLoading: false,
      };

    case SET_LOCAL_CLIENTS:
      return { ...state, localClients: action.localClients };
    case SET_INTERNATIONAL_CLIENTS:
      return { ...state, internationalClients: action.internationalClients };
    case SET_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.organizations,
        searchedOrganizations: [],
      };
    case SET_ADVERT:
      return { ...state, advert: action.advert };
    case SET_CURRENT_VIDEO:
      return { ...state, currentVideo: action.currentVideo };
    case SET_SOCIAL_MEDIA:
      return { ...state, socialMedia: action.socialMedia };
    default:
      return state;
  }
};
