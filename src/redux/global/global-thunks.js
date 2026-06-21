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

export const getMarketingPopupThunk = () => async (dispatch, getState) => {
  const { hasShownMarketingPopup } = getState().globalReducer;
  
  if (hasShownMarketingPopup) {
    return;
  }

  try {
    const response = await getMarketingPopup();
    
    // Set flag to true so we don't try to fetch and show it again this session
    dispatch(setHasShownMarketingPopup(true));
    
    const popupData = response && response.data ? response.data : response;
    
    if (popupData && popupData.active) {
      dispatch(setMarketingPopup(popupData));
    }
  } catch (e) {
    console.log("get marketing popup error:", e);
    // Setting it to true ensures the app doesn't get stuck in splash/loading screen on error
    dispatch(setHasShownMarketingPopup(true));
  }
};
