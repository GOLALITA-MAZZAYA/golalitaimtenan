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

export const getUserLocationThunk = () => async (dispatch, getState) => {
  if (getState().globalReducer.userLocation) {
    return;
  }

  try {
    dispatch(setUserLocationLoading(true));

    const data = await getUserLocation();

    if (data?.location) {
      dispatch(setUserLocation(data.location));
    }
  } catch (e) {
    console.log('get user location thunk error', e)
  } finally {
    dispatch(setUserLocationLoading(false));
  }
};

const getActivePopups = (response) =>
  (Array.isArray(response?.data) ? response.data : []).filter(
    (item) => item && item.active !== false,
  );

// Home's Local side is always Qatar (see getAdvert in merchant-thunks.js).
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
    // Keep Qatar popups and ones with no country restriction; drop any
    // targeted at another country.
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
    // Set flag to true so we don't try to fetch and show it again this session.
    // Also on failure: MainScreen waits on this flag before rendering.
    dispatch(setHasShownMarketingPopup(true));
  }
};

// Popups for one Global country screen (e.g. K.S.A). Returned rather than
// stored so they don't mix with the Home screen's popups. The API also sends
// popups with no country restriction, so keep only the ones targeting it.
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
