import axios from "axios";
import { Platform } from 'react-native';

export const getBase64PkpassFile = async (data) => {
  const res = await axios.post(
    "https://golalitatwffer.com/api/go/auth/pass/qcb",
    //"http://10.59.1.57:9001/api/go/auth/pass/qcb",
    data
  );
  const isAndroid = data.device_type === 'android';
  const walletData = isAndroid ? res.data?.payloadAndroid : res.data?.payload;

  if (!walletData) {
    throw new Error(`No ${isAndroid ? 'payloadAndroid' : 'payload'} in API response`);
  }
  return walletData;
};
