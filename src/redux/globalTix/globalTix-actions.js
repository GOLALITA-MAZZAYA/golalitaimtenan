import {
  SET_PRODUCTS,
  SET_LOADING,
  SET_LOADING_MORE,
  SET_ERROR,
  SET_SELECTED_PRODUCT,
  SET_PRODUCT_OPTIONS,
  SET_COUNTRIES,
  SET_CATEGORIES,
  SET_CITIES,
  SET_FILTERS,
  CLEAR_FILTERS,
  SET_FAVORITES,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  SET_BOOKING,
  UPDATE_BOOKING,
  SET_TOTAL_PRODUCTS,
  SET_HAS_MORE,
  SET_CURRENT_PAGE,
  CLEAR_ERROR,
  SET_GLOBALTIX_PAYMENT_DATA,
} from "./globalTix-types";

// Product Actions
export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  products,
});

export const setTotalProducts = (total) => ({
  type: SET_TOTAL_PRODUCTS,
  total,
});

export const setHasMore = (hasMore) => ({
  type: SET_HAS_MORE,
  hasMore,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  page,
});

// Loading and Error Actions
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});

export const setLoadingMore = (loadingMore) => ({
  type: SET_LOADING_MORE,
  loadingMore,
});

export const setError = (error) => ({
  type: SET_ERROR,
  error,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

// Product Details Actions
export const setSelectedProduct = (product) => ({
  type: SET_SELECTED_PRODUCT,
  product,
});

export const setProductOptions = (options) => ({
  type: SET_PRODUCT_OPTIONS,
  options,
});

// Countries Actions
export const setCountries = (countries) => ({
  type: SET_COUNTRIES,
  countries,
});

// Categories Actions
export const setCategories = (categories) => ({
  type: SET_CATEGORIES,
  categories,
});

// Cities Actions
export const setCities = (cities) => ({
  type: SET_CITIES,
  cities,
});

// Filter Actions
export const setFilters = (filters) => ({
  type: SET_FILTERS,
  filters,
});

export const clearFilters = () => ({
  type: CLEAR_FILTERS,
});

// Favorites Actions
export const setFavorites = (favorites) => ({
  type: SET_FAVORITES,
  favorites,
});

export const addToFavorites = (product) => ({
  type: ADD_TO_FAVORITES,
  product,
});

export const removeFromFavorites = (productId) => ({
  type: REMOVE_FROM_FAVORITES,
  productId,
});

// Booking Actions
export const setBooking = (booking) => ({
  type: SET_BOOKING,
  booking,
});

export const updateBooking = (updates) => ({
  type: UPDATE_BOOKING,
  updates,
});

// Payment Actions
export const setGlobalTixPaymentData = (paymentData) => ({
  type: SET_GLOBALTIX_PAYMENT_DATA,
  paymentData,
});

