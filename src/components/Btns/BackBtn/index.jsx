import { StyleSheet, TouchableOpacity } from "react-native";
import BackSvg from "../../../assets/back.svg";
import { TypographyText } from "../../Typography";
import { useTranslation } from "react-i18next";
import { BALOO_SEMIBOLD } from "../../../redux/types";
import { colors } from "../../colors";
import { useTheme } from "../../ThemeProvider";
import { sized } from "../../../Svg";

const BackBtn = ({ onPress, style }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const BackIcon = sized(
    BackSvg,
    12,
    12,
    isDark ? colors.white : colors.darkBlue
  );

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
      <BackIcon />

      <TypographyText
        textColor={isDark ? colors.white : colors.darkBlue}
        size={14}
        font={BALOO_SEMIBOLD}
        title={t("General.back")}
        style={styles.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 5,
  },
});

export default BackBtn;
