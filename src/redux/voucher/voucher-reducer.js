import {
  SET_FAVOURITE_VOUCHERS,
  SET_PURCHASED_VOUCHERS,
  SET_PURCHASED_VOUCHERS_ERROR,
  SET_PURCHASED_VOUCHERS_LOADING,
  SET_VOUCHER,
  SET_VOUCHERS,
  SET_VOUCHERS_ERROR,
  SET_VOUCHERS_LOADING,
  SET_VOUCHER_ERROR,
  SET_VOUCHER_LOADING,
} from "./voucher-types";

const initialState = {
  vouchers: [],
  favouriteVouchers: [],
  loading: false,
  error: null,
  voucher: null,
  voucherLoading: false,
  voucherError: null,

  purchasedVouchers: [],
  purchasedVouchersLoading: false,
  purchasedVouchersError: false,
};

export const voucherReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VOUCHERS:
      return {
        ...state,
        vouchers: action.vouchers,
        error: null,
      };

    case SET_FAVOURITE_VOUCHERS:
      return {
        ...state,
        favouriteVouchers: action.vouchers,
        error: null,
      };

    case SET_VOUCHERS_LOADING:
      return {
        ...state,
        loading: action.loading,
      };

    case SET_VOUCHERS_ERROR:
      return {
        ...state,
        error: action.error,
      };

    case SET_VOUCHER:
      return {
        ...state,
        voucher: action.vouchers,
        voucherError: null,
      };

    case SET_VOUCHER_LOADING:
      return {
        ...state,
        voucherLoading: action.loading,
      };

    case SET_VOUCHER_ERROR:
      return {
        ...state,
        voucherError: action.error,
      };

    case SET_PURCHASED_VOUCHERS:
      return {
        ...state,
        purchasedVouchers: action.vouchers,
        error: null,
      };

    case SET_PURCHASED_VOUCHERS_LOADING:
      return {
        ...state,
        purchasedVouchersLoading: action.loading,
      };

    case SET_PURCHASED_VOUCHERS_ERROR:
      return {
        ...state,
        purchasedVouchersError: action.error,
      };

    default:
      return state;
  }
};
