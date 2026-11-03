// Single source of truth for everything that varies per white-label client.
// ETIZAZ / QCB fork — ported from Golalita-APP's src/org/config.js (whose
// Phases 2.0-2.5 migration is complete there). In THIS app nothing reads
// this file yet: wiring colors.js / ThemeProvider.jsx / constants.js to it
// is the next step. Once wired, editing values here has immediate runtime
// effect. Security-sensitive consumers will include SSL pinning
// (src/api/ssl.js) and the org_id embedded in E2E-encrypted request
// envelopes (src/utils/e2ee.js).
import { IS_PRODUCTION } from '../constants';

// Local consts so later fields below can reference earlier ones — an object
// literal can't read its own properties while still being defined.
const baseDomain = "golalita.com";
const supportEmail = "support@golalita.com";

// Dashboard Organization.id for GoLalita Company (admin panel on
// wallet-api.golalitatwffer.com). Used as the wallet fallback org id.
export const GOLALITA_COMPANY_ORGANIZATION_ID = 11;

export const org = {
  // --- Backend identity ---
  id: 155723,
  code: "qcb",
  // Human-readable brand name shown to users — distinct from `code` (the
  // lowercase machine identifier sent to the backend).
  displayName: "ETIZAZ - اعتزاز",
  versionAppName: "Etizaz",
  versionOrganisation: "", // APP_VERSIONS_ORGANISATION filter

  // --- Domain & current environment ---
  baseDomain,
  baseUrl: IS_PRODUCTION ? `www.${baseDomain}` : `gcptest.${baseDomain}`,
  // Must stay in sync with Navigation/config.js's `prefixes` and the native
  // app.json/Info.plist/AndroidManifest scheme registration.
  urlScheme: "golalitaimtenanrewards://",

  // --- Contact ---
  supportEmail,
  contactEmails: ["sales@golalita.com", "ETIZAZ.QCB@qcb.gov.qa"],
  supportMobile: ["0097441410399", "0097441410398"],
  mumayizatEmail: "mumayizat@golalita.com",
  // Fallback guest login used today by components/ContinueAsGuestBtn
  // (FALLBACK_GUEST_LOGIN). Every sibling white-label app has its own
  // backend-provisioned guest account; this is the QCB one. Note: Contact Us
  // in this app lists sales + the QCB address only, so supportEmail is
  // deliberately not part of contactEmails above.
  guestEmail: "guest@qcb.com",

  // --- Native application identity (mirrors the native project files; kept
  // here too because the freeRASP integrity check reads these from JS) ---
  androidPackage: "com.golalitaimtenanrewards",
  iosBundleId: "com.golalitaimtenanrewards.ios",
  iosTeamId: "V83QSUA898",
  signInCertHashes: [
    // Google Play App Signing key (49:9F:34:2E:...:03:66, Play Console > App integrity)
    "SZ80LhJ+7l3L1tzEnW+ZYwr1u3/YK/ee68+BRsuCA2Y=",
    // Play Store upload keystore (keystore.jks)
    "lpr+k9mCvVp15BLg4aV8wWxE2hagiadP8HqoGEDsG84=",
  ],
  // android/app/debug.keystore — the stock React Native debug keystore, which
  // is public. Kept out of signInCertHashes so a repackaged APK re-signed
  // with it can't pass the integrity check; only trusted in __DEV__ builds.
  debugSignInCertHash: "+sYXRdwJA3hvue3mKpYrOZ9zSPC7b4mbgzJmdZEDO5w=",

  // --- App store listing links ---
  storeUrls: {
    ios: "https://apps.apple.com/us/app/etizaz-اعزاز/id6758722117",
    android: "https://play.google.com/store/apps/details?id=com.golalitaimtenanrewards",
    huawei: `https://appgallery.huawei.com/search/${encodeURIComponent("Etizaz")}`, // no AppGallery id yet
  },

  // --- Branding ---
  // `base` is the 7 brand-tinted keys from colors.js's flat base block
  // (its other ~14 true neutrals — white, bg, red, etc. — are identical
  // across every fork and stay hardcoded in colors.js).
  //
  // darkModeBackground/mainDarkMode/mainDarkModeText/grey/secBlue have no
  // light/dark variant today — ThemeProvider.setScheme() only ever mutates
  // darkBlue/navyBlue between themes. Those 5 keys MUST stay identical
  // between colors.light.base and colors.dark.base (enforced by
  // config.test.js) or this silently invents a light/dark distinction that
  // doesn't exist in the app today.
  //
  // `loyalty`/`charity`/`main` are colors.js's loyaltyDarkColors/
  // loyaltyLightColors/charitiesDarkColors/charitiesLightColors/
  // mainDarkColors/mainLightColors blocks verbatim — these genuinely vary
  // per white-label fork (confirmed: sibling forks ship materially
  // different values here, not just cosmetic tweaks) and are the bulk of
  // the app's actual visible color usage, unlike the narrower `base` set.
  colors: {
    light: {
      base: {
        darkBlue: "#a29475",
        navyBlue: "#072536",
        darkModeBackground: "#000",
        mainDarkMode: "#DDBD6B",
        mainDarkModeText: "#000",
        grey: "#a29475",
        secBlue: "#072536",
      },
      loyalty: {
        loyaltyTextMain: "#a29475",
        loyaltyTextMainTitle: "#000",
        loyaltyTextSecondary: "#616060",
        loyaltyTextSecondary2: "#6B6B6C",
        loyaltyTextSecondary3: "#000",
        loyaltyTextPrimary: "#a29475",
        loyaltyCardBackground: "#D9D9D9",
        loyaltyMainBorder: 'transparent',
        loyaltyBtnTextPrimary: "#fff",
        loyaltyBtnTextRegular: "#a29475",
        loyaltyBackground: "#000",
        loyaltyPrimary: "#a29475",
        loyaltySecondary: "#B1B1B4",
        loyaltySecondary2: "#2E2E2E",
        loyaltyActiveTabText: "#fff",
        loyaltyTabsBackground: "#fff",
        loyaltyTabsBorder: '#fff',
        loyaltyGiftCardText: '#000',
        loyaltyRadioBorder: "#a29475",
        loyaltyRadioBorderActive: "#fff",
        loyaltyTextInputText: "#616060",
        loyaltyTextInputTextActive: "#fff",
        loyaltyCardExpiringText: "#000",
        loyaltyExpiringCard: '#fff',
        loyaltyPrimaryIconBackground: '#BFB5B5',
        loyaltyThumbColor: '#a29475',
        loyaltyThumbActive: '#fff',
        loyaltySwitchBackground: '#fff',
        loyaltySwitchBackgroundActive: '#a29475',
        loyaltySelectBackground: "#E8E8E8",
        loyaltyCameraModalBackground: "#fff",
        loyaltyCameraIconBackground: "#BFB5B5",
      },
      charity: {
        charityBackground: '#fff',
      },
      main: {
        mainBorder: 'transparent',
        cardBackground: "#D9D9D9",
        primary: "#a29475",
        secondary: "#616060",
        textPrimary: "#a29475",
        mainText: "#000",
        textSecondary: "#616060",
        textForPrimaryBlock: "#fff",
        linkColor: "#8C7D5C",
        primaryBorderLight: "#fff",
        smallCardBackground: '#fff',
        tagsColor: '#616060',
        pendingText: '#C37153',
        confirmedStatus: '#53C361',
        online: '#53C361',
        offline: "#9A9A9A",
        canceled: '#EF4444',
        statusCardBackground: '#fff',
        statusCardBorder: "transparent",
        btnPrimaryBtnBackground: "#a29475",
        btnPrimaryBtnText: '#fff',
      },
    },
    dark: {
      base: {
        darkBlue: "#000",
        navyBlue: "#000",
        darkModeBackground: "#000",
        mainDarkMode: "#DDBD6B",
        mainDarkModeText: "#000",
        grey: "#a29475",
        secBlue: "#072536",
      },
      loyalty: {
        loyaltyTextMain: "#fff",
        loyaltyTextMainTitle: "#fff",
        loyaltyTextSecondary: "#B1B1B4",
        loyaltyTextSecondary2: "#6B6B6C",
        loyaltyTextSecondary3: "#6B6B6C",
        loyaltyTextPrimary: "#D7BC76",
        loyaltyCardBackground: "#0F0F0F",
        loyaltyMainBorder: '#1B1B1B',
        loyaltyBtnTextPrimary: "#000",
        loyaltyBtnTextRegular: "#D7BC76",
        loyaltyBackground: "#000",
        loyaltyPrimary: "#D7BC76",
        loyaltySecondary: "#B1B1B4",
        loyaltySecondary2: "#2E2E2E",
        loyaltyActiveTabText: "#000",
        loyaltyTabsBackground: "#0F0F0F",
        loyaltyTabsBorder: '#D7BC76',
        loyaltyGiftCardText: '#fff',
        loyaltyRadioBorder: "#272727",
        loyaltyRadioBorderActive: "#fff",
        loyaltyTextInputText: "#B1B1B4",
        loyaltyTextInputTextActive: "#fff",
        loyaltyCardExpiringText: '#B1B1B4',
        loyaltyExpiringCard: '#0F0F0F',
        loyaltyPrimaryIconBackground: '#211F1B',
        loyaltyThumbColor: '#000',
        loyaltyThumbActive: '#000',
        loyaltySwitchBackground: '#333333',
        loyaltySwitchBackgroundActive: '#D7BC76',
        loyaltySelectBackground: "#2E2E2E",
        loyaltyCameraModalBackground: "#2E2E2E",
        loyaltyCameraIconBackground: "#080808",
      },
      charity: {
        charityBackground: '#000',
      },
      main: {
        mainBorder: '#514735',
        cardBackground: "#2E2E2E",
        primary: "#D7BC76",
        secondary: "#B1B1B4",
        textPrimary: "#D7BC76",
        mainText: "#fff",
        textSecondary: "#B1B1B4",
        textForPrimaryBlock: "#000",
        linkColor: '#D4AF37',
        primaryBorderLight: "#514735",
        smallCardBackground: "#0F0F0F",
        tagsColor: '#fff',
        pendingStatus: '#C37153',
        confirmedStatus: '#53C361',
        online: '#53C361',
        offline: "#9A9A9A",
        canceled: '#EF4444',
        statusCardBackground: 'transparent',
        statusCardBorder: "#D7BC76",
        btnPrimaryBtnBackground: "#2E2E2E",
        btnPrimaryBtnText: "#D7BC76",
      },
    },
  },

  // First-launch / initial-render theme, before any AsyncStorage preference
  // is saved. This app's ThemeProvider.jsx uses useState(false) and falls
  // back to 'light' when nothing is stored (Golalita-APP defaults to 'dark').
  // ETIZAZ's current behavior is 'light', ported verbatim.
  defaultTheme: 'light',

  // --- Payments ---
  // Display name of the currently integrated payment gateway. Was a literal
  // "SkipCash" duplicated in ESim's UI copy and both en/ar translation files
  // (never actually localized, since it's a brand name). Centralizing it here
  // means a future second gateway is a one-line change, not a translation-file
  // hunt. SkipCash is Qatar-specific — this is a display-name value only, not
  // a signal that other gateways/currencies are supported (see
  // country-detection-frontend-tasks.md Tier 3 for that).
  paymentGatewayName: 'SkipCash',
};

