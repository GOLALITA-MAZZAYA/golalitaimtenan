import { View } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import { useTheme } from "../../../../components/ThemeProvider";
import TwoButtons from "../../../../components/TwoButtons/TwoButtons";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import { mainStyles } from "../../../../styles/mainStyles";

const Language = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();

  const selectLanguage = (lang) => {
    if (i18n.language === lang) {
      return;
    }
    i18n.changeLanguage(lang);
    AsyncStorage.setItem("lang", lang);
  };

  return (
    <View>
      <TypographyText
        textColor={isDark ? colors.white : colors.darkBlue}
        size={18}
        font={BALOO_SEMIBOLD}
        title={t("Settings.language")}
        style={[mainStyles.p20, { marginTop: 10, fontWeight: "700" }]}
      />
      <TwoButtons
        isLight={true}
        style={{ marginTop: 12, marginBottom: 0 }}
        selectedButton={i18n.language === "ar" ? 1 : 0}
        onPress1={() => selectLanguage("en")}
        onPress2={() => selectLanguage("ar")}
        // Each language is written in its own script so users can find theirs.
        label1="English"
        label2="العربية"
      />
    </View>
  );
};

export default Language;
