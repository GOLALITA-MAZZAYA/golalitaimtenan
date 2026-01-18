import React from "react";
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

const PhoneIcon = sized(PhoneSvg, 120, 160);

const CONFIG = {
  ios: "https://apps.apple.com/in/app/golalita-rewards-and-discount/id1589276214",
  android: "https://play.google.com/store/apps/details?id=com.golalitaimtenanrewards",
};

const UpdateModal = ({ updateModal, setUpdateModal, version }) => {
  const { t } = useTranslation();

  const handleLinkPress = () => {
    Linking.openURL(CONFIG[Platform.OS]);
  };

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
            padding: 20,
            justifyContent: "space-between",
            minHeight: SCREEN_HEIGHT / 1.9,
            width: (SCREEN_WIDTH / 100) * 90,
            backgroundColor: colors.white,
            borderRadius: 8,
            position: "relative",
            zIndex: 1000,
          },
        ]}
      >
        <View style={mainStyles.centeredRow}>
          <PhoneIcon />
        </View>
        <TypographyText
          textColor={colors.black}
          size={26}
          font={BALOO_SEMIBOLD}
          title={
            updateModal === "easy"
              ? t("Profile.updateApp")
              : t("Profile.outdatedApp")
          }
          style={[mainStyles.centeredText, { marginTop: 30 }]}
        />
        <TypographyText
          textColor={colors.black}
          size={20}
          font={BALOO_REGULAR}
          title={
            updateModal === "easy"
              ? t("Profile.updateAppDescription")
              : t("Profile.updateAppDescription")
          }
          style={[mainStyles.centeredText, { marginTop: 30 }]}
        />
        <TypographyText
          textColor={colors.black}
          size={20}
          font={BALOO_REGULAR}
          title={`v${version}`}
          style={mainStyles.centeredText}
        />
        {updateModal === "hard" ? (
          <CommonButton
            onPress={handleLinkPress}
            label={"Update"}
            style={{ marginTop: 30 }}
          />
        ) : (
          <View style={[mainStyles.betweenRow, { marginTop: 30 }]}>
            <CommonButton
              style={{ backgroundColor: colors.grey, width: "47%" }}
              label={t("Drawer.cancel")}
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
