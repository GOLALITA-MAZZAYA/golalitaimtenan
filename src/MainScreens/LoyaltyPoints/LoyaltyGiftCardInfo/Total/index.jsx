import { StyleSheet, View } from "react-native";
import { BALOO_BOLD, BALOO_REGULAR } from "../../../../redux/types";
import { useTheme } from "../../../../components/ThemeProvider";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import { useTranslation } from "react-i18next";

const Total = (props) => {
  const { isDark } = useTheme();
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
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={16}
          font={item.isTotal ? BALOO_BOLD : BALOO_REGULAR}
        />
        <TypographyText
          title={item.value}
          textColor={isDark ? 'white' : colors.darkBlue}
          size={16}
          font={item.isTotal ? BALOO_BOLD : BALOO_REGULAR}
        />
      </View>
    );
  };
  const renderValueTot = (item) => {
    if (!item.value) {
      return null;
    }

    return (
      <View style={styles.itemWrapper} key={item.title}>
        <TypographyText
          title={item.title}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={16}
          font={item.isTotal ? BALOO_BOLD : BALOO_REGULAR}
        />
        <TypographyText
          title={item.value}
          textColor={isDark ? colors.white : colors.darkBlue}
          size={16}
          font={item.isTotal ? BALOO_BOLD : BALOO_REGULAR}
        />
      </View>
    );
  };

  const config = [
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
      visible: true,
    },
  ];

  const totalConfig = {
    title: t("Vouchers.orderTotal"),
    value: `${total.toFixed(2)} QAR`,
    isTotal: true,
  };

  const filteredConfig = config.filter((item) => item.visible);

  return (
    <View style={style}>
      <View style={styles.wrapper}>{filteredConfig.map(renderValue)}</View>
      {renderValueTot(totalConfig)}
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

export default Total;
