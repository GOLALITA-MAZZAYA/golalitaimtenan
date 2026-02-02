import axios from 'axios';
import { BASE_URL } from '../constants';

export const getKeyHashes = async () => {
  const res = await axios.post(`https://${BASE_URL}/utils/spki_pin`, {
    params: {
      host: BASE_URL,
      port: 443,
    },
  });

  const hashKey = res.data?.result?.pin_sha256_b64;

  if (!hashKey) {
    return null;
  }

  return [hashKey, 'duniiKr8Djf0OQy/lGqtmX1cHJAbPOUT09j626viq4U='];
};
