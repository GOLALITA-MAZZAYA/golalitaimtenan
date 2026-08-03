import axios from 'axios';
import {
  initializeSslPinning,
  isSslPinningAvailable,
} from 'react-native-ssl-public-key-pinning';
import { BASE_DOMAIN, BASE_URL } from '../constants';
import { getBundledPinHashes } from '../utils/sslPinStorage';
import logger from '../utils/logger';

const PIN_FETCH_TIMEOUT_MS = 8000;
const PIN_FETCH_RETRIES = 2;
const PIN_FETCH_RETRY_DELAY_MS = 1000;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const buildPinningConfig = publicKeyHashes => ({
  [BASE_DOMAIN]: {
    includeSubdomains: true,
    publicKeyHashes,
  },
});

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

export const initializeAppSslPinning = async () => {
  if (!isSslPinningAvailable()) {
    logger.warn('SSL pinning native module is not available');
    return;
  }

  const fallbackPins = getBundledPinHashes() || [];

  for (let attempt = 0; attempt <= PIN_FETCH_RETRIES; attempt += 1) {
    try {
      const remoteHash = await fetchRemotePinHash();
      const pins = [remoteHash, ...fallbackPins];
      await initializeSslPinning(buildPinningConfig(pins));
      logger.info('SSL pinning initialized successfully with remote and fallback pins');
      return;
    } catch (err) {
      const isLastAttempt = attempt === PIN_FETCH_RETRIES;
      logger.warn(
        `SSL pin fetch attempt ${attempt + 1}/${PIN_FETCH_RETRIES + 1} failed: ${err.message}`,
      );
      if (isLastAttempt) {
        if (fallbackPins.length > 0) {
          logger.warn('Falling back to bundled SSL pins only');
          await initializeSslPinning(buildPinningConfig(fallbackPins));
          logger.info('SSL pinning initialized successfully with fallback pins');
        } else {
          logger.error('No SSL pins available (remote failed and no fallback pins found)');
        }
        return;
      }
      await delay(PIN_FETCH_RETRY_DELAY_MS);
    }
  }
};
