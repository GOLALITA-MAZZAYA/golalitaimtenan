import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Wallet dashboard API (pass generation + events)
export const WALLET_DASHBOARD_API_URL = (
  process.env.WALLET_DASHBOARD_API_URL ||
  "https://wallet-api.golalitatwffer.com/api"
).replace(/\/$/, "");

// Pass generation (campaign branding + locations from dashboard)
export const PASS_API_URL =
  process.env.WALLET_PASS_API_URL ||
  `${WALLET_DASHBOARD_API_URL}/wallet/pass`;

/**
 * Dashboard Organization.id for Imtenan (admin panel on
 * wallet-api.golalitatwffer.com).
 * Override with WALLET_ORGANIZATION_ID at build time only if needed.
 */
export const IMTENAN_ORGANIZATION_ID = 11;
export const APP_ORGANIZATION_ID = IMTENAN_ORGANIZATION_ID;

export const WALLET_ORGANIZATION_ID = Number(
  process.env.WALLET_ORGANIZATION_ID || APP_ORGANIZATION_ID
) || APP_ORGANIZATION_ID;

const DEVICE_ID_KEY = "wallet-dashboard-device-id";

export const getBase64PkpassFile = async (data) => {
  console.log("getBase64PkpassFile request data:", JSON.stringify(data));

  let res;
  try {
    res = await axios.post(PASS_API_URL, data, { timeout: 60000 });
  } catch (err) {
    console.log("getBase64PkpassFile request FAILED");
    console.log("status:", err.response?.status);
    console.log("response data:", JSON.stringify(err.response?.data));
    console.log("message:", err.message);
    throw err;
  }

  console.log("getBase64PkpassFile response data:", JSON.stringify(res.data));

  const isAndroid = data.device_type === "android";
  const walletData = isAndroid ? res.data?.payloadAndroid : res.data?.payload;

  if (!walletData) {
    throw new Error(
      `No ${isAndroid ? "payloadAndroid" : "payload"} in API response`
    );
  }

  return {
    walletData,
    serialNumber: res.data?.serialNumber || res.data?.meta?.serialNumber || null,
    campaignId: res.data?.campaignId || res.data?.meta?.campaignId || null,
    organizationId:
      res.data?.organizationId ||
      res.data?.meta?.organizationId ||
      data.organizationId ||
      null,
    organizationName: res.data?.organizationName || data.organisation || null,
    raw: res.data,
  };
};

export async function getOrCreateWalletDeviceId() {
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `rn-${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/**
 * Report pass lifecycle events (INSTALL, REMOVE, REDEEM) to Wallet Dashboard.
 * Best-effort; never throws to callers so pass download/open isn't blocked.
 */
export async function reportWalletEvent({
  eventType,
  platform,
  serialNumber,
  campaignId,
  organizationId,
  organisation,
  barcode,
  googleObjectId,
  appUserId,
  userEmail,
}) {
  if (!serialNumber) {
    console.log("reportWalletEvent skipped: no serialNumber");
    return { ok: false, skipped: true };
  }

  const deviceId = await getOrCreateWalletDeviceId();
  const orgName = (organisation && String(organisation).trim()) || undefined;
  const normalizedUserId =
    appUserId != null && String(appUserId).trim() ? String(appUserId).trim() : undefined;
  const normalizedEmail =
    userEmail && String(userEmail).trim() ? String(userEmail).trim().toLowerCase() : undefined;

  const body = {
    eventType,
    platform,
    serialNumber,
    deviceId,
    campaignId: campaignId || undefined,
    organizationId: organizationId || WALLET_ORGANIZATION_ID || undefined,
    organisation: orgName,
    barcode: barcode || undefined,
    googleObjectId: googleObjectId || undefined,
    appUserId: normalizedUserId,
    userEmail: normalizedEmail,
  };

  try {
    const res = await axios.post(`${WALLET_DASHBOARD_API_URL}/wallet/events`, body, {
      timeout: 15000,
    });
    console.log("reportWalletEvent ok", res.data);
    return res.data;
  } catch (err) {
    console.log("reportWalletEvent failed", err.response?.status, err.message);
    return { ok: false, error: err.message, details: err.response?.data };
  }
}
