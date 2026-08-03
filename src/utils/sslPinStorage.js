import CryptoJS from 'crypto-js';
import {
  ANDROID_PACKAGE_NAME,
  IOS_TEAM_ID,
  ORG_CODE,
} from '../constants';
import logger from './logger';

// Generated via encrypt-hashes.js — do not store plain pin hashes in source.
const ENCRYPTED_SSL_PINS =
  'U2FsdGVkX1/Blg1BuqmJ/5wE2YQa7Sb/lao2r4eR3SFOuS1vP2oqTxlBDXmh1gUWe1HaxhqgIMSCNng8y5QbkTk9foyw94rz0EVpW440Mos=';

const derivePinKey = () =>
  CryptoJS.SHA256(
    `${ANDROID_PACKAGE_NAME}:${IOS_TEAM_ID}:${ORG_CODE}:emtinan-ssl-pins`,
  ).toString();

export const getBundledPinHashes = () => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      ENCRYPTED_SSL_PINS,
      derivePinKey(),
    ).toString(CryptoJS.enc.Utf8);

    const hashes = JSON.parse(decrypted);

    if (!Array.isArray(hashes) || hashes.length === 0) {
      return null;
    }

    return hashes.filter(hash => typeof hash === 'string' && hash.length > 0);
  } catch (error) {
    logger.error('Failed to decode bundled SSL pin hashes');
    return null;
  }
};
