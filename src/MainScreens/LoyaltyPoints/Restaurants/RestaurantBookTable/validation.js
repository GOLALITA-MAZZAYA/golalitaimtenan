import i18next from "i18next";
import * as Yup from "yup";
import store from "../../../../redux/store";

export const getValidation = () => {
const orderType = store.getState().restaurantReducer.order_type;

  if(orderType === 'reservation') {

    return Yup.object({
      date: Yup.string().required(i18next.t("Login.required")),
      time: Yup.string().required(i18next.t("Login.required")),
      guests: Yup.string().required(i18next.t("Login.required")),
      child_count: Yup.string().required(i18next.t("Login.required")),
      seating_preference_id: Yup.string().required(i18next.t("Login.required")),
      occasion: Yup.string().required(i18next.t("Login.required")),
     });
  
  } 

  if(orderType === 'delivery') {
   return undefined
  }

  if(orderType === 'takeaway') {
    return undefined
  }
}