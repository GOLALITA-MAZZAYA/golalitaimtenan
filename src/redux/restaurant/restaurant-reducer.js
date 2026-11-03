import {
  ADD_FOOD_ITEM_TO_FORM,
  REMOVE_FOOD_ITEM_FROM_FORM,
  CLEAR_RESTAURANT_STATE,
  SET_ORDER_TYPE,
  SET_RESERVATION_FIELD,
  SET_RESERVATION_FIELDS,
  SET_RESTAURANT_LOADING,
  SET_DELIVERY_FIELD,
  SET_DELIVERY_FIELDS,
  SET_TAKEAWAY_FIELD
} from "./restaurant-types";

import { OCCASION_CONSTANTS } from "../../MainScreens/LoyaltyPoints/Restaurants/RestaurantBookTable/config";
import { getDateString } from "../../MainScreens/LoyaltyPoints/Restaurants/RestaurantBookTable/helpers";

const initialState = {
  loading: false,
  order_type: 'reservation',

  reservation: {
    restaurant_id: null,
    date: getDateString(new Date()),
    time: "",
    guests: 1,
    child_count: 0,
    seating_preference_id: '',
    occasion: OCCASION_CONSTANTS.CASUAL,
    special_request: '',
    items: []
  },

  delivery: {
    items: [],
    customer_name: '',
    unit_number: '',
    building_number: '',
    zone_number: '',
    street_number: '',
    latitude: '',
    longitude: '',
    order_type: 'delivery'
  },

  takeaway: {
    items: [],
    special_instructions: '',
    customer_phone: '',
    customer_name: '',
    restaurant_id: '',
    order_type: 'takeaway'
  }
};

export const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_ORDER_TYPE: {
      return {
        ...initialState,
        order_type: action.payload,
      };
    }

    case SET_RESTAURANT_LOADING: {
      return {
        ...state,
        order_type: state.order_type,
        loading: action.loading
      };
    }

    case SET_RESERVATION_FIELD: {
      return {
        ...state,
        reservation: {
          ...state.reservation,
          [action.payload.name]: action.payload.value
        }
      };
    }

    case SET_TAKEAWAY_FIELD: {
      return {
        ...state,
        takeaway: {
          ...state.takeaway,
          [action.payload.name]: action.payload.value
        }
      };
    }

    case SET_DELIVERY_FIELD: {
      return {
        ...state,
        delivery: {
          ...state.delivery,
          [action.payload.name]: action.payload.value
        }
      };
    }


    case SET_RESERVATION_FIELDS: {
      return {
        ...state,
        reservation: {
          ...state.reservation,
          ...action.data
        }
      };
    }

    case SET_DELIVERY_FIELDS: {
      return {
        ...state,
        delivery: {
          ...state.delivery,
          ...action.data
        }
      };
    }

    case ADD_FOOD_ITEM_TO_FORM: {
      const { name, item } = action.payload;
      const currentItems = state[name].items;

      const existingItem = currentItems.find(i => i.id === item.id);

      return {
        ...state,
        order_type: state.order_type,
        [name]: {
          ...state[name],
          items: existingItem
            ? currentItems.map(i =>
                i.id === item.id
                  ? { ...i, quantity: (i.quantity || 0) + 1 }
                  : i
              )
            : [
                ...currentItems,
                { ...item, quantity: 1 }
              ]
        }
      };
    }

    case REMOVE_FOOD_ITEM_FROM_FORM: {
      const { name, item } = action.payload;
      const currentItems = state[name].items;

      return {
        ...state,
        order_type: state.order_type,
        [name]: {
          ...state[name],
          items: currentItems
            .map(i =>
              i.id === item.id
                ? { ...i, quantity: Math.max((i.quantity || 0) - 1, 0) }
                : i
            )
            .filter(i => i.quantity > 0)
        }
      };
    }

    case CLEAR_RESTAURANT_STATE: {
      return initialState;
    }

    default:
      return state;
  }
};