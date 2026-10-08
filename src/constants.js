export const HEADER_HEIGHT = 80;
export const MUMAYIZATEMAIL = "mumayizat@golalita.com";
export const BASE_DOMAIN = "golalita.com";
// Must use www — apex golalita.com 308-redirects to www and strips
// Authorization headers (breaks AI chat Bearer JWT and similar POSTs).
export const BASE_URL = `www.${BASE_DOMAIN}`;
export const SUPPORT_EMAIL = "support@golalita.com";
export const ORG_ID = 155723;
export const ORG_CODE = "qcb";
export const CONTACT_EMAILS = [
    'sales@golalita.com',
    'ETIZAZ.QCB@qcb.gov.qa',
];
export const CHARITY_MERCHANT_IDS = [165105, 164127, 165389, 165103, 164585, 165104];

// Public /go/api/public/app/versions filters (partial, case-insensitive match).
// Update these once the app profile is registered in GoLalita admin.
export const APP_VERSIONS_APP_NAME = 'Etizaz';
export const APP_VERSIONS_ORGANISATION = '';

// --- GlobalTix ticketing partner API credentials ---
export const GLOBALTIX_USERNAME = "r014361-api@globaltix.com";
export const GLOBALTIX_AGENT = "R014361";
export const GLOBALTIX_API_KEY = "be67d9255f3e6e94db4fb16d5c092a405452761a87dbf3f5761cf21fce3e958b";

export const GLOBALTIX_PROD_USERNAME = "r018744-api@globaltix.com";
export const GLOBALTIX_PROD_AGENT = "R018744";
export const GLOBALTIX_PROD_API_KEY = "ef29b0de4d493086cdd7051917c54ef9d8b197b670e8ea19d0196d2494b7366d";

// --- Security Configurations ---
export const IS_PRODUCTION = !__DEV__;
export const ANDROID_PACKAGE_NAME = "com.golalitaimtenanrewards";
export const IOS_PACKAGE_NAME = "com.golalitaimtenanrewards.ios";
export const IOS_TEAM_ID = "V83QSUA898";
export const SUPPORTMAIL = SUPPORT_EMAIL;

export const SIGN_IN_CERTIFICATE_HASHES = [
  // Play Store / Production signing key
  "SZ80LhJ+7l3L1tzEnW+ZYwr1u3/YK/ee68+BRsuCA2Y=",
  // Debug keystore — local development builds
  "+sYXRdwJA3hvue3mKpYrOZ9zSPC7b4mbgzJmdZEDO5w=",
];

export const ENFORCE_CODE_OBFUSCATION = true;

export const FREERASP_MALWARE_CONFIG = {
  blacklistedPackageNames: [
    "com.topjohnwu.magisk",
    "com.koushikdutta.superuser",
    "eu.chainfire.supersu",
    "com.noshufou.android.su",
    "com.thirdparty.superuser",
    "com.yellowes.su",
    "com.kingroot.kinguser",
    "com.devadvance.rootcloak",
    "com.formyhm.hideroot",
    "de.robv.android.xposed.installer",
    "org.meowcat.edxposed.manager",
    "io.github.lsposed.manager",
    "com.saurik.substrate",
    "com.chelpus.luckypatcher",
    "com.dimonvideo.luckypatcher",
  ],
  suspiciousPermissions: [
    [
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_PHONE_STATE",
    ],
    ["android.permission.SYSTEM_ALERT_WINDOW", "android.permission.READ_SMS"],
  ],
  whitelistedInstallationSources: ["com.android.vending"],
};
