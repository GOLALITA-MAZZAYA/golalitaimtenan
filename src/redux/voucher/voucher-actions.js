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

export const setVouchers = (vouchers) => ({
  type: SET_VOUCHERS,
  vouchers,
});

export const setFavouriteVouchers = (vouchers) => ({
  type: SET_FAVOURITE_VOUCHERS,
  vouchers,
});

export const setVouchersLoading = (loading) => ({
  type: SET_VOUCHERS_LOADING,
  loading,
});

export const setVouchersError = (error) => ({
  type: SET_VOUCHERS_ERROR,
  error,
});

export const setVoucher = (vouchers) => ({
  type: SET_VOUCHER,
  vouchers,
});

export const setVoucherLoading = (loading) => ({
  type: SET_VOUCHER_LOADING,
  loading,
});

export const setVoucherError = (error) => ({
  type: SET_VOUCHER_ERROR,
  error,
});

export const setPurchasedVouchers = (vouchers) => ({
  type: SET_PURCHASED_VOUCHERS,
  vouchers,
});

export const setPurchasedVouchersLoading = (loading) => ({
  type: SET_PURCHASED_VOUCHERS_LOADING,
  loading,
});

export const setPurchasedVouchersError = (loading) => ({
  type: SET_PURCHASED_VOUCHERS_ERROR,
  loading,
});
