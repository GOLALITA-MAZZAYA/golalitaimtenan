import { setLocations, setLocationsLoading } from "./locations-actions";
import { locationsApi } from "./locations-api";
import { transformLocationDataFromBackend } from "../../helpers";
import { getAuthToken } from '../../utils/tokenStorage';

export const getLocations = () => async (dispatch, getState) => {
  try {
    dispatch(setLocationsLoading(true));
    const token = await getAuthToken();
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
      const token = await getAuthToken();
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
