import { useEffect, useState } from 'react';
import { fetchLatestAppVersion } from '../api/appVersions';
import { VERSION } from '../redux/types';

const parseVersionParts = version =>
  String(version || '')
    .split('.')
    .map(part => Number.parseInt(part, 10) || 0);

/**
 * Compares store version vs installed VERSION and returns update mode:
 * - 'hard' for major/minor bumps (or large patch gaps)
 * - 'easy' for small patch bumps (< 5)
 * - null when up to date / unavailable
 */
export const getUpdateModalType = (latestVersion, currentVersion = VERSION) => {
  if (!latestVersion || !currentVersion) {
    return null;
  }

  const [latestMajor, latestMinor, latestPatch] =
    parseVersionParts(latestVersion);
  const [currentMajor, currentMinor, currentPatch] =
    parseVersionParts(currentVersion);

  if (latestMajor > currentMajor) {
    return 'hard';
  }

  if (latestMajor === currentMajor) {
    if (latestMinor > currentMinor) {
      return 'hard';
    }

    if (latestMinor === currentMinor && latestPatch > currentPatch) {
      return latestPatch - currentPatch < 5 ? 'easy' : 'hard';
    }
  }

  return null;
};

/**
 * Loads the latest store version from the public app-versions API and
 * decides whether UpdateModal should show.
 * Mount UpdateModal only when the app is ready (`{isReady && <UpdateModal />}`)
 * so this fetch does not run too early.
 */
export const useAppUpdateCheck = () => {
  const [updateModal, setUpdateModal] = useState(null);
  const [latestVersion, setLatestVersion] = useState(null);
  const [storePlatform, setStorePlatform] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const info = await fetchLatestAppVersion();
        if (!mounted || !info?.version) {
          return;
        }

        setLatestVersion(info.version);
        setStorePlatform(info.platform || null);

        const updateType = getUpdateModalType(info.version, VERSION);
        if (updateType) {
          setUpdateModal(updateType);
        }

        console.log(
          'latestVersion',
          info.version,
          info.platform,
          VERSION === info.version,
        );
      } catch (error) {
        console.log('useAppUpdateCheck error:', error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    updateModal,
    setUpdateModal,
    latestVersion,
    storePlatform,
  };
};

export default useAppUpdateCheck;
