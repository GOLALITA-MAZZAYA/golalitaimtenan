import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  CloseIcon,
  DiscoveryIcon,
  PinIcon,
} from "../../../../../../assets/delivery_assets";
import { SizedBox } from "../../../_shared/componenets/SizedBox";
import { colors } from "../../../../../../components/colors";
import LocationBtn from "./LocationBtn";
import SavedLocations from "./SavedLocations";
import { useTranslation } from "react-i18next";
import { TypographyText } from "../../../../../../components/Typography";
import { BALOO_MEDIUM } from "../../../../../../redux/types";

const DeliveryLocation = ({
  onCloseSheet,
  onApplyLocation,
  isDark,
  navigatedFrom,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleManualLocationPress = () => {
    navigation.navigate("locations", {
      screen: "locations-map",
      params: { navigatedFrom },
    });
  };

  return (
    <View style={{ marginHorizontal: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={onCloseSheet}>
          <CloseIcon style={{ width: 20, height: 20 }} color={"#999CAD"} />
        </TouchableOpacity>
        <TypographyText
          title={t("RestaurantList.selectDeliveryLocation")}
          textColor={isDark ? colors.white : colors.darkBlue}
          size={18}
          font={BALOO_MEDIUM}
        />

        <SizedBox size={1} />
      </View>
      <SizedBox size={24} />
      <SavedLocations onApplyLocation={onApplyLocation} />

      <SizedBox size={24} />
      <LocationBtn
        title={t("RestaurantList.manuallySelectLocation")}
        subTitle={t("RestaurantList.chooseLocationOnMap")}
        onPress={handleManualLocationPress}
        isDark={isDark}
        Icon={PinIcon}
      />
    </View>
  );
};

export default DeliveryLocation;
