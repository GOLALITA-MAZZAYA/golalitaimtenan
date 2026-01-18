import instance, { API_BASE_URL } from "../instance";
import axios from "axios";

const authApi = {
  login: (body) => instance.post("/user/get_token", body),
  logout: (body) => instance.post("/user/delete_token", body),
  updateProfile: (userId, body) =>
    instance.post(`/res.users/update/${userId}`, body),
  getUserData: (body) => instance.post("/user/dashboard/data", body),
  getUserBanners: (body) => instance.post("/user/dashboard/banner", body),
  contactUs: (body) => instance.post("/loyalty.contact.us/create", body),
  resetPassword: (body) =>
    instance.post("https://www.golalita.com/mobile/reset_password", body),
  getPublicOrganizations: () => instance.post("/user/org/lists/v3", {}),
  checkCode: (body) => instance.post("/code/check/v2", body),
  register: (body) =>
    instance.post(
      `https://www.golalita.com/organisation/employee/registration/v2`,
      body
    ),
  sendOTP: (body) => instance.post("/send/otp/golalita", body),
  sendOTPEmail: (body) => instance.post("/send/otp/email/golalita", body),
  sendOTPRegister: (body) => instance.post("/send/otp/new_user", body),
  verify: (body) => instance.post("/otp/verify", body),
  verifyRegister: (body) => instance.post("/otp/verify/new_user", body),
  changePassword: (body) => instance.post("/create/otp/password", body),
  checkEmail: (body) => instance.post("/user/email/check", body),
  validate_code: (body) => instance.post("/user/validate", body),
  checkPhone: (body) => instance.post("/user/phone/check", body),
  getVersion: () =>
    instance.post(`https://www.golalita.com/mobile/version`, {}),

  getAppStatus: () =>
    axios.get("https://keepcalmlabs.com/wp-json/wp/v2/apps/401"),
};

export default authApi;
