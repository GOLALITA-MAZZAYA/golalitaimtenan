import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SizedBox } from "../../../_shared/componenets/SizedBox";
import { TABS } from "./config";
import { colors } from "../../../../../../components/colors";

function DeliveryTabs({ onChange, value }) {
  return (
    <View style={styles.tabLayout}>
      {TABS.map((item) => {
        const Icon = item.icon;
        const isActive = value === item.key;
        const color = { color: isActive ? colors.darkBlue : colors.grey };

        return (
          <TouchableOpacity
            style={[
              styles.row,
              styles.tap,
              { borderBottomColor: color, borderWidth: 2 },
            ]}
            onPress={() => onChange(item.key)}
            key={item.key}
          >
            <Icon color={value ? "red" : "green"} />
            <SizedBox size={8} />
            <Text style={[styles.tabTextStyle, { color }]}>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabLayout: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 0,
  },
  tap: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 10,
  },
  tabTextStyle: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DeliveryTabs;
