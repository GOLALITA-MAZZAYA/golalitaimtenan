import { StyleSheet, View } from "react-native";
import { BALOO_2 } from "../../../../redux/types";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import { useTranslation } from "react-i18next";

const LoyaltyVoucherInfoTotal = (props) => {
  const { t } = useTranslation();

  const { price = 0, discount, style, commission, total } = props;


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


    config = [
        {
      title: t("Vouchers.price"),
      value: `QAR ${price?.toFixed(2)}`,
      visible: true,
    },
    {
      title: t("Vouchers.discount"),
      value: `% ${discount?.toFixed(2)}`,
      visible: !!discount,
    },
    {
      title: t("Vouchers.commission"),
      value: `QAR ${commission?.toFixed(2)}`,
      visible: commission
    }
  ];
 

  const totalConfig = {
    title: t("Vouchers.orderTotal"),
    value: `${total.toFixed(2)} QAR`,
    isTotal: true,
  };

  const filteredConfig = config.filter((item) => item.visible);

  return (
    <View style={[style,styles.mainWrapper,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
      <View style={[styles.wrapper,{borderBottomColor: colors.loyaltyTextSecondary}]}>{filteredConfig.map(renderValue)}</View>
      {renderValue(totalConfig)}
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
    borderBottomWidth: 1,
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
