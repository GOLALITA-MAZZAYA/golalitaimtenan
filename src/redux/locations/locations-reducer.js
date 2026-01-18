import { SET_LOCATIONS, SET_LOCATIONS_LOADING } from "./locations-types";

const initialState = {
  locations: [],
  loading: false,
};

export const locationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATIONS:
      return { ...state, locations: action.locations };
    case SET_LOCATIONS_LOADING:
      return { ...state, loading: action.loading };

    default:
      return state;
  }
};
