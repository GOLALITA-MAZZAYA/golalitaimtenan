import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FilterIcon } from "../../../../../assets/delivery_assets";
import { colors } from "../../../../../components/colors";
import { useTranslation } from "react-i18next";

function DeliveryFilters({ onOpen, isDark }) {
  const { t } = useTranslation();
  const color = isDark ? colors.white : colors.darkBlue;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.container, { borderColor: color }]}
        onPress={onOpen}
      >
        {<FilterIcon color={color} />}

        <Text style={[styles.title, { color }]}>
          {t("RestaurantList.filters")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  container: {
    flexDirection: "row",
    borderRadius: 25,
    borderWidth: 2,
    padding: 8,
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
  },
});
export default DeliveryFilters;
