import { StyleSheet, View, Text } from "react-native";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../../../../../redux/types";
import { colors } from "../../../../../../components/colors";

const PriceItem = ({ title, value, minus, style }) => {
  const valueText = minus ? `- ${value} QR` : `${value} QR`;

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.text}>{title}</Text>
      <Text style={[styles.text, { color: minus ? "#FFB6C7" : colors.white }]}>
        {valueText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: colors.white,
    fontFamily: BALOO_SEMIBOLD,
  },
});

export default PriceItem;
