import forge from 'node-forge';
import 'react-native-get-random-values';
import { E2E_SERVER_PUBLIC_KEY, E2E_KEY_ID } from '../constants';
import { org } from '../org/config';

// Hybrid end-to-end payload encryption, protocol v1 (docs/E2E_ENCRYPTION.md).
//
// Per request: a fresh 256-bit session key is HKDF-split into directional
// keys (request vs response), the JSON body is wrapped with anti-replay and
// route-binding metadata and encrypted with AES-256-GCM under the request
// key, and the session key is wrapped with the server's RSA-OAEP(SHA-256)
// public key. The server replies under the response key with a fresh IV.
//
// Pure-JS crypto (node-forge) rather than a native module: this app runs
// the Old Architecture, and every native crypto library evaluated
// (react-native-quick-crypto + @craftzdog/react-native-buffer) turned out to
// require Fabric/TurboModules with no legacy-bridge fallback at all. Forge
// has no native dependency, so it works identically regardless of
// architecture. Cryptographic randomness still comes from
// react-native-get-random-values (a real OS-backed CSPRNG, old-arch
// compatible) — never from forge's own PRNG, which is only as strong as its
// seed and defaults to Math.random()+time if not fed real entropy.

export const E2E_VERSION = 1;

const AES_KEY_BYTES = 32;
const GCM_IV_BYTES = 12;
const RID_BYTES = 16;
const HKDF_INFO_REQUEST = 'golalita-e2e/v1/request';
const HKDF_INFO_RESPONSE = 'golalita-e2e/v1/response';

const publicKey = forge.pki.publicKeyFromPem(E2E_SERVER_PUBLIC_KEY);

// forge represents byte strings as "binary strings" (one char code = one
// byte, 0-255). These helpers move between that and Uint8Array/base64/hex.
const randomBytes = size => {
  const arr = new Uint8Array(size);
  crypto.getRandomValues(arr);
  return forge.util.binary.raw.encode(arr);
};

// RFC 5869 HKDF-SHA256, zero salt, single expand block (enough for 32 bytes).
const hkdfSha256 = (ikm, info) => {
  const zeroSalt = String.fromCharCode(0).repeat(32);
  const extract = forge.hmac.create();
  extract.start('sha256', zeroSalt);
  extract.update(ikm);
  const prk = extract.digest().getBytes();

  const expand = forge.hmac.create();
  expand.start('sha256', prk);
  expand.update(info + String.fromCharCode(0x01));
  return expand.digest().getBytes();
};

const deriveDirectionalKeys = sessionKey => ({
  requestKey: hkdfSha256(sessionKey, HKDF_INFO_REQUEST),
  responseKey: hkdfSha256(sessionKey, HKDF_INFO_RESPONSE),
});

const aesGcmEncrypt = (key, plaintextUtf8) => {
  const iv = randomBytes(GCM_IV_BYTES);
  const cipher = forge.cipher.createCipher('AES-GCM', key);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(plaintextUtf8, 'utf8'));
  cipher.finish();
  return { iv, data: cipher.output.getBytes(), tag: cipher.mode.tag.getBytes() };
};

const aesGcmDecrypt = (key, iv, data, tag) => {
  const decipher = forge.cipher.createDecipher('AES-GCM', key);
  decipher.start({ iv, tag: forge.util.createBuffer(tag) });
  decipher.update(forge.util.createBuffer(data));
  if (!decipher.finish()) {
    throw new Error('AES-GCM authentication failed');
  }
  return decipher.output.toString('utf8');
};

// `route` = { method, path } — path is the normalized URL path the server
// will see (no query string, no trailing slash); the server compares it to
// the route it is actually handling, which binds the ciphertext to this
// endpoint.
export const encryptRequest = (body, route) => {
  const sessionKey = randomBytes(AES_KEY_BYTES);
  const { requestKey, responseKey } = deriveDirectionalKeys(sessionKey);

  const wrapper = {
    v: E2E_VERSION,
    ts: Date.now(),
    rid: forge.util.bytesToHex(randomBytes(RID_BYTES)),
    mth: (route?.method || 'POST').toUpperCase(),
    path: route?.path || '/',
    payload: body ?? {},
  };

  const { iv, data, tag } = aesGcmEncrypt(requestKey, JSON.stringify(wrapper));

  const wrappedKey = publicKey.encrypt(sessionKey, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha256.create() },
  });

  return {
    responseKey,
    envelope: {
      e2e: {
        v: E2E_VERSION,
        kid: E2E_KEY_ID,
        org_id: parseInt(org.id, 10),
        key: forge.util.encode64(wrappedKey),
        iv: forge.util.encode64(iv),
        data: forge.util.encode64(data),
        tag: forge.util.encode64(tag),
      },
    },
  };
};

export const decryptResponse = (envelope, responseKey) => {
  const { iv, data, tag } = envelope.e2e;
  const plaintext = aesGcmDecrypt(
    responseKey,
    forge.util.decode64(iv),
    forge.util.decode64(data),
    forge.util.decode64(tag),
  );
  return JSON.parse(plaintext);
};

export const isEncryptedEnvelope = data =>
  !!data &&
  typeof data === 'object' &&
  !!data.e2e &&
  typeof data.e2e === 'object' &&
  typeof data.e2e.data === 'string';

// Dev-only sanity check: exercises randomness, HKDF, the RSA wrap against
// the embedded public key, and an AES round trip on the response key (as if
// the server had replied). Call from App.jsx under __DEV__.
export const e2eSelfTest = () => {
  const sample = { params: { token: 'self-test' } };
  const { envelope, responseKey } = encryptRequest(sample, {
    method: 'POST',
    path: '/golalita/self/test',
  });

  const reply = aesGcmEncrypt(responseKey, JSON.stringify({ result: 'ok' }));
  const echo = {
    e2e: {
      v: E2E_VERSION,
      iv: forge.util.encode64(reply.iv),
      data: forge.util.encode64(reply.data),
      tag: forge.util.encode64(reply.tag),
    },
  };

  if (decryptResponse(echo, responseKey).result !== 'ok' || !envelope.e2e.key) {
    throw new Error('e2ee self-test failed');
  }

  return true;
};
