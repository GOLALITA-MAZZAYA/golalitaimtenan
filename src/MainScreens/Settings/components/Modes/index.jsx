import { Image, StyleSheet, View } from "react-native";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../components/ThemeProvider";
import { sized } from "../../../../Svg";
import LightThemeActiveSvg from "../../../../assets/light_theme_selected.svg";
import DarkThemeActiveSvg from "../../../../assets/dark_theme_selected.svg";
import DarkThemeDarkSvg from "../../../../assets/dark_theme_dark.svg";
import LightThemeDarkSvg from "../../../../assets/light_theme_dark.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TwoButtons from "../../../../components/TwoButtons/TwoButtons";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import { mainStyles } from "../../../../styles/mainStyles";

const LightThemeActiveIcon = sized(LightThemeActiveSvg, 14);
const DarkThemeActiveIcon = sized(DarkThemeActiveSvg, 13);
const DarkThemeDarkIcon = sized(DarkThemeDarkSvg, 13);

// Screenshots of the Home screen so users can see each theme before/after picking it.
const PREVIEW_IMAGES = {
  en: {
    light: require("../../../../assets/theme_preview_light.jpg"),
    dark: require("../../../../assets/theme_preview_dark.jpg"),
  },
  ar: {
    light: require("../../../../assets/theme_preview_light_ar.jpg"),
    dark: require("../../../../assets/theme_preview_dark_ar.jpg"),
  },
};
const PREVIEW_BORDER = 4;
const PREVIEW_WIDTH = 200;
// Fixed pixel size so the screenshot is scaled down to fit (540 x 1174 source).
const PREVIEW_IMAGE_WIDTH = PREVIEW_WIDTH - PREVIEW_BORDER * 2;
const PREVIEW_IMAGE_HEIGHT = Math.round((PREVIEW_IMAGE_WIDTH * 1174) / 540);

const Modes = () => {
  const { t, i18n } = useTranslation();
  const { isDark, setScheme } = useTheme();
  const previewImages = i18n.language === "ar" ? PREVIEW_IMAGES.ar : PREVIEW_IMAGES.en;

  const iconColor = isDark ? colors.white : "#072536";
  const LightThemeDarkIcon = sized(LightThemeDarkSvg, 14, 14, iconColor);

  return (
    <View>
      <TypographyText
        textColor={isDark ? colors.white : colors.darkBlue}
        size={18}
        font={BALOO_SEMIBOLD}
        title={t("Settings.theme")}
        style={[mainStyles.p20, { marginTop: 24, fontWeight: "700" }]}
      />
      <TwoButtons
        isLight={true}
        style={{ marginTop: 12, marginBottom: 16 }}
        selectedButton={isDark ? 1 : 0}
        icon1={!isDark ? <LightThemeActiveIcon /> : <LightThemeDarkIcon />}
        icon2={isDark ? <DarkThemeActiveIcon /> : <DarkThemeDarkIcon />}
        onPress1={() => {
          setScheme("light");
          AsyncStorage.setItem("isDark", false.toString());
        }}
        onPress2={() => {
          setScheme("dark");
          AsyncStorage.setItem("isDark", true.toString());
        }}
        label1={t("Settings.light")}
        label2={t("Settings.dark")}
      />
      <View
        style={[
          styles.previewFrame,
          { borderColor: isDark ? "#444444" : colors.grey },
        ]}
      >
        <Image
          source={isDark ? previewImages.dark : previewImages.light}
          style={styles.previewImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewFrame: {
    alignSelf: "center",
    width: PREVIEW_WIDTH,
    borderRadius: 24,
    borderWidth: PREVIEW_BORDER,
    overflow: "hidden",
    marginBottom: 10,
  },
  previewImage: {
    width: PREVIEW_IMAGE_WIDTH,
    height: PREVIEW_IMAGE_HEIGHT,
  },
});

export default Modes;
