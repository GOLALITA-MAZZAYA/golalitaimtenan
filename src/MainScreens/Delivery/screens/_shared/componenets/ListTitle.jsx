import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  getDeliveryInformationColor,
  getDeliveryInformationTextColor,
} from "../../../../../colors/app_colors";
import { LocationIcon } from "../../../../../assets/delivery_assets";

function DeliveryInformation() {
  return (
    <View style={style.layout}>
      <LocationIcon style={style.locationIcon} />
      <View>
        <Text style={style.subTitle}>Deliver to:</Text>
        <Text style={style.title}>Lusail</Text>
      </View>
      <View style={{ flex: 1 }} />
      <Text style={[style.title, { marginHorizontal: 12 }]}>Change</Text>
    </View>
  );
}

const style = StyleSheet.create({
  layout: {
    flexDirection: "row",
    borderRadius: 16,
    borderColor: getDeliveryInformationColor(),
    marginHorizontal: 20,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
  },
  locationIcon: {
    width: 20,
    height: 20,
    fill: getDeliveryInformationColor(),
    marginHorizontal: 12,
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 11,
    lineHeight: 18,
    color: getDeliveryInformationTextColor(),
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 22,
    color: getDeliveryInformationTextColor(),
  },
});

export default DeliveryInformation;
