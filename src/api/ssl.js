import axios from 'axios';

export const getKeyHashes = async () => {
  const res = await axios.post('https://golalita.com/utils/spki_pin', {
    params: {
      host: 'www.golalita.com',
      port: 443,
    },
  });

  const hashKey = res.data?.result?.pin_sha256_b64;

  if (!hashKey) {
    return null;
  }

  return [hashKey, 'duniiKr8Djf0OQy/lGqtmX1cHJAbPOUT09j626viq4U='];
};
