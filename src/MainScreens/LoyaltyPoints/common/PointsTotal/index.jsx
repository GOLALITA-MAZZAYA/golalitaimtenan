import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {useTheme} from "../../../../components/ThemeProvider";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_BOLD} from "../../../../redux/types";
import {colors} from "../../../../components/colors";

const PointsTotal = ({priceInPoints, availablePoints = 0, style}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const titleColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const textColor = isDark ? colors.white : colors.darkBlue;

  return (
    <View style={style}>
      <View style={styles.itemWrapper} >
        <TypographyText
          title={t("Vouchers.availablePoints")}
          textColor={titleColor}
          size={16}
        />
        <TypographyText
          title={`${availablePoints} ${t("Vouchers.points")}`}
          textColor={textColor}
          size={16}
        />
      </View>
      <View style={styles.itemWrapper} >
        <TypographyText
          title={t("Vouchers.orderTotal")}
          textColor={titleColor}
          size={16}
          font={BALOO_BOLD}
        />
        <TypographyText
          title={`${priceInPoints} ${t("Vouchers.points")}`}
          textColor={textColor}
          size={16}
          font={BALOO_BOLD}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBlue,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
});

export default PointsTotal;
