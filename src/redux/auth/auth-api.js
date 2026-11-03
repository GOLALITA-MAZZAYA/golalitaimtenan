import instance, { API_BASE_URL } from "../instance";
import axios from "axios";
import { org } from "../../org/config";

const authApi = {
  login: (body) => instance.post(`/user/get_token/${org.code}`, body),
  logout: (body) => instance.post("/user/delete_token", body),
  updateProfile: (userId, body) =>
    instance.post(`/res.users/update/${userId}`, body),
  getUserData: (body) =>
    instance.post("/v5/user/dashboard/data", body),
  contactUs: (body) => instance.post("/loyalty.contact.us/create", body),
  resetPassword: (body) =>
    instance.post(`https://${org.baseUrl}/mobile/reset_password`, body),
  getPublicOrganizations: () => instance.post("/user/org/lists/v3", {}),
  checkCode: (body) => instance.post("/code/check/v2", body),
  register: (body) =>
    instance.post(
      `https://${org.baseUrl}/organisation/employee/registration/v2/${org.code}`,
      body
    ),
  sendOTP: (body) => instance.post(`/send/otp/${org.code}`, body),
  sendOTPEmail: (body) => instance.post(`/send/otp/email/${org.code}`, body),
  sendOTPRegister: (body) => instance.post("/send/otp/new_user", body),
  verify: (body) => instance.post("/otp/verify", body),
  verifyRegister: (body) => instance.post("/otp/verify/new_user", body),
  changePassword: (body) => instance.post("/create/otp/password", body),
  checkEmail: (body) => instance.post("/user/email/check", body),
  validate_code: (body) => instance.post("/user/validate", body),
  checkPhone: (body) => instance.post("/user/phone/check", body),
  getVersion: () =>
    instance.post(`https://${org.baseUrl}/mobile/version`, {}),

  getAppVersions: (appName = org.versionAppName) =>
    axios.post(
      `https://${org.baseUrl}/go/api/public/app/versions`,
      {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          app_name: appName,
        },
      },
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      }
    ),

  getAppStatus: () =>
    axios.get("https://keepcalmlabs.com/wp-json/wp/v2/apps/401"),
};

export default authApi;
