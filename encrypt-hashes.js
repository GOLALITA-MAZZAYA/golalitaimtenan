/**
 * Regenerate encrypted SSL pin bundle for src/utils/sslPinStorage.js
 *
 * Usage:
 *   node encrypt-hashes.js "hash1" "hash2"
 *
 * If no hashes are passed, defaults are used for golalita.com.
 */
const CryptoJS = require('crypto-js');

const ANDROID_PACKAGE_NAME = 'com.golalitaimtenanrewards';
const IOS_TEAM_ID = 'V83QSUA898';
const ORGANIZATION_CODE = 'qcb';

const defaultHashes = [
  'duniiKr8Djf0OQy/lGqtmX1cHJAbPOUT09j626viq4U=',
];

const hashes = process.argv.slice(2).length ? process.argv.slice(2) : defaultHashes;

console.log(hashes, 'hashes');

const derivePinKey = () =>
  CryptoJS.SHA256(
    `${ANDROID_PACKAGE_NAME}:${IOS_TEAM_ID}:${ORGANIZATION_CODE}:emtinan-ssl-pins`,
  ).toString();

const ciphertext = CryptoJS.AES.encrypt(
  JSON.stringify(hashes),
  derivePinKey(),
).toString();

console.log('Paste into ENCRYPTED_SSL_PINS in src/utils/sslPinStorage.js:\n');
console.log(ciphertext);
