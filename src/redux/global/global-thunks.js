import { getAllCountries } from "../../api/global";
import { getMarketingPopup } from "../../api/marketing";
import getUserLocation from "../../helpers";
import { setCountries, setUserLocation, setUserLocationLoading, setMarketingPopup, setHasShownMarketingPopup } from "./global-actions";

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

const getActivePopups = (response) =>
  (Array.isArray(response?.data) ? response.data : []).filter(
    (item) => item && item.active !== false,
  );

const HOME_COUNTRY_CODE = 'QA';

const targetsCountry = (item, code) =>
  (item.country_codes || []).some((c) => String(c).toUpperCase() === code);

export const getMarketingPopupThunk = () => async (dispatch, getState) => {
  const { hasShownMarketingPopup } = getState().globalReducer;

  if (hasShownMarketingPopup) {
    return;
  }

  try {
    const response = await getMarketingPopup({ country: HOME_COUNTRY_CODE });
    const popups = getActivePopups(response).filter(
      (item) =>
        !(item.country_codes || []).length ||
        targetsCountry(item, HOME_COUNTRY_CODE),
    );

    if (popups.length > 0) {
      dispatch(setMarketingPopup(popups));
    }
  } catch (e) {
    console.log("get marketing popup error:", e);
  } finally {
    dispatch(setHasShownMarketingPopup(true));
  }
};

export const getCountryMarketingPopups = (countryCode) => async () => {
  try {
    const code = String(countryCode).toUpperCase();
    const response = await getMarketingPopup({ country: code });

    return getActivePopups(response).filter((item) =>
      targetsCountry(item, code),
    );
  } catch (e) {
    console.log("get country marketing popup error:", e);
    return [];
  }
};
