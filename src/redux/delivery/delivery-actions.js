import {
  SET_RESTAURANTS,
  SET_RESTAURANTS_LOADING,
  SET_RESTAURANTS_ITEMS,
  SET_RESTAURANTS_CATEGORIES,
  SET_DELIVERY_LOCATION,
  SET_RESTAURANT_PRODUCTS_CATEGORIES,
  SET_SELECTED_MERCHANT,
} from "./delivery-types";

export const setRestaurants = (restaurnts) => ({
  type: SET_RESTAURANTS,
  restaurnts,
});

export const setRestaurantsLoading = (payload) => ({
  type: SET_RESTAURANTS_LOADING,
  payload,
});

export const setRestaurantsItems = (restaurantsItems) => ({
  type: SET_RESTAURANTS_ITEMS,
  restaurantsItems,
});

export const setRestaurantsCategories = (restaurantsCategories) => ({
  type: SET_RESTAURANTS_CATEGORIES,
  restaurantsCategories,
});

export const setDeliveryLocation = (location) => ({
  type: SET_DELIVERY_LOCATION,
  location,
});

export const setRestaurantProductsCategories = (categories) => ({
  type: SET_RESTAURANT_PRODUCTS_CATEGORIES,
  categories,
});

export const setSelectedMerchant = (merchant) => ({
  type: SET_SELECTED_MERCHANT,
  merchant,
});
