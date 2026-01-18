import { getFavouriteMerchants } from "../../api/merchants";
import {
  setFavouriteMerchants,
  setFavouriteMerchantsLoading,
} from "./favourite-merchants-actions";

export const getFavouriteMerchantsList = () => async (dispatch, getState) => {
  dispatch(setFavouriteMerchantsLoading(true));

  const { user } = getState().authReducer;

  const data = await getFavouriteMerchants(user.partner_id);
  dispatch(setFavouriteMerchants(data.merchants));

  dispatch(setFavouriteMerchantsLoading(false));
};
