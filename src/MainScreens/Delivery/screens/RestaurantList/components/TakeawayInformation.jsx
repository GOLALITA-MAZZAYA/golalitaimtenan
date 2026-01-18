import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TakeawayLocationIcon } from "../../../../../assets/delivery_assets";
import { useTranslation } from "react-i18next";

const TakeawayInformation = ({ userLocation, requestLocation }) => {
  const { t } = useTranslation();

  if (userLocation) {
    return (
      <View style={style.layout}>
        <TakeawayLocationIcon style={style.takeawayIcon} />
        <View>
          <Text style={style.title}>{t("RestaurantList.currentLocation")}</Text>
          <Text style={style.subTitle}>{userLocation.formatted_address}</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={style.layout} onPress={requestLocation}>
      <TakeawayLocationIcon style={style.takeawayIcon} />
      <View>
        <Text style={style.title}>
          {t("RestaurantList.restaurantsNearLocation")}
        </Text>
        <Text style={style.subTitle}>{t("RestaurantList.enableLocation")}</Text>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  layout: {
    flexDirection: "row",
    borderRadius: 16,
    borderColor: "#1CC0A0",
    marginHorizontal: 20,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  takeawayIcon: {
    width: 20,
    height: 20,
    fill: "#1CC0A0",
    marginHorizontal: 12,
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 11,
    lineHeight: 18,
    color: "#1CC0A0",
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 22,
    color: "#1CC0A0",
  },
});

export default TakeawayInformation;
