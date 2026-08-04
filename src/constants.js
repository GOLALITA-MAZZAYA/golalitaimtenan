export const HEADER_HEIGHT = 80;
export const MUMAYIZATEMAIL = "mumayizat@golalita.com";
export const BASE_DOMAIN = "golalita.com";
export const BASE_URL = `${BASE_DOMAIN}`;
export const SUPPORT_EMAIL = "support@golalita.com";
export const ORG_ID = 155723;
export const ORG_CODE = "qcb";
export const CONTACT_EMAILS = [
    'sales@golalita.com',
    'ETIZAZ.QCB@qcb.gov.qa',
];
export const CHARITY_MERCHANT_IDS = [165105, 164127, 165389, 165103, 164585, 165104];

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

export const ENFORCE_CODE_OBFUSCATION = !__DEV__;

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
