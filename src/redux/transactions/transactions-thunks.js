import { transactionsApi } from "./transactions-api";
import {
  setFamilyMembers,
  setFamilyMembersLoading,
  setTransactions,
  setTransactionsHistory,
  setTransactionsHistoryError,
  setTransactionsHistoryLoading,
} from "./transactions-actions";
import { getUserData } from "../auth/auth-thunks";
import { CONTENT_DISABLED } from "../auth/auth-types";
import { showMessage } from "react-native-flash-message";
import i18n from "../../languages";

export const getTransactions = () => async (dispatch, getState) => {
  const { workStatus } = getState().authReducer;
  const { token } = getState().authReducer;
  const res = await transactionsApi.getTransactions({
    params: { token },
  });

  dispatch(
    setTransactions(workStatus === CONTENT_DISABLED ? [] : res.data.result)
  );
};

export const getTransactionsHistory = () => async (dispatch, getState) => {
  dispatch(setTransactionsHistoryLoading(true));

  try {
    const { token } = getState().authReducer;

    const res = await transactionsApi.getTransactionsHistory({
      params: { token },
    });

    if (!res.data?.result) {
      throw "err";
    }
    const data = res.data.result;

    data.transactions_by_merchant = data.transactions_by_merchant.map(
      (item) => {
        const category = data.transactions_by_category.find(
          (category) => category.merchant_category_id === item.category_id
        );

        return {
          ...item,
          categoryIcon: category?.merchant_category_logo || undefined,
          categoryName: category?.category || "",
        };
      }
    );

    data.transactions_by_merchant = [
      ...data.transactions_by_merchant,
      ...data.transactions_by_merchant,
      ...data.transactions_by_merchant,
    ];

    dispatch(setTransactionsHistory(data));
  } catch (err) {
    dispatch(setTransactionsHistoryError(true));
  } finally {
    dispatch(setTransactionsHistoryLoading(false));
  }
};

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

    dispatch(
      setFamilyMembers(workStatus === CONTENT_DISABLED ? [] : res.data.result)
    );
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(setFamilyMembersLoading(false));
  }
};

export const transferAmount =
  ({ points, phone }, setFieldError, setIsSubmitSend, setIsSuccessSend) =>
  async (dispatch, getState) => {
    const { token } = getState().authReducer;
    const res = await transactionsApi.transferAmount({
      params: {
        token,
        points,
        phone,
      },
    });
    if (res.data.result.error) {
      setFieldError("member", "User not found");
      setIsSubmitSend(false);
    } else {
      dispatch(getUserData(token));
      setIsSubmitSend(false);
      setIsSuccessSend(true);
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

      console.log(e, "delete family member error");
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
    }
  };
