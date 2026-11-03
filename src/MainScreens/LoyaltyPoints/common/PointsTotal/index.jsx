import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import { colors } from "../../../../components/colors";

const PointsTotal = ({ priceInPoints, availablePoints = 0, style }) => {
  const { t } = useTranslation();

  return (
    <View style={[style, { backgroundColor: colors.loyaltyCardBackground, padding: 20, borderRadius: 40, borderWidth: 1, borderColor: colors.loyaltyMainBorder }]}>
      <View style={[styles.itemWrapper, { borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: colors.loyaltyTextSecondary }]} >
        <TypographyText
          title={t("Vouchers.availablePoints")}
          textColor={colors.loyaltyTextSecondary}
          size={16}
          font={BALOO_2}
        />
        <TypographyText
          title={`${"availablePoints"} ${t("Vouchers.points")}`}
          textColor={colors.loyaltyTextMainTitle}
          size={16}
          font={BALOO_2}
        />
      </View>
      <View style={[styles.itemWrapper, { marginTop: 10 }]} >
        <TypographyText
          title={t("Vouchers.orderTotal")}
          textColor={colors.loyaltyTextMainTitle}
          size={16}
          font={BALOO_2}
          style={styles.totalText}
        />
        <TypographyText
          title={`${priceInPoints} ${t("Vouchers.points")}`}
          textColor={colors.loyaltyTextMainTitle}
          size={16}
          font={BALOO_2}
          style={styles.totalText}
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
  totalText: {
    fontWeight: '700'
  }
});

export default PointsTotal;
