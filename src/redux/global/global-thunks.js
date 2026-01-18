import { getAllCountries } from "../../api/global";
import getUserLocation from "../../helpers";
import { setCountries, setUserLocation, setUserLocationLoading } from "./global-actions";

export const getCountries = () => async (dispatch) => {
  try {
    const countries = await getAllCountries();

    dispatch(setCountries(countries));

    if (!countries) {
      throw "Get countries error";
    }
  } catch (e) {
    console.log(e);
  }
};

export const getUserLocationThunk = () => async (dispatch) => {
  try {

      dispatch(setUserLocationLoading(true));

      const data = await getUserLocation();


      dispatch(setUserLocation(data?.location));

  } catch (e) {
    console.log('get user location thunk error', e)
  }finally {
      dispatch(setUserLocationLoading(false));
  }
};
