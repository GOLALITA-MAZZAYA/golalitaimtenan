import {
  SET_RESTAURANTS,
  SET_RESTAURANTS_LOADING,
  SET_RESTAURANTS_ITEMS,
  SET_RESTAURANTS_CATEGORIES,
  SET_DELIVERY_LOCATION,
  SET_RESTAURANT_PRODUCTS_CATEGORIES,
  SET_SELECTED_MERCHANT,
} from "./delivery-types";

const initialState = {
  restaurantsLoading: false,
  restaurants: [],
  restaurantsItems: [],
  restaurantsCategories: null,
  restaurantProductCategories: null,
  deliveryLocation: null,
  selectedMerchant: null,
};
export const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RESTAURANTS: {
      return { ...state, restaurants: action.restaurnts };
    }
    case SET_RESTAURANTS_LOADING: {
      return { ...state, restaurantsLoading: action.payload };
    }
    case SET_RESTAURANTS_ITEMS: {
      return { ...state, restaurantsItems: action.restaurantsItems };
    }
    case SET_RESTAURANTS_CATEGORIES: {
      return { ...state, restaurantsCategories: action.restaurantsCategories };
    }
    case SET_DELIVERY_LOCATION: {
      return { ...state, deliveryLocation: action.location };
    }
    case SET_RESTAURANT_PRODUCTS_CATEGORIES: {
      return { ...state, restaurantProductCategories: action.categories };
    }
    case SET_SELECTED_MERCHANT: {
      return { ...state, selectedMerchant: action.merchant };
    }
    default:
      return state;
  }
};
