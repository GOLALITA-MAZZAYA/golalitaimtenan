import * as Yup from "yup";
import { phoneRegExp, qcbEmailTest } from "../../../utils";
import i18next from "i18next";

export const getValidationSchema = () => {
  return Yup.object({
    name: Yup.string().required(i18next.t("Login.required")),
    last_name: Yup.string().required(i18next.t("Login.required")),
    email: Yup.string()
      .email(i18next.t("Login.invalidEmail"))
      .test(qcbEmailTest(i18next.t))
      .required(i18next.t("Login.required")),
    phone: Yup.string()
      .matches(phoneRegExp, i18next.t("Login.invalidPhone"))
      .required(i18next.t("Login.required")),
    password: Yup.string()
      .min(8, i18next.t("Login.min8chars"))
      .required(i18next.t("Login.required")),
    repeatPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      i18next.t("Login.passwordsMustMatch")
    ),
  });
};
