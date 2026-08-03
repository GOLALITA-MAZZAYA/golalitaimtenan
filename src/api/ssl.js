import axios from 'axios';
import { BASE_URL } from '../constants';

// Known-good pin baked into the app. Used verbatim if the dynamic lookup
// below can't be reached, so a flaky network never leaves pinning disabled.
const FALLBACK_PIN = 'duniiKr8Djf0OQy/lGqtmX1cHJAbPOUT09j626viq4U=';

const PIN_FETCH_TIMEOUT_MS = 8000;
const PIN_FETCH_RETRIES = 2;
const PIN_FETCH_RETRY_DELAY_MS = 1000;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchRemotePinHash = async () => {
  const res = await axios.post(
    `https://${BASE_URL}/utils/spki_pin`,
    {
      params: {
        host: BASE_URL,
        port: 443,
      },
    },
    { timeout: PIN_FETCH_TIMEOUT_MS },
  );

  const hashKey = res.data?.result?.pin_sha256_b64;

  if (!hashKey) {
    throw new Error('SSL pin API did not return a valid pin hash');
  }

  return hashKey;
};

// Fail-closed: this always resolves with at least the baked-in fallback pin,
// so a flaky/unreachable pin-lookup endpoint never leaves pinning disabled.
export const getKeyHashes = async () => {
  for (let attempt = 0; attempt <= PIN_FETCH_RETRIES; attempt += 1) {
    try {
      const remoteHash = await fetchRemotePinHash();
      return [remoteHash, FALLBACK_PIN];
    } catch (err) {
      const isLastAttempt = attempt === PIN_FETCH_RETRIES;
      console.log(
        `SSL pin fetch attempt ${attempt + 1}/${PIN_FETCH_RETRIES + 1} failed`,
        err,
      );
      if (isLastAttempt) {
        console.log('Falling back to baked-in SSL pin only');
        return [FALLBACK_PIN];
      }
      await delay(PIN_FETCH_RETRY_DELAY_MS);
    }
  }

  return [FALLBACK_PIN];
};
