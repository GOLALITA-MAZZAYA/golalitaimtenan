import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCachedLocalEsimDestinations,
  getEsimDestinations,
} from '../../api/esim';

export const ESIM_CATEGORY_ID = 709; //dev 709

export const POPULAR_COUNTRY_CODES = ['AE', 'SA', 'GB', 'US', 'QA', 'TR', 'EG'];

export const isEsimCategory = category =>
  Number(category?.id) === ESIM_CATEGORY_ID;

const localizedRegionName = (code, language) => {
  const region = String(code || '')
    .trim()
    .toUpperCase();
  if (!/^[A-Z]{2}$/.test(region)) {
    return '';
  }
  try {
    return new Intl.DisplayNames([language], { type: 'region' }).of(region) || '';
  } catch (error) {
    return '';
  }
};

export const getDestinationDisplayName = (destination, language = 'en') => {
  if (!destination) {
    return '';
  }
  const isAr = String(language).startsWith('ar');
  if (isAr) {
    const arabic =
      destination.name_ar ||
      destination.arabic_name ||
      destination.title_ar ||
      destination.x_name_arabic;
    if (arabic) {
      return arabic;
    }
    const localized = localizedRegionName(destination.country_code, 'ar');
    if (localized) {
      return localized;
    }
  }
  return (
    destination.name ||
    localizedRegionName(destination.country_code, language) ||
    ''
  );
};

const COUNTRY_NAME_TO_CODE = {
  turkey: 'TR',
  turkiye: 'TR',
  'republic of turkey': 'TR',
  'republic of turkiye': 'TR',
  uae: 'AE',
  'united arab emirates': 'AE',
  uk: 'GB',
  'united kingdom': 'GB',
  'great britain': 'GB',
  england: 'GB',
  usa: 'US',
  us: 'US',
  'united states': 'US',
  'united states of america': 'US',
  korea: 'KR',
  'south korea': 'KR',
  'czech republic': 'CZ',
  czechia: 'CZ',
  russia: 'RU',
  'russian federation': 'RU',
  vietnam: 'VN',
  'viet nam': 'VN',
  'ivory coast': 'CI',
  "cote d ivoire": 'CI',
  تركيا: 'TR',
  تركية: 'TR',
  الامارات: 'AE',
  الإمارات: 'AE',
  'الامارات العربية المتحدة': 'AE',
  'الإمارات العربية المتحدة': 'AE',
  السعودية: 'SA',
  'المملكة العربية السعودية': 'SA',
  قطر: 'QA',
  مصر: 'EG',
  الكويت: 'KW',
  البحرين: 'BH',
  عمان: 'OM',
  'المملكة المتحدة': 'GB',
  بريطانيا: 'GB',
  امريكا: 'US',
  أمريكا: 'US',
  'الولايات المتحدة': 'US',
};

export const normalizeCountryLabel = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[\s_.,/\\-]+/g, ' ')
    .replace(/\bthe\b/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const destinationLabels = destination =>
  [
    destination?.name,
    destination?.title,
    destination?.slug,
    destination?.name_ar,
    destination?.arabic_name,
    destination?.x_name_arabic,
  ]
    .map(normalizeCountryLabel)
    .filter(Boolean);

export const findEsimDestinationForCategory = (category, destinations) => {
  const list = Array.isArray(destinations) ? destinations : [];
  if (!category || !list.length) {
    return null;
  }

  const code = String(
    category.x_country_code || category.country_code || '',
  )
    .trim()
    .toUpperCase();

  if (code.length === 2) {
    const byCode = list.find(
      item => String(item.country_code || '').toUpperCase() === code,
    );
    if (byCode) {
      return byCode;
    }
  }

  const labels = [
    category.name,
    category.x_name_arabic,
    category.parentCategoryName,
    category.title,
  ]
    .map(normalizeCountryLabel)
    .filter(Boolean);

  for (const label of labels) {
    const mapped = COUNTRY_NAME_TO_CODE[label];
    if (!mapped) {
      continue;
    }
    const byAlias = list.find(
      item => String(item.country_code || '').toUpperCase() === mapped,
    );
    if (byAlias) {
      return byAlias;
    }
  }

  const exact = list.find(item =>
    destinationLabels(item).some(label => labels.includes(label)),
  );
  if (exact) {
    return exact;
  }

  // Fuzzy: "Türkiye" / "Republic of Turkey" vs API "Turkey"
  return (
    list.find(item => {
      const destLabels = destinationLabels(item);
      return labels.some(label =>
        destLabels.some(
          dest =>
            dest === label ||
            dest.includes(label) ||
            label.includes(dest),
        ),
      );
    }) || null
  );
};

export const openEsimPlans = (navigation, destination) => {
  if (!navigation || !destination) {
    return;
  }
  navigation.navigate('ESim', {
    state: {
      routes: [{ name: 'ESimPlans', params: { destination } }],
      index: 0,
    },
  });
};

export const resolveEsimDestinationForCategory = async category => {
  if (!category) {
    return null;
  }

  try {
    const items = await getCachedLocalEsimDestinations();
    const matched = findEsimDestinationForCategory(category, items);
    if (matched) {
      return matched;
    }
  } catch (error) {
    // Fall through to a targeted search when the full list is unavailable.
  }

  const searchTerms = [
    category.name,
    category.parentCategoryName,
    category.x_name_arabic,
    category.country_code,
    category.x_country_code,
  ].filter(Boolean);

  for (const searchTerm of searchTerms) {
    try {
      const data = await getEsimDestinations({
        type: 'local',
        search: searchTerm,
        page: 1,
        limit: 20,
      });
      const items = Array.isArray(data?.items) ? data.items : [];
      const matched = findEsimDestinationForCategory(category, items);
      if (matched) {
        return matched;
      }
      if (items.length === 1) {
        return items[0];
      }
    } catch (error) {
      // try next search term
    }
  }

  return null;
};

export const formatPlanLabel = (pkg, t) => {
  const days = pkg?.validity_days;
  if (pkg?.is_unlimited) {
    return t('ESim.unlimitedForDays', { days });
  }
  const data = pkg?.data || '';
  return t('ESim.dataForDays', { data, days });
};

export const formatPrice = (amount, currency = 'QAR') => {
  if (amount == null || amount === '') {
    return '';
  }
  const value = Number(amount);
  const formatted = Number.isFinite(value)
    ? value % 1 === 0
      ? String(value)
      : value.toFixed(2)
    : String(amount);
  return `${formatted} ${currency === 'QAR' ? 'QR' : currency}`;
};

export const splitDestinations = items => {
  const list = Array.isArray(items) ? items : [];
  const popular = [];
  const rest = [];
  list.forEach(item => {
    const code = (item.country_code || '').toUpperCase();
    if (POPULAR_COUNTRY_CODES.includes(code)) {
      popular.push(item);
    } else {
      rest.push(item);
    }
  });
  return { popular, rest };
};

export const isPaymentReturnUrl = url => {
  if (!url) {
    return false;
  }
  const lower = url.toLowerCase();
  return (
    lower.includes('esim/payment/callback') ||
    lower.includes('payment/success') ||
    lower.includes('status=paid') ||
    lower.includes('status=success')
  );
};

export const isEsimPaid = item =>
  !!(
    item?.is_completed ||
    item?.has_esim ||
    item?.payment_state === 'paid'
  );

export const formatRemainingData = (item, t) => {
  if (!item) {
    return t('ESim.usageUnavailable');
  }
  if (item.is_unlimited) {
    return t('ESim.unlimitedData');
  }
  const mb = Number(item.remaining_mb);
  if (!Number.isFinite(mb)) {
    return t('ESim.usageUnavailable');
  }
  if (mb >= 1024) {
    const gb = mb / 1024;
    const value = gb >= 10 ? gb.toFixed(0) : gb.toFixed(1);
    return t('ESim.remainingGb', { gb: value });
  }
  return t('ESim.remainingMb', { mb: Math.round(mb) });
};

export const formatEsimDate = value => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString();
};

export const formatEsimDateTime = value => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString();
};

export const parseLpa = lpa => {
  const raw = lpa ? String(lpa).trim() : '';
  if (!raw) {
    return { raw: '', smdp: '', activationCode: '' };
  }
  const parts = raw.replace(/^LPA:\d*/i, '').split('$').filter(Boolean);
  const smdpIndex = parts[0]?.includes('.') ? 0 : 1;
  return {
    raw,
    smdp: parts[smdpIndex] || '',
    activationCode: parts.slice(smdpIndex + 1).join('$'),
  };
};

const looksLikeFullLpa = value => {
  const raw = String(value || '').trim();
  if (!raw || !raw.includes('$')) {
    return false;
  }
  const parts = raw.replace(/^LPA:\d*/i, '').split('$').filter(Boolean);
  const host = parts[0]?.includes('.') ? parts[0] : parts[1];
  const matching = parts[0]?.includes('.') ? parts[1] : parts[2];
  return !!(host && matching);
};

const normalizeSmdpHost = value => {
  let host = String(value || '').trim();
  if (!host) {
    return '';
  }
  host = host.replace(/^LPA:\d*/i, '').replace(/^\$+/, '');
  if (host.includes('$')) {
    const parsed = parseLpa(host.includes('LPA:') ? host : `LPA:1$${host}`);
    host = parsed.smdp || host.split('$').filter(Boolean)[0] || '';
  }
  return host.replace(/^https?:\/\//i, '').split('/')[0].trim();
};

const isDummyMatchingId = value =>
  /dummy|sandbox/i.test(String(value || '').trim());

const withLpaPrefix = value => {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }
  return /^LPA:/i.test(raw) ? raw : `LPA:1$${raw}`;
};

export const resolveEsimLpa = profile => {
  if (!profile || typeof profile !== 'object') {
    return '';
  }

  const fullCandidates = [
    profile.qr_code_data,
    profile.qrcode,
    profile.lpa,
  ];
  for (const candidate of fullCandidates) {
    if (looksLikeFullLpa(candidate)) {
      return withLpaPrefix(candidate);
    }
  }

  const matching = String(
    profile.matching_id || profile.activation_code || '',
  ).trim();
  const lpaField = String(profile.lpa || '').trim();
  const hostFromLpa =
    lpaField && !lpaField.includes('$') && lpaField.includes('.')
      ? normalizeSmdpHost(lpaField)
      : '';
  const smdp =
    hostFromLpa ||
    normalizeSmdpHost(profile.smdp_address || profile.smdp || '');

  if (smdp && matching) {
    return `LPA:1$${smdp}$${matching}`;
  }
  return lpaField;
};

export const isSandboxEsimProfile = profile => {
  if (!profile) {
    return false;
  }
  const matching = String(
    profile.matching_id || profile.activation_code || '',
  ).trim();
  const host = normalizeSmdpHost(
    profile.lpa || profile.smdp_address || profile.smdp || '',
  );
  return isDummyMatchingId(matching) || /sandbox/i.test(host);
};

export const resolveEsimInstallDetails = profile => {
  const lpa = resolveEsimLpa(profile);
  const parsed = parseLpa(lpa);
  const smdp = String(
    parsed.smdp ||
      normalizeSmdpHost(profile?.lpa) ||
      profile?.smdp_address ||
      profile?.smdp ||
      '',
  ).trim();
  const activationCode = String(
    parsed.activationCode ||
      profile?.matching_id ||
      profile?.activation_code ||
      '',
  ).trim();
  return { lpa, smdp, activationCode };
};

const ACTIVE_ESIM_STATUSES = new Set(['active', 'enabled', 'installed']);
const ENDED_ESIM_STATUSES = new Set([
  'expired',
  'finished',
  'recycled',
  'revoked',
  'disabled',
  'cancelled',
  'canceled',
]);
const ESIM_STATUS_ALIASES = {
  not_actived: 'not_active',
  not_activated: 'not_active',
};

export const esimProviderStatus = usage => {
  const key = String(usage?.provider_status || usage?.status || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  return ESIM_STATUS_ALIASES[key] || key;
};

export const isEsimActivated = usage =>
  ACTIVE_ESIM_STATUSES.has(esimProviderStatus(usage));

export const esimStatusTone = usage => {
  const status = esimProviderStatus(usage);
  if (ACTIVE_ESIM_STATUSES.has(status)) {
    return 'success';
  }
  if (ENDED_ESIM_STATUSES.has(status)) {
    return 'ended';
  }
  return 'pending';
};

const humanizeEsimStatus = value =>
  String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());

export const formatEsimProviderStatus = (usage, t) => {
  const raw = usage?.provider_status || usage?.status;
  if (!raw) {
    return t('ESim.notActivated');
  }
  const key = esimProviderStatus(usage);
  return t(`ESim.status.${key}`, { defaultValue: humanizeEsimStatus(raw) });
};

export const translationList = (t, key, options) => {
  const value = t(key, { returnObjects: true, ...options });
  return Array.isArray(value) ? value : [];
};

export const pickActiveUsage = items => {
  const list = Array.isArray(items) ? items : [];
  return (
    list.find(item => /active/i.test(item?.provider_status || '')) || list[0]
  );
};

export const topupPrice = item => {
  if (!item) {
    return { amount: null, currency: 'QAR' };
  }
  return {
    amount: item.price?.total ?? item.total_price ?? item.price,
    currency: item.price?.currency || item.currency || 'QAR',
  };
};

const checkoutCache = {};

export const rememberEsimCheckout = (orderReference, payload = {}) => {
  if (!orderReference) {
    return;
  }
  checkoutCache[orderReference] = {
    ...(checkoutCache[orderReference] || {}),
    ...payload,
  };
};

export const getRememberedEsimCheckout = orderReference =>
  checkoutCache[orderReference] || null;

export const appleEsimInstallUrl = (lpa, directUrl) => {
  let activation = looksLikeFullLpa(lpa) ? String(lpa).trim() : '';
  if (!activation && directUrl) {
    try {
      const parsed = new URL(String(directUrl));
      activation = parsed.searchParams.get('carddata') || '';
    } catch (error) {
      activation = looksLikeFullLpa(directUrl) ? String(directUrl).trim() : '';
    }
  }
  if (!looksLikeFullLpa(activation)) {
    return null;
  }
  activation = withLpaPrefix(activation);
  return `https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=${encodeURIComponent(
    activation,
  )}`;
};

const ANDROID_EUICC_ACTIVATION =
  'android.telephony.euicc.action.START_EUICC_ACTIVATION';

const openAndroidEsimInstaller = async lpa => {
  if (lpa) {
    try {
      await Linking.openURL(lpa);
      return;
    } catch (error) {
      // Most Androids have no LPA URL handler. Try the system eSIM intent next.
    }
  }

  if (typeof Linking.sendIntent !== 'function') {
    throw new Error('install_unsupported');
  }

  // Never fire this intent without the activation payload — that opens empty
  // eSIM Settings and shows a system error. Extra key names vary by OEM.
  const extras = lpa
    ? [
        { key: 'activationCode', value: lpa },
        { key: 'activation_code', value: lpa },
      ]
    : null;
  if (!extras) {
    throw new Error('missing_lpa');
  }

  await Linking.sendIntent(ANDROID_EUICC_ACTIVATION, extras);
};

export const installEsimOnDevice = async ({
  lpa,
  appleUrl,
} = {}) => {
  if (Platform.OS === 'ios') {
    const url = appleEsimInstallUrl(lpa, appleUrl);
    if (!url) {
      throw new Error('missing_lpa');
    }
    await Linking.openURL(url);
    return;
  }

  await openAndroidEsimInstaller(lpa);
};

const cancelledOrdersKey = userId =>
  `esim_cancelled_orders_${userId || 'guest'}`;

export const hideCancelledEsimOrder = async (orderReference, userId) => {
  if (!orderReference) {
    return;
  }
  const key = cancelledOrdersKey(userId);
  let list = [];
  try {
    const raw = await AsyncStorage.getItem(key);
    list = raw ? JSON.parse(raw) : [];
  } catch (error) {
    list = [];
  }
  if (!list.includes(orderReference)) {
    list.push(orderReference);
    await AsyncStorage.setItem(key, JSON.stringify(list));
  }
};

export const getCancelledEsimOrders = async userId => {
  try {
    const raw = await AsyncStorage.getItem(cancelledOrdersKey(userId));
    const list = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(list) ? list : []);
  } catch (error) {
    return new Set();
  }
};

export const unhideCancelledEsimOrder = async (orderReference, userId) => {
  if (!orderReference) {
    return;
  }
  const key = cancelledOrdersKey(userId);
  try {
    const raw = await AsyncStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const next = (Array.isArray(list) ? list : []).filter(
      item => item !== orderReference,
    );
    await AsyncStorage.setItem(key, JSON.stringify(next));
  } catch (error) {
    // Ignore storage errors so the paid order can still be shown.
  }
};

export const withoutCancelledEsimOrders = (items, cancelled) => {
  const hidden = cancelled instanceof Set ? cancelled : new Set(cancelled || []);
  return (items || []).filter(item => {
    if (!hidden.has(item.order_reference)) {
      return true;
    }
    return isEsimPaid(item);
  });
};
