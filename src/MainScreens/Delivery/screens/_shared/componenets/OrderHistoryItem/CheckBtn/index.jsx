import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { BALOO_SEMIBOLD } from "../../../../../../../redux/types";
import ShowSvg from "../../../../../../../assets/delivery_assets/Show.svg";
import { colors } from "../../../../../../../components/colors";
import { useTheme } from "../../../../../../../components/ThemeProvider";

const CheckBtn = ({ onPress }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const color = isDark ? colors.white : colors.darkBlue;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => onPress("check")}>
      <ShowSvg color={color} />
      <Text style={[styles.text, { color }]}>{t("OrderHistoryList.show")}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontFamily: BALOO_SEMIBOLD,
    marginLeft: 4,
  },
});

export default CheckBtn;
