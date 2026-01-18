import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { phoneRegExp } from "../../utils";

export const useValidation = () => {
  const { t } = useTranslation();

  const getRequiredFieldValidation = () => {
    return Yup.string().required(t("Login.required"));
  };

  const getPasswordValidation = () => {
    return Yup.string()
      .required(t("Login.required"))
      .min(8, t("Login.passwordMinLength")) // Minimum 8 characters
      .matches(/[a-z]/, t("Login.passwordLowercase")) // At least one lowercase letter
      .matches(/[A-Z]/, t("Login.passwordUppercase")) // At least one uppercase letter
      .matches(/\d/, t("Login.passwordNumber")) // At least one number
      .matches(/[@$!%*?&#^(){}[\]-]/, t("Login.passwordSpecialChar")); // At least one special character
  };

  const getEmailValidation = () => {
    return Yup.string()
      .email(t("ContactUs.enterValidEmail"))
      .required(t("Login.required"));
  };

  const getPhoneValidation = () => {
    return Yup.string()
      .min(7, t("ContactUs.enterValidPhone"))
      .required(t("Login.required"));
  };

  const getRegisterValidationSchema = () => {
    return Yup.object({
      name: getRequiredFieldValidation(),
      last_name: getRequiredFieldValidation(),
      email: getEmailValidation(),
      phone: getPhoneValidation(),
      password: getPasswordValidation(),
      repeatPassword: Yup.string().oneOf(
        [Yup.ref("password"), null],
        t("Login.passwordsMustMatch")
      ),
    });
  };

  const getLoginEmailValidationSchema = () => {
    return Yup.object({
      email: getEmailValidation(),
      password: getPasswordValidation(),
    });
  };

  const getLoginPhoneValidationSchema = () => {
    return Yup.object({
      phone: getPhoneValidation(),
      password: getPasswordValidation(),
    });
  };

  const getAddFamilyMemberValidationSchema = () => {
    return Yup.object({
      fullName: getRequiredFieldValidation(),
      last_name: getRequiredFieldValidation(),
      email: getEmailValidation(),
      phone: getPhoneValidation(),
      password: getPasswordValidation(),
    });
  };

  const getChangePasswordValidationSchema = () => {
    return Yup.object({
      oldPassword: getPasswordValidation(),
      newPassword: getPasswordValidation(),
      confirmNewPassword: Yup.string().oneOf(
        [Yup.ref("newPassword"), null],
        t("Login.passwordsMustMatch")
      ),
    });
  };

  const getCreatePasswordValidationSchema = () => {
    return Yup.object({
      password: getPasswordValidation(),
      repeatPassword: getPasswordValidation(),
    });
  };

  const getProfileScreenValidationSchema = () => {
    return Yup.object({
      name: getRequiredFieldValidation(),
      x_moi_last_name: Yup.string().required(t("Login.required")),
      email: getEmailValidation(),
      phone: getPhoneValidation(),
    });
  };

  return {
    getRegisterValidationSchema,
    getLoginEmailValidationSchema,
    getLoginPhoneValidationSchema,
    getAddFamilyMemberValidationSchema,
    getChangePasswordValidationSchema,
    getProfileScreenValidationSchema,
    getCreatePasswordValidationSchema,
  };
};
