import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getGreyColor } from "../../../../../styles/colors";
import {
  DeliveryIcon as _DeliveryIcon,
  TakeawayIcon as _TakeawayIcon,
  DeliveryIconDark as _DeliveryIconDark,
  TakeawayIcon as _TakeawayIconDark,
  DeliveryIconDarkInactive as _DeliveryIconDarkInactive,
  TakeAwayDarkInactive as _TakeAwayDarkInactive,
  TakeAwayDark as _TakeAwayDark,
} from "../../../../../assets/delivery_assets";
import { SizedBox } from "../../_shared/componenets/SizedBox";
import { colors } from "../../../../../components/colors";
import { useTranslation } from "react-i18next";
import { CONSTANTS } from "./DeliveryTabs/config";

function DeliveryTabs({ onChange, value, isDark }) {
  const { t } = useTranslation();

  const TABS = [
    {
      name: t("RestaurantList.delivery"),
      key: CONSTANTS.DELIVERY,
      icon: _DeliveryIcon,
    },
    {
      name: t("RestaurantList.takeaway"),
      key: CONSTANTS.TAKEWAY,
      icon: _TakeawayIcon,
    },
  ];

  return (
    <View style={[styles.row, styles.tabLayout]}>
      {TABS.map((item) => {
        const Icon = item.icon;

        const isActive = value === item.key;
        let color = colors.grey;
        let tabStyle = {
          borderBottomColor: getGreyColor(),
          borderBottomWidth: 1,
        };
        let textStyle = { fontSize: 14, fontWeight: "600", color: colors.grey };

        if (isActive) {
          color = colors.darkBlue;
          tabStyle = {
            borderBottomColor: "#08003B",
            borderBottomWidth: 2,
          };
          textStyle = {
            fontSize: 14,
            fontWeight: "600",
            color: colors.darkBlue,
          };
        }

        if (isActive && isDark) {
          color = colors.white;
          textStyle = {
            fontSize: 14,
            fontWeight: "600",
            color: colors.white,
          };

          tabStyle = {
            borderBottomColor: "#0B177E",
            borderBottomWidth: 2,
          };
        }

        return (
          <TouchableOpacity
            style={[styles.tap, tabStyle]}
            onPress={() => onChange(item.key)}
          >
            <Icon color={color} />
            <SizedBox size={8} />
            <Text style={textStyle}>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabLayout: { marginTop: 16, paddingHorizontal: 0 },
  tap: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  activeTabIcon: {
    width: 40,
    height: 24,
    fill: "#000000",
  },
});

export default DeliveryTabs;
