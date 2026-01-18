import { TouchableOpacity, Text, View, StyleSheet, Image } from "react-native";
import {
  ForwardArrowIcon,
  LocationIcon,
} from "../../../../../assets/delivery_assets";
import { colors } from "../../../../../components/colors";
import { useTranslation } from "react-i18next";

const ChangeLocation = ({ address, onPress, isDark }) => {
  const textColorStyle = { color: isDark ? colors.white : "#08003B" };
  const { t } = useTranslation();

  const changeText = address
    ? t("Checkout.changeLocation")
    : t("Checkout.choose");
  const addressText = address
    ? `${t("Checkout.deliverTo")}: ${address}`
    : t("Checkout.chooseLocation");

  return (
    <View style={styles.wrapperMain}>
      <Image
        style={styles.mapImage}
        source={{
          uri: "https://media.wired.com/photos/59269cd37034dc5f91bec0f1/191:100/w_1280,c_limit/GoogleMapTA.jpg",
        }}
      />

      <View style={styles.wrapper}>
        <View style={styles.locationIconWrapper}>
          <LocationIcon color={colors.darkBlue} height={20} width={20} />
        </View>

        <View style={styles.addressWrapper}>
          <Text style={[styles.addressText, textColorStyle]} numberOfLines={3}>
            {addressText}
          </Text>
        </View>

        <TouchableOpacity style={styles.changeBtn} onPress={onPress}>
          <Text style={[styles.changeText, textColorStyle]}>{changeText}</Text>
          <ForwardArrowIcon color={colors.darkBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperMain: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  wrapper: {
    flexDirection: "row",
    marginVertical: 16,
  },
  mapImage: {
    borderRadius: 16,
    height: 88,
  },
  addressWrapper: {
    flex: 1,
    paddingRight: 25,
  },
  addressText: {
    fontSize: 12,
    fontWeight: "600",
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
    marginRight: 5,
  },
  changeBtn: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 10,
  },
  locationIconWrapper: {
    paddingHorizontal: 10,
  },
});

export default ChangeLocation;
