import { StyleSheet, View } from "react-native";
import { BALOO_2 } from "../../../../redux/types";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import { useTranslation } from "react-i18next";

const LoyaltyVoucherInfoTotal = (props) => {
  const { t } = useTranslation();

  const { amount = 0, deliveryCharge, bankCharge, style, total, cash } = props;

  const renderValue = (item) => {
    if (!item.value) {
      return null;
    }

    return (
      <View style={styles.itemWrapper} key={item.title}>
        <TypographyText
          title={item.title}
          textColor={item.isTotal ? colors.loyaltyTextMainTitle: colors.loyaltyTextSecondary}
          size={16}
          font={BALOO_2}
          style={{fontWeight: item.isTotal ? '600': '400'}}
        />
        <TypographyText
          title={item.value}
          textColor={item.isTotal ? colors.loyaltyTextMainTitle: colors.loyaltyTextMainTitle}
          size={16}
          font={BALOO_2}
          style={{fontWeight: item.isTotal ? '600': '400'}}
        />
      </View>
    );
  };

  let config = [];

  if (!cash) {
    config = [
      {
        title: t("Vouchers.price"),
        value: `${amount?.toFixed(2)} QAR`,
        visible: true,
      },
      {
        title: t("Vouchers.deliveryCharge"),
        value: `${deliveryCharge?.toFixed(2)} QAR`,
        visible: deliveryCharge > 0,
      },
      {
        title: t("Vouchers.bankCharge"),
        value: `${bankCharge?.toFixed(2)} QAR`,
        visible: bankCharge > 0,
      },
    ];
  } else {
    config = [
      {
        title: t("Vouchers.price"),
        value: `${amount?.toFixed(2)} QAR`,
        visible: true,
      },
      {
        title: t("Vouchers.cash"),
        value: "True",
        visible: true,
      },
    ];
  }

  const filteredConfig = config.filter((item) => item.visible);

  return (
    <View style={[style,styles.mainWrapper,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
      <View style={styles.wrapper}>{filteredConfig.map(renderValue)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 40,
    
  },
  wrapper: {
    paddingBottom: 10
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
});

export default LoyaltyVoucherInfoTotal;
