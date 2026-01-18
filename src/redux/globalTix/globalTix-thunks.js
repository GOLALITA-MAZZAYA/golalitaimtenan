import { globalTixAPI } from "./globalTix-api";
import { setCountries } from "./globalTix-actions";

export const getGlobalTixCountries = () => async (dispatch) => {
  try {
    const response = await globalTixAPI.fetchCountries();

    if (response.success && response.data) {
      dispatch(setCountries(response.data));
    } else {
      throw new Error("Failed to fetch GlobalTix countries");
    }
  } catch (e) {
    console.log('Error loading GlobalTix countries:', e);
  }
};
