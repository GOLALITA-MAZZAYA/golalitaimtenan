import { StyleSheet, Text, TouchableOpacity } from "react-native";
import BuySvg from "../../../../../../../assets/delivery_assets/Buy.svg";
import { useTranslation } from "react-i18next";
import { BALOO_SEMIBOLD } from "../../../../../../../redux/types";

const ReorderBtn = ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => onPress("reorder")}>
      <BuySvg />
      <Text style={styles.text}>{t("OrderHistoryList.reorder")}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buyWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#1CC0A0",
    fontSize: 12,
    fontFamily: BALOO_SEMIBOLD,
    marginLeft: 4,
  },
});

export default ReorderBtn;
