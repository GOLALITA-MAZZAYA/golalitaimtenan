import { getFavouriteMerchants } from "../../api/merchants";
import {
  setFavouriteMerchants,
  setFavouriteMerchantsLoading,
} from "./favourite-merchants-actions";

export const getFavouriteMerchantsList = () => async (dispatch, getState) => {
  try {
    dispatch(setFavouriteMerchantsLoading(true));

    const { user } = getState().authReducer;

    const data = await getFavouriteMerchants(user.partner_id);
    dispatch(setFavouriteMerchants(data.merchants));
  } catch (err) {
    console.log(err, 'getFavouriteMerchantsList error');
  } finally {
    dispatch(setFavouriteMerchantsLoading(false));
  }
};
