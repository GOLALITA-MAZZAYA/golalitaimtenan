import { View } from "react-native";
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

const Modes = () => {
  const { t } = useTranslation();
  const { isDark, setScheme } = useTheme();

  const iconColor = isDark ? colors.white : "#072536";
  const LightThemeDarkIcon = sized(LightThemeDarkSvg, 14, 14, iconColor);

  return (
    <View>
      <TypographyText
        textColor={isDark ? colors.white : colors.darkBlue}
        size={18}
        font={BALOO_SEMIBOLD}
        title={t("Settings.theme")}
        style={[mainStyles.p20, { marginTop: 25, fontWeight: "700" }]}
      />
      <TwoButtons
        isLight={true}
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
    </View>
  );
};

export default Modes;
