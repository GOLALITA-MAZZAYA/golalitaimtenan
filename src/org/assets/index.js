// Branding assets, centralized. A new white-label fork replaces the files in
// this folder (keeping the same names) rather than editing every screen.
//
// Copied from where screens load them today:
//   logo.png    <- assets/logo.png        (Login, Register, OnBoarding, headers, map marker, ...)
//   card_bg.jpg <- src/assets/card_bg.jpg (components/Card)
//   splash.gif  <- src/assets/golalita.gif (components/SplashScreenModal)
//   logo-mono.png <- src/assets/logo.png  (black Etizaz logo: Register, CreatePassword)
export const logo = require('./logo.png');
export const logoMono = require('./logo-mono.png');
export const splash = require('./splash.gif');
export const cardBg = require('./card_bg.jpg');
