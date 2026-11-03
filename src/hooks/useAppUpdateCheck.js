import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getVersion } from '../redux/auth/auth-thunks';
import { VERSION } from '../redux/types';

// Fetches the latest published version once the app is ready, compares it
// against the running build, and decides whether to show the update modal
// ('easy' for a small patch bump, 'hard' otherwise).
export const useAppUpdateCheck = ({ isReady, version }) => {
  const dispatch = useDispatch();
  const [updateModal, setUpdateModal] = useState(null);

  useEffect(() => {
    if (isReady) {
      dispatch(getVersion());
    }
  }, [isReady, dispatch]);

  useEffect(() => {
    if (!version || !isReady || typeof version !== 'string' || !/^\d+(\.\d+)+$/.test(version.trim())) return;

    // Split versions into arrays of numbers [major, minor, patch]
    const latestParts = version.trim().split('.').map(Number);
    const currentParts = VERSION.split('.').map(Number);

    const latestMajor = latestParts[0] || 0;
    const latestMinor = latestParts[1] || 0;
    const latestPatch = latestParts[2] || 0;

    const currentMajor = currentParts[0] || 0;
    const currentMinor = currentParts[1] || 0;
    const currentPatch = currentParts[2] || 0;

    let isNewer = false;
    let updateType = null; // 'hard' | 'easy'

    if (latestMajor > currentMajor) {
      // Major version change (e.g. 2.0.0 vs 1.0.9)
      isNewer = true;
      updateType = 'hard';
    } else if (latestMajor === currentMajor) {
      if (latestMinor > currentMinor) {
        // Minor version change (e.g. 1.1.0 vs 1.0.9)
        isNewer = true;
        updateType = 'hard';
      } else if (latestMinor === currentMinor) {
        if (latestPatch > currentPatch) {
          // Patch version change (e.g. 1.0.14 vs 1.0.9)
          isNewer = true;
          // Easy update if patch difference is less than 5, else hard update
          updateType = latestPatch - currentPatch < 5 ? 'easy' : 'hard';
        }
      }
    }

    if (isNewer && updateType) {
      setUpdateModal(updateType);
    }

    console.log('latestVersion', version, VERSION === version);
  }, [version, isReady]);

  return { updateModal, setUpdateModal };
};
