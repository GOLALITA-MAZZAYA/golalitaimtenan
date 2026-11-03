import { org, GOLALITA_COMPANY_ORGANIZATION_ID } from '../config';

// Shape assertions, not value assertions, so this stays valid once a future
// client's config replaces these values.
test('org config has the required shape', () => {
  expect(typeof org.id).toBe('number');
  expect(typeof org.code).toBe('string');
  expect(typeof org.displayName).toBe('string');
  expect(typeof org.baseDomain).toBe('string');
  expect(typeof org.baseUrl).toBe('string');
  expect(typeof org.urlScheme).toBe('string');
  expect(typeof org.supportEmail).toBe('string');
  expect(Array.isArray(org.contactEmails)).toBe(true);
  expect(Array.isArray(org.supportMobile)).toBe(true);
  expect(typeof org.mumayizatEmail).toBe('string');
  expect(typeof org.guestEmail).toBe('string');
  expect(typeof org.androidPackage).toBe('string');
  expect(typeof org.iosBundleId).toBe('string');
  expect(typeof org.iosTeamId).toBe('string');
  expect(Array.isArray(org.signInCertHashes)).toBe(true);
  expect(org.signInCertHashes.length).toBeGreaterThan(0);
  expect(typeof org.debugSignInCertHash).toBe('string');
  expect(org.signInCertHashes).not.toContain(org.debugSignInCertHash);
  expect(typeof org.storeUrls).toBe('object');
  expect(typeof org.storeUrls.ios).toBe('string');
  expect(typeof org.storeUrls.android).toBe('string');
  expect(typeof org.storeUrls.huawei).toBe('string');
});

test('contactEmails includes supportEmail rather than duplicating it as a literal', () => {
  expect(org.contactEmails).toContain(org.supportEmail);
});

test('urlScheme ends with "://"', () => {
  expect(org.urlScheme.endsWith('://')).toBe(true);
});

test('org.colors has the required shape', () => {
  expect(typeof org.colors).toBe('object');
  ['light', 'dark'].forEach(mode => {
    expect(typeof org.colors[mode].base).toBe('object');
    ['darkBlue', 'navyBlue', 'darkModeBackground', 'mainDarkMode', 'mainDarkModeText', 'grey', 'secBlue']
      .forEach(key => {
        expect(typeof org.colors[mode].base[key]).toBe('string');
      });
  });
});

// darkModeBackground/mainDarkMode/mainDarkModeText/grey/secBlue have no
// light/dark variant in ThemeProvider.jsx's setScheme() today — only
// darkBlue/navyBlue are actually mutated between themes. If a future edit
// gives these 5 keys diverging light/dark values, it silently invents a
// theme distinction that doesn't exist in the app, which is exactly the
// class of bug this migration is meant to avoid introducing.
test('org.colors: theme-invariant base keys stay identical between light and dark', () => {
  ['darkModeBackground', 'mainDarkMode', 'mainDarkModeText', 'grey', 'secBlue'].forEach(key => {
    expect(org.colors.light.base[key]).toBe(org.colors.dark.base[key]);
  });
});

test('org.defaultTheme is "dark" or "light"', () => {
  expect(['dark', 'light']).toContain(org.defaultTheme);
});

// loyalty/charity/main groups: key sets only need to match *within* a
// theme pair (light vs dark), not against each other — colors.js's own
// loyaltyDarkColors/loyaltyLightColors etc. have never guaranteed identical
// key sets between light and dark (e.g. mainDarkColors has `pendingStatus`,
// mainLightColors has `pendingText` — a pre-existing inconsistency, not
// introduced by this migration). This just checks both themes' groups
// exist and are non-empty objects of strings.
test('org.colors loyalty/charity/main groups are populated for both themes', () => {
  ['light', 'dark'].forEach(mode => {
    ['loyalty', 'charity', 'main'].forEach(group => {
      const obj = org.colors[mode][group];
      expect(typeof obj).toBe('object');
      const keys = Object.keys(obj);
      expect(keys.length).toBeGreaterThan(0);
      keys.forEach(key => {
        expect(typeof obj[key]).toBe('string');
      });
    });
  });
});

test('GOLALITA_COMPANY_ORGANIZATION_ID is a positive integer', () => {
  expect(Number.isInteger(GOLALITA_COMPANY_ORGANIZATION_ID)).toBe(true);
  expect(GOLALITA_COMPANY_ORGANIZATION_ID).toBeGreaterThan(0);
});
