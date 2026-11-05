import { transactionsApi } from "./transactions-api";
import {
  setFamilyMembers,
  setFamilyMembersLoading,
} from "./transactions-actions";
import { getUserData } from "../auth/auth-thunks";
import { CONTENT_DISABLED } from "../auth/auth-types";
import { showMessage } from "react-native-flash-message";
import i18n from "../../languages";


export const getFamilyMembers = () => async (dispatch, getState) => {
  const { workStatus } = getState().authReducer;
  const { user, token } = getState().authReducer;

  try {
    dispatch(setFamilyMembersLoading(true));

    const res = await transactionsApi.getFamilyMembers({
      params: {
        token,
        domain: `[['family_head_member_id', '=',${user.partner_id} ]]`,
        fields:
          "['id','family_head_member_id','name','phone','email', 'image_url', 'barcode', 'create_date', 'x_user_expiry', 'image_1920', 'points','x_moi_last_name' ]",
      },
    });

    console.log(res.data, "res data");

    // The API can reply with an error object and no `result`; keep the list an array.
    const members = Array.isArray(res?.data?.result) ? res.data.result : [];
    dispatch(
      setFamilyMembers(workStatus === CONTENT_DISABLED ? [] : members)
    );
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(setFamilyMembersLoading(false));
  }
};



export const addFamilyMember =
  (body, navigation, onError) => async (dispatch, getState) => {
    const { token } = getState().authReducer;

    try {
      const res = await transactionsApi.addFamilyMember({
        params: {
          ...body,
          token,
        },
      });

      if (res.data?.error?.data?.message || res?.data?.result?.error) {
        onError(res.data?.error?.data?.message || res?.data?.result?.error);

        return;
      }

      dispatch(getFamilyMembers());
      navigation.goBack();
    } catch (e) {
      console.log(e);
      showMessage({
        type: "danger",
        message: i18n.t("General.error"),
      });
    }
  };

export const deleteFamilyMember =
  (family_user_id) => async (dispatch, getState) => {
    const { token } = getState().authReducer;
    try {
      const res = await transactionsApi.deleteFamilyMember({
        params: {
          token,
          family_user_id,
        },
      });

      const errorMessage = res?.data?.result?.error;

      if (errorMessage) {
        throw errorMessage;
      }

      dispatch(getFamilyMembers());
    } catch (error) {
      const message =
        typeof error === "string" ? error : i18n.t("General.error");

      showMessage({
        type: "danger",
        message,
      });

      console.log(error, "delete family member error");
    }
  };

export const editFamilyMember =
  (body, navigation) => async (dispatch, getState) => {
    const { token } = getState().authReducer;
    try {
      const res = await transactionsApi.editFamilyMember({
        params: {
          token,
          ...body,
        },
      });

      dispatch(getFamilyMembers());
      navigation.goBack();
    } catch (e) {
      console.log(e);
      showMessage({
        type: "danger",
        message: i18n.t("General.error"),
      });
    }
  };
