import axios from 'axios';
import {
  APP_VERSIONS_APP_NAME,
  APP_VERSIONS_ORGANISATION,
  BASE_URL,
} from '../constants';
import { getStorePlatformKey } from '../utils/storePlatform';

const PUBLIC_APP_VERSIONS_URL = `https://${BASE_URL}/go/api/public/app/versions`;

const isUsableStoreVersion = value =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  value.trim().toLowerCase() !== 'not uploaded';

const getPlatformInfo = (platforms, platform) => {
  if (!platforms) {
    return null;
  }

  // API returns all three store versions:
  //   ios     → Apple App Store
  //   android → Google Play
  //   huawei  → Huawei AppGallery
  if (platform === 'ios') {
    return platforms.ios || null;
  }

  if (platform === 'huawei') {
    return platforms.huawei || null;
  }

  return platforms.android || null;
};

/**
 * Fetches the latest published store version for this app/platform
 * from the public app-versions endpoint (no auth).
 */
export const fetchLatestAppVersion = async ({
  appName = APP_VERSIONS_APP_NAME,
  organisation = APP_VERSIONS_ORGANISATION,
  platform = getStorePlatformKey(),
} = {}) => {
  const params = {};
  if (appName) {
    params.app_name = appName;
  }
  if (organisation) {
    params.organisation = organisation;
  }

  const res = await axios.post(
    PUBLIC_APP_VERSIONS_URL,
    {
      jsonrpc: '2.0',
      method: 'call',
      params,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );

  const result = res.data?.result;
  if (!result?.success) {
    throw new Error(result?.error?.message || 'Failed to fetch app versions');
  }

  const apps = Array.isArray(result.apps) ? result.apps : [];
  if (!apps.length) {
    return null;
  }

  // Prefer an exact-ish name match; otherwise take the first filtered hit.
  const normalizedTarget = (appName || '').trim().toLowerCase();
  const app =
    apps.find(
      item => (item.app_name || '').trim().toLowerCase() === normalizedTarget,
    ) ||
    apps.find(item =>
      (item.app_name || '').toLowerCase().includes(normalizedTarget),
    ) ||
    apps[0];

  const platformInfo = getPlatformInfo(app?.platforms, platform);
  const currentVersion = platformInfo?.current_version;

  if (!isUsableStoreVersion(currentVersion)) {
    return null;
  }

  return {
    version: currentVersion.trim(),
    platform,
    appName: app.app_name,
    organisation: app.organisation,
    storeName: platformInfo?.store_name,
    releaseDate: platformInfo?.release_date || null,
  };
};
