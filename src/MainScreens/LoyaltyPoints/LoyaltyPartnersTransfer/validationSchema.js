import * as Yup from 'yup';
import i18next from 'i18next';

export const getValidationSchema = () => (
    Yup.object({
        name: Yup.string().required(i18next.t("Login.required")),
        lastName: Yup.string().required(i18next.t("Login.required")),

    })
);