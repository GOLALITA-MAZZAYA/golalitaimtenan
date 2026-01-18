import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import {
  CallIcon,
  DeliveryItemIconDark,
  TimeIconDark,
  LocationIconSmall,
  StarDark,
} from "../../../../../../assets/delivery_assets";
import { SizedBox } from "../../../_shared/componenets/SizedBox";
import InfoWithIcon from "./InfoWithIcon";
import BtnWithIcon from "./BtnWithIcon";
import { colors } from "../../../../../../components/colors";
import { BALOO_SEMIBOLD } from "../../../../../../redux/types";
import { Image } from "react-native";
import { useTheme } from "../../../../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";

const RestaurantInfo = (props) => {
  const { name, rate, distance, deliveryPrice, deliveryTime, logo, phone } =
    props;
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const handleCallPress = () => {
    Linking.openURL(`tel:${phone.trim()}`);
  };

  const handleRatePress = () => {};

  return (
    <View style={{ backgroundColor: isDark ? "#0B177E" : colors.white }}>
      <View style={styles.logoWrapper}>
        <Image
          source={{
            uri: logo,
          }}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <View style={styles.nameBlock}>
        <Text
          style={[
            styles.title,
            { color: isDark ? colors.white : colors.darkBlue },
          ]}
          numberOfLines={2}
        >
          {name}
        </Text>

        <View style={styles.actionBtns}>
          <BtnWithIcon
            icon={
              <StarDark style={{ width: 10, height: 10 }} color="#FFB800" />
            }
            text={rate}
            color="#FFB800"
            onPress={handleRatePress}
          />

          {!!phone && (
            <BtnWithIcon
              icon={
                <CallIcon
                  style={{ width: 10, height: 10 }}
                  color={isDark ? colors.white : colors.grey}
                />
              }
              text={t("RestaurantView.call")}
              color={isDark ? colors.white : colors.grey}
              style={{ marginLeft: 16 }}
              onPress={handleCallPress}
            />
          )}
        </View>
      </View>

      <SizedBox size={16} />
      <View style={styles.additionalInfoBlock}>
        <InfoWithIcon
          text={distance}
          icon={
            <LocationIconSmall
              color={isDark ? colors.white : colors.darkBlue}
            />
          }
          isDark={isDark}
        />

        {!!deliveryPrice && (
          <InfoWithIcon
            text={deliveryPrice}
            icon={
              <DeliveryItemIconDark
                color={isDark ? colors.white : colors.darkBlue}
              />
            }
            isDark={isDark}
          />
        )}

        {!!deliveryTime && (
          <InfoWithIcon
            text={deliveryTime}
            icon={
              <TimeIconDark color={isDark ? colors.white : colors.darkBlue} />
            }
            isDark={isDark}
          />
        )}
      </View>
      <SizedBox size={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  nameBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 16,
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: BALOO_SEMIBOLD,
    flex: 1,
    paddingRight: 10,
  },
  subTitle: {
    fontSize: 10,
    fontWeight: "400",
    color: "#999CAD",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  logoWrapper: {
    height: 180,
    position: "relative",
  },
  logo: {
    flex: 1,
    alignSelf: "stretch",
    height: 180,
  },
  additionalInfoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
});

export default RestaurantInfo;
