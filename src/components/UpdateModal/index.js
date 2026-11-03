import React, { useMemo } from "react";
import { Linking, Platform, View } from "react-native";
import {
  mainStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../styles/mainStyles";
import PhoneSvg from "../../assets/app_update.svg";
import { sized } from "../../Svg";
import { colors } from "../colors";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";
import { TypographyText } from "../Typography";
import { useTranslation } from "react-i18next";
import CommonButton from "../CommonButton/CommonButton";
import CommonButtonSecondary from "../CommonButtonSecondary/CommonButtonSecondary";
import { org } from "../../org/config";
import { useTheme } from "../ThemeProvider";

const Brand = Platform.constants.Brand;
const Manufacturer = Platform.constants.Manufacturer;

const UpdateModal = ({ updateModal, setUpdateModal, version }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const PhoneIcon = useMemo(
    () => sized(PhoneSvg, 90, 130, isDark ? (colors.mainDarkMode || "#DDBD6B") : colors.darkBlue),
    [isDark]
  );

  const handleLinkPress = () => {
    (Manufacturer === "HUAWEI" || Brand === "HUAWEI") && org.storeUrls.huawei
      ? Linking.openURL(org.storeUrls.huawei)
      : Linking.openURL(org.storeUrls[Platform.OS]);
  };

  const cardBg = isDark ? "#000000" : colors.white;
  const borderColor = isDark ? (colors.borderGrey || "#333333") : "transparent";
  const titleColor = isDark ? colors.white : colors.black;
  const descColor = isDark ? (colors.secondary || "#B1B1B4") : "#616060";
  const versionColor = isDark ? (colors.mainDarkMode || "#DDBD6B") : colors.darkBlue;

  return (
    <View
      style={[
        mainStyles.overlay,
        { alignItems: "center", justifyContent: "center" },
      ]}
    >
      <View
        style={[
          {
            padding: 24,
            justifyContent: "space-between",
            minHeight: SCREEN_HEIGHT / 2,
            width: (SCREEN_WIDTH / 100) * 88,
            backgroundColor: cardBg,
            borderRadius: 16,
            borderWidth: isDark ? 1 : 0,
            borderColor: borderColor,
            position: "relative",
            zIndex: 1000,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
          },
        ]}
      >
        <View style={mainStyles.centeredRow}>
          <PhoneIcon />
        </View>
        <TypographyText
          textColor={titleColor}
          size={24}
          font={BALOO_SEMIBOLD}
          title={
            updateModal === "easy"
              ? t("Profile.updateApp")
              : t("Profile.outdatedApp")
          }
          style={[mainStyles.centeredText, { marginTop: 20 }]}
        />
        <TypographyText
          textColor={descColor}
          size={17}
          font={BALOO_REGULAR}
          title={
            updateModal === "easy"
              ? t("Profile.updateAppDescription")
              : t("Profile.updateAppDescription")
          }
          style={[mainStyles.centeredText, { marginTop: 12 }]}
        />
        <TypographyText
          textColor={versionColor}
          size={18}
          font={BALOO_SEMIBOLD}
          title={`v${version}`}
          style={[mainStyles.centeredText, { marginTop: 8 }]}
        />
        {updateModal === "hard" ? (
          <CommonButton
            onPress={handleLinkPress}
            label={"Update"}
            style={{ marginTop: 24 }}
          />
        ) : (
          <View style={[mainStyles.betweenRow, { marginTop: 24 }]}>
            <CommonButtonSecondary
              style={{
                width: "47%",
                borderColor: isDark ? (colors.mainDarkMode || "#DDBD6B") : colors.darkBlue,
              }}
              label={t("Drawer.cancel")}
              textColor={isDark ? (colors.mainDarkMode || "#DDBD6B") : colors.darkBlue}
              onPress={() => setUpdateModal(null)}
            />
            <CommonButton
              onPress={handleLinkPress}
              label={"Update"}
              style={{ width: "47%" }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default UpdateModal;
