import React from "react";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { useTheme } from "../../components/ThemeProvider";
import { useTranslation } from "react-i18next";

const SettingsHeader = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return <CommonHeader label={t("Settings.settings")} isWhite={isDark} />;
};

export default SettingsHeader;
