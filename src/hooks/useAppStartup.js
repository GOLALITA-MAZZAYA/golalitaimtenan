import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getInitialData } from '../redux/auth/auth-thunks';
import { setIsAuthorized } from '../redux/auth/auth-actions';
import { getMerchantsPointRate, getUserLoayltyPoints } from '../redux/loyalty/loyalty-thunks';
import { checkIfTokenIsValid } from '../api/auth';
import { initializeGlobalTixToken } from '../redux/globalTix/globalTix-api';
import { initializeAppSslPinning } from '../api/ssl';
import { e2eSelfTest } from '../utils/e2ee';
import { requestLocationPermission } from '../helpers';

// initializeAppSslPinning no longer waits on the network (the remote pin
// lookup runs in the background after pinning is active), but the native
// initializeSslPinning() call inside it has no bound of its own. If
// that ever hangs, isReady would never flip and the app would sit on the
// splash screen forever. This cap sits comfortably above the legitimate
// worst case so it never fires during normal operation.
//
// Security trade-off, made deliberately (not an oversight): if this timeout
// ever does fire, it means the native pinning call itself is hung — not a
// slow network, which is already handled above. isReady still flips true in
// that case, so the app proceeds to make auth/API calls before pinning is
// confirmed active (the original, now-abandoned promise keeps running in
// the background and may still enable pinning later, since JS promises
// can't be cancelled). This favors the app staying usable over staying
// strictly fail-closed for this one rare, native-bug-only scenario.
// Reviewed and confirmed acceptable — see git history for the discussion.
const STARTUP_TASKS_TIMEOUT_MS = 35000;

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Startup tasks timed out after ${ms}ms`)),
        ms,
      ),
    ),
  ]);

// Cold-start sequencing: SSL pinning must finish (success or failure) before
// isReady flips true, since every auth/network call below depends on
// pinning already being configured — see App.jsx history for why isReady
// used to start `true` and silently skipped this gate.
export const useAppStartup = ({ user, isAuthorized }) => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    async function runStartupTasks() {
      try {
        await withTimeout(initializeAppSslPinning(), STARTUP_TASKS_TIMEOUT_MS);
      } catch (err) {
        console.log(err, 'SSL pinning initialization failed');
      } finally {
        setIsReady(true);
      }
    }

    runStartupTasks();
  }, []);

  // Dev-only sanity check for the E2E encryption primitives (HKDF, RSA wrap,
  // AES-GCM round trip). E2E_ENCRYPTION_ENABLED stays false until the
  // backend can decrypt the envelope; this just proves the crypto works.
  useEffect(() => {
    if (__DEV__) {
      try {
        e2eSelfTest();
        console.log('[e2ee] self-test passed');
      } catch (err) {
        console.log('[e2ee] self-test failed', err);
      }
    }
  }, []);

  // Auth/token init — runs once isReady. The GlobalTix token, the main app
  // token check, and the logged-out flag read are all independent, so they
  // run in parallel instead of as three sequential awaits.
  useEffect(() => {
    if (!isReady) return;

    (async () => {
      const [, tokenValidationResult, isLoggedOut] = await Promise.all([
        initializeGlobalTixToken(),
        checkIfTokenIsValid(),
        AsyncStorage.getItem('isUserLoggedOut'),
      ]);

      // false = server-confirmed no valid session -> log out.
      // undefined = validation failed for a technical reason (network,
      // timeout, etc.) -> leave auth state alone, don't force a logout.
      if (tokenValidationResult === false) {
        dispatch(setIsAuthorized(false));
      }

      if (isLoggedOut === 'true') {
        dispatch(setIsAuthorized(false));
        return;
      }

      // The key can be missing even with a valid token (e.g. reinstall: the
      // Keychain token survives while AsyncStorage is wiped), so any value
      // other than 'true' proceeds as logged in.
      // tokenValidationResult is the /v5/user/dashboard/data response fetched
      // by checkIfTokenIsValid when the token was valid — reuse it here
      // instead of letting getInitialData fetch the same data again. When
      // it's `false` (invalid/missing token), pass undefined so
      // getInitialData falls back to its own fetch, same as before.
      dispatch(getInitialData(tokenValidationResult || undefined));
    })();
  }, [isReady, dispatch]);

  useEffect(() => {
    if (!!user && isReady) {
      dispatch(setIsAuthorized(true));
    }
  }, [!!user, isReady, dispatch]);

  useEffect(() => {
    if (isAuthorized) {
      dispatch(getMerchantsPointRate());
      dispatch(getUserLoayltyPoints());
    }
  }, [isAuthorized, dispatch]);

  return { isReady };
};
