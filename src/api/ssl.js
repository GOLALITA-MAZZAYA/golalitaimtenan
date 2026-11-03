import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeSslPinning,
  isSslPinningAvailable,
} from 'react-native-ssl-public-key-pinning';
import { org } from '../org/config';

// Known-good pins baked into the app. Pinning is initialized with these
// before any network call, so they are the trust root for everything else —
// including the dynamic pin lookup below.
const FALLBACK_PINS = [
  'brzvtCELCIZUo4sD/qPX0ccRtPsd3DY6RfmxpOU9oB4=', // gcptest.golalita.com — Let's Encrypt YE1 intermediate
  'isTGhoL+GV3/X62kOF3IJlhtfetInbELgPId+ss8PJQ=', // www.golalita.com — SSL2BUY EMEA RSA Domain Validation Secure Server CA
  // Backup pins: the roots directly above the two intermediates. A renewal
  // can come from a different intermediate (Let's Encrypt rotates them), and
  // with nothing else trusted that would lock the app out until a new release.
  'sCkq5UWXjg+7mKu9lMhhYF5bGLsy7VI/UNW3tccdR7w=', // gcptest.golalita.com — ISRG Root YE
  'Douxi77vs4G+Ib/BogbTFymEYq0QSFXwSgVCaZcI09Q=', // www.golalita.com — Sectigo Public Server Authentication Root R46
];

const PIN_FETCH_TIMEOUT_MS = 8000;
const PIN_FETCH_RETRIES = 2;
const PIN_FETCH_RETRY_DELAY_MS = 1000;

// The pin hash is not secret (it's a public key hash), so plain
// AsyncStorage is fine. Pinning always gets FALLBACK_PINS alongside the
// cached hash, so a stale cache can't disable pinning.
//
// v3: earlier versions fetched this hash before pinning was active, so a v2
// entry can't be trusted and is deliberately never read.
const PIN_CACHE_KEY = 'sslPinCache_v3';
const PIN_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const buildPinningConfig = publicKeyHashes => ({
  [org.baseDomain]: {
    includeSubdomains: true,
    publicKeyHashes,
  },
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const readCachedPinHash = async () => {
  try {
    const raw = await AsyncStorage.getItem(PIN_CACHE_KEY);
    if (!raw) return null;

    const { hash, fetchedAt } = JSON.parse(raw);
    if (typeof hash !== 'string' || !hash) return null;
    if (typeof fetchedAt !== 'number' || Date.now() - fetchedAt > PIN_CACHE_TTL_MS) {
      return null;
    }

    return hash;
  } catch (err) {
    console.log('SSL pin cache read failed', err);
    return null;
  }
};

const writeCachedPinHash = async hash => {
  try {
    await AsyncStorage.setItem(
      PIN_CACHE_KEY,
      JSON.stringify({ hash, fetchedAt: Date.now() }),
    );
  } catch (err) {
    // Non-fatal — worst case the next cold start just re-fetches.
    console.log('SSL pin cache write failed', err);
  }
};

const fetchRemotePinHash = async () => {
  const res = await axios.post(
    `https://${org.baseUrl}/utils/spki_pin`,
    {
      params: {
        host: org.baseUrl,
        port: 443,
      },
    },
    { timeout: PIN_FETCH_TIMEOUT_MS },
  );

  const remoteHash = res.data?.result?.pin_sha256_b64;

  if (typeof remoteHash === 'string' && remoteHash.length > 0) {
    return remoteHash;
  }

  throw new Error('SSL pin API did not return a valid pin hash');
};

const applyPins = hashes =>
  initializeSslPinning(buildPinningConfig(hashes));

// Must only run once pinning is active: the hash it returns is then served
// over a connection already validated against a trusted pin, so an
// intercepted request can't inject a pin of its own.
const refreshRemotePin = async cachedHash => {
  for (let attempt = 0; attempt <= PIN_FETCH_RETRIES; attempt += 1) {
    try {
      const remoteHash = await fetchRemotePinHash();
      await writeCachedPinHash(remoteHash);
      if (remoteHash !== cachedHash) {
        await applyPins([remoteHash, ...FALLBACK_PINS]);
      }
      return;
    } catch (err) {
      console.log(
        `SSL pin fetch attempt ${attempt + 1}/${PIN_FETCH_RETRIES + 1} failed`,
        err,
      );
      if (attempt < PIN_FETCH_RETRIES) {
        await delay(PIN_FETCH_RETRY_DELAY_MS);
      }
    }
  }
};

// Fail-closed: pinning is enabled from local data alone (baked-in pins plus
// any previously cached hash), so this only throws if native pinning itself
// can't be initialized. The remote lookup runs afterwards in the background
// and never blocks startup.
export const initializeAppSslPinning = async () => {
  if (!isSslPinningAvailable()) {
    throw new Error('SSL pinning native module is not available');
  }

  const cachedHash = await readCachedPinHash();
  await applyPins(cachedHash ? [cachedHash, ...FALLBACK_PINS] : FALLBACK_PINS);

  refreshRemotePin(cachedHash).catch(() => {});
};
