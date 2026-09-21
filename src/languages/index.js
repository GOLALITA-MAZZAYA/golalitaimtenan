import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import esimHelpAr from "./locales/esimHelp.ar.json";
import esimHelpEn from "./locales/esimHelp.en.json";

en.translation.ESimHelp = esimHelpEn;
ar.translation.ESimHelp = esimHelpAr;

const resources = {
  ar,
  en,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    lng: "en",
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
