import * as Yup from 'yup';
import i18next from 'i18next';

export const getValidationSchema = (activeTab) => {

   if(activeTab === 'transfer-email'){
    return Yup.object({
        name: Yup.string().required(i18next.t("Login.required")),
        lastName: Yup.string().required(i18next.t("Login.required")),
        partnerEmail: Yup.string().required(i18next.t("Login.required")),
     })
   }
    
    
   return Yup.object({
        name: Yup.string().required(i18next.t("Login.required")),
        lastName: Yup.string().required(i18next.t("Login.required")),
        phone: Yup.string().required(i18next.t("Login.required")).min(7, i18next.t("Login.required")),
    })
};