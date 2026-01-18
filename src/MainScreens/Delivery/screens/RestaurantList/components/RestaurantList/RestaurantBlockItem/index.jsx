import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import {
  LocationIconSmall,
  StarDark,
  DeliveryItemIconDark,
  TimeIconDark,
} from "../../../../../../../assets/delivery_assets/index";
import HeartSvg from "../../../../../../../assets/heart.svg";
import {
  BALOO_REGULAR,
  BALOO_SEMIBOLD,
} from "../../../../../../../redux/types";
import { TypographyText } from "../../../../../../../components/Typography";
import { colors } from "../../../../../../../components/colors";
import { SizedBox } from "../../../../_shared/componenets/SizedBox";

const RestaurantBlockItem = ({
  onPress,
  onLikePress,
  isDark,
  isLiked,
  price,
  rate,
  distance,
  time,
  mapBanner,
  merchantLogo,
  merchantName,
  merchantId,
  description,
}) => {
  const textColor = isDark ? colors.white : colors.darkBlue;

  return (
    <TouchableOpacity key={merchantId} onPress={onPress}>
      <View
        style={[
          styles.wrapper,
          { backgroundColor: isDark ? colors.secBlue : colors.white },
        ]}
      >
        <FastImage
          source={{
            uri: mapBanner,
          }}
          style={styles.banner}
        />

        <View style={styles.descriptionWrapper}>
          <View>
            <SizedBox size={24} />
            <View style={styles.textInfoBlock}>
              <View>
                <TypographyText
                  textColor={textColor}
                  size={18}
                  font={BALOO_SEMIBOLD}
                  title={merchantName}
                  style={styles.nameText}
                />
                {description && (
                  <TypographyText
                    textColor={textColor}
                    size={14}
                    font={BALOO_REGULAR}
                    title={description}
                    style={styles.descriptionText}
                  />
                )}
              </View>
              <View style={{ flexDirection: "row" }}>
                <TypographyText
                  size={18}
                  font={BALOO_SEMIBOLD}
                  title={rate}
                  style={styles.starText}
                />
                <StarDark style={{ top: 8, left: 4 }} />
              </View>
            </View>
            <SizedBox size={8} />
            <View style={styles.subInfoWrapper}>
              {!!distance && (
                <View style={{ flexDirection: "row" }}>
                  <LocationIconSmall color={textColor} />
                  <TypographyText
                    textColor={textColor}
                    size={14}
                    font={BALOO_REGULAR}
                    title={distance}
                    style={styles.subInfoText}
                  />
                </View>
              )}
              {!!time && (
                <View style={{ flexDirection: "row" }}>
                  <TimeIconDark color={textColor} />
                  <TypographyText
                    textColor={textColor}
                    size={14}
                    font={BALOO_REGULAR}
                    title={time}
                    style={styles.subInfoText}
                  />
                </View>
              )}
              {!!price && (
                <View style={{ flexDirection: "row" }}>
                  <DeliveryItemIconDark color={textColor} />
                  <TypographyText
                    textColor={textColor}
                    size={14}
                    font={BALOO_REGULAR}
                    title={`${price} QR`}
                    style={styles.subInfoText}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.merchantLogoWrapper}>
          <FastImage
            style={styles.merchantLogo}
            source={{
              uri: merchantLogo,
            }}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.likeWrapper,
            { backgroundColor: isDark ? "#FFB6C7" : colors.white },
          ]}
          onPress={() => onLikePress(merchantId)}
        >
          <HeartSvg
            color={isLiked ? "#E32251" : isDark ? colors.white : "#DDDFE4"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 16,
    borderRadius: 16,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: "relative",
    paddingBottom: 12,
  },
  merchantLogoWrapper: {
    position: "absolute",
    top: 116.5,
    left: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  likeWrapper: {
    position: "absolute",
    top: 126,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  merchantLogo: {
    width: 55,
    height: 55,
    borderRadius: 55,
  },
  subInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 5,
  },
  subInfoText: {
    lineHeight: 22.43,
    fontWeight: "400",
    left: 5,
    bottom: 3,
  },
  banner: {
    height: 144,
    width: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  nameText: {
    lineHeight: 28.84,
    fontWeight: "600",
    marginTop: 10,
  },
  descriptionWrapper: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 16,
  },
  descriptionText: {
    lineHeight: 22.43,
    fontWeight: "400",
    color: "#999CAD",
  },
  starText: {
    lineHeight: 28.84,
    fontWeight: "600",
    color: "#FFB800",
  },
  textInfoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
});

export default RestaurantBlockItem;
