import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLocations, setLocationsLoading } from "./locations-actions";
import { locationsApi } from "./locations-api";
import { transformLocationDataFromBackend } from "../../helpers";

export const getLocations = () => async (dispatch, getState) => {
  try {
    dispatch(setLocationsLoading(true));
    const token = await AsyncStorage.getItem("token");
    const { user } = getState().authReducer;

    const res = await locationsApi.getLocations({
      token,
      customer_id: user.partner_id,
    });

    const result = res.data.result;

    dispatch(setLocations(transformLocationDataFromBackend(result)));
  } catch (err) {
    console.log(err, "err");
  } finally {
    dispatch(setLocationsLoading(false));
  }
};

export const createLocation =
  (body, onSuccess, onError) => async (dispatch, getState) => {
    try {
      dispatch(setLocationsLoading(true));
      const token = await AsyncStorage.getItem("token");
      const { user } = getState().authReducer;

      const res = locationsApi.createLocation({
        token,
        customer_id: user.partner_id,
        ...body,
      });

      dispatch(getLocations());
      onSuccess?.();
    } catch (err) {
      console.log(err, "err");
      onError?.();
    } finally {
      dispatch(setLocationsLoading(false));
    }
  };
