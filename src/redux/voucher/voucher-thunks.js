import {
  getVouchers as getVouchersApi,
  getVoucher as getVoucherApi,
  getFavouriteVouchers,
  unsaveVoucher,
  saveVoucher as saveVoucherRequest,
  getPurchasedVouchers as getPurchasedVouchersApi,
} from "../../api/vouchers";
import {
  setFavouriteVouchers,
  setPurchasedVouchers,
  setPurchasedVouchersError,
  setPurchasedVouchersLoading,
  setVoucher,
  setVoucherError,
  setVoucherLoading,
  setVouchers,
  setVouchersError,
  setVouchersLoading,
} from "./voucher-actions";

export const getVouchers = () => async (dispatch) => {
  dispatch(setVouchersLoading(true));

  try {
    const favouriteVouchers = await getFavouriteVouchers();
    const data = await getVouchersApi();

    if (favouriteVouchers) {
      dispatch(setFavouriteVouchers(favouriteVouchers));
    }

    if (data) {
      dispatch(setVouchers(data));
    }
  } catch (err) {
    console.log(err, "err");
    setVouchersError("Get vouchers error");
  } finally {
    dispatch(setVouchersLoading(false));
  }
};

export const getPurchasedVouchers = () => async (dispatch) => {
  dispatch(setPurchasedVouchersLoading(true));

  try {
    const data = await getPurchasedVouchersApi();

    if (data) {
      dispatch(setPurchasedVouchers(data));
    }
  } catch (err) {
    console.log(err, "err");
    setPurchasedVouchersError("Get purchased vouchers error");
  } finally {
    dispatch(setPurchasedVouchersLoading(false));
  }
};

export const getVoucher = (code) => async (dispatch) => {
  dispatch(setVoucherLoading(true));

  try {
    const data = await getVoucherApi(code);

    if (data) {
      dispatch(setVoucher(data));
    }
  } catch (err) {
    console.log(err, "err");
    setVoucherError("Get vouchers error");
  } finally {
    dispatch(setVoucherLoading(false));
  }
};

export const saveVoucher = (code) => async (dispatch, getState) => {
  const { favouriteVouchers } = getState().voucherReducer;
  const isActive = favouriteVouchers?.find((item) => item.code === code);

  try {
    if (isActive) {
      await unsaveVoucher(code);
    } else {
      await saveVoucherRequest(code);
    }

    const data = await getFavouriteVouchers();

    if (data) {
      dispatch(setFavouriteVouchers(data));
    }
  } catch (err) {
    console.log(err, "err");
  }
};
