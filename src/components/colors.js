import { org } from '../org/config';

// loyalty/charity/main blocks below are references into org.colors, not
// copies — ThemeProvider.jsx's Object.entries(loyaltyDarkColors).forEach()
// etc. works identically on them either way, and this keeps colors.js as
// the single place every consumer imports from while org/config.js stays
// the single place the actual values live.
export const loyaltyDarkColors = org.colors.dark.loyalty;

export const loyaltyLightColors = org.colors.light.loyalty;

export const charitiesDarkColors = org.colors.dark.charity;

export const charitiesLightColors = org.colors.light.charity;

export const mainDarkColors = org.colors.dark.main;

export const mainLightColors = org.colors.light.main;

// Default (pre-ThemeProvider-mount) values for the 7 brand-tinted keys come
// from org.colors.light.base — matches this block's previous literals
// exactly, since the app's static default was always the light-mode value.
// ThemeProvider.setScheme() overwrites these at runtime (see 2.4c).
export let colors = {
  darkBlue: org.colors.light.base.darkBlue,
  navyBlue: org.colors.light.base.navyBlue,
  darkModeBackground: org.colors.light.base.darkModeBackground,
  mainDarkMode: org.colors.light.base.mainDarkMode,
  mainDarkModeText: org.colors.light.base.mainDarkModeText,
  white: "#ffffff",
  bg: "#F0F0F0",
  grey: org.colors.light.base.grey,
  lightGrey: "#DDDFE4",
  darkGrey: "#838383",
  green: "#2DC8D8",
  lightGreen: "#8DDDAD",
  success: "#54C261",
  orange: "#FFB800",
  blue: "#4FA7F8",
  red: "#ED544C",
  secBlue: org.colors.light.base.secBlue,
  black: "#000000",
  transparent: "transparent",
  highlatedGrey: "#EDEDED",
  borderGrey: "#2F2F2F",
  categoryGrey: "#313131",
  ...loyaltyLightColors,
  ...charitiesLightColors,
  ...mainLightColors
};
