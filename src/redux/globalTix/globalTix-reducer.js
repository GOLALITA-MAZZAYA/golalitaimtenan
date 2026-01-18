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
import {
  ADD_TO_GLOBALTIX_CART,
  REMOVE_FROM_GLOBALTIX_CART,
  UPDATE_GLOBALTIX_CART_QUANTITY,
  CLEAR_GLOBALTIX_CART,
  CALCULATE_GLOBALTIX_CART_TOTAL,
} from "./globalTix-cart-types";
import globalTixCartReducer from "./globalTix-cart-reducer";

// Initial state
const initialState = {
  // Products
  products: [],
  totalProducts: 0,
  currentPage: 1,
  hasMore: true,
  
  // Product details
  selectedProduct: null,
  productOptions: [],
  
  // Countries, categories and cities
  countries: [],
  categories: [],
  cities: [],
  
  // Filters
  filters: {
    countryCode: undefined,
    categoryIds: undefined,
    cityIds: undefined,
    searchText: '',
    priceRange: { min: 0, max: 10000 },
    sortBy: 'name', // name, price, rating
    sortOrder: 'asc', // asc, desc
  },
  
  // UI State
  loading: false,
  loadingMore: false,
  error: null,
  
  // Booking state
  booking: {
    selectedTickets: [],
    customerInfo: {},
    visitDate: null,
    visitTime: null,
  },
  
  // Favorites
  favorites: [],
  
  // Cart
  cart: {
    cartItems: {},
    totalPrice: 0,
    totalQuantity: 0,
    subtotal: 0,
  },
  
  // Payment data
  paymentDataGlobal: null,
};

// Reducer
export const globalTixReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return { ...state, products: action.products };
      
    case SET_TOTAL_PRODUCTS:
      return { ...state, totalProducts: action.total };
      
    case SET_HAS_MORE:
      return { ...state, hasMore: action.hasMore };
      
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.page };
      
    case SET_LOADING:
      return { ...state, loading: action.loading };
      
    case SET_LOADING_MORE:
      return { ...state, loadingMore: action.loadingMore };
      
    case SET_ERROR:
      return { ...state, error: action.error };
      
    case CLEAR_ERROR:
      return { ...state, error: null };
      
    case SET_GLOBALTIX_PAYMENT_DATA:
      return { ...state, paymentDataGlobal: action.paymentData };
      
    case SET_SELECTED_PRODUCT:
      return { ...state, selectedProduct: action.product };
      
    case SET_PRODUCT_OPTIONS:
      return { ...state, productOptions: action.options };
      
    case SET_COUNTRIES:
      return { ...state, countries: action.countries };
      
    case SET_CATEGORIES:
      return { ...state, categories: action.categories };
      
    case SET_CITIES:
      return { ...state, cities: action.cities };
      
    case SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.filters },
        currentPage: 1 // Reset to first page when filters change
      };
      
    case CLEAR_FILTERS:
      return { 
        ...state, 
        filters: initialState.filters,
        currentPage: 1
      };
      
    case SET_FAVORITES:
      return { ...state, favorites: action.favorites };
      
    case ADD_TO_FAVORITES:
      if (!state.favorites.find(item => item.id === action.product.id)) {
        return { 
          ...state, 
          favorites: [...state.favorites, action.product] 
        };
      }
      return state;
      
    case REMOVE_FROM_FAVORITES:
      return { 
        ...state, 
        favorites: state.favorites.filter(item => item.id !== action.productId) 
      };
      
    case SET_BOOKING:
      return { ...state, booking: action.booking };
      
    case UPDATE_BOOKING:
      return { 
        ...state, 
        booking: { ...state.booking, ...action.updates } 
      };
      
    // Cart actions
    case ADD_TO_GLOBALTIX_CART:
    case REMOVE_FROM_GLOBALTIX_CART:
    case UPDATE_GLOBALTIX_CART_QUANTITY:
    case CLEAR_GLOBALTIX_CART:
    case CALCULATE_GLOBALTIX_CART_TOTAL:
      return {
        ...state,
        cart: globalTixCartReducer(state.cart, action),
      };
      
    default:
      return state;
  }
};

