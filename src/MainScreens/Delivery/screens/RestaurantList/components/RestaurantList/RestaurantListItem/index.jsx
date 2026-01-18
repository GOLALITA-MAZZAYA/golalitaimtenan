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

const RestaurantListItem = ({
  onPress,
  onLikePress,
  isDark,
  isLiked,
  price,
  rate,
  distance,
  time,
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
        <View style={[styles.descriptionWrapper]}>
          <View style={styles.row}>
            <View style={styles.merchantLogoWrapper}>
              <FastImage
                style={styles.merchantLogo}
                source={{
                  uri: merchantLogo,
                }}
              />
            </View>

            <View style={styles.infoBlock}>
              <View style={styles.textInfoWrapper}>
                <View style={{ flex: 1 }}>
                  <TypographyText
                    textColor={textColor}
                    size={17}
                    font={BALOO_SEMIBOLD}
                    title={merchantName}
                    style={styles.nameText}
                    numberOfLines={1}
                  />
                  {description && (
                    <TypographyText
                      textColor={textColor}
                      size={13}
                      font={BALOO_REGULAR}
                      title={description}
                      style={styles.descriptionText}
                      numberOfLines={1}
                    />
                  )}
                </View>
                <View style={{ top: 5 }}>
                  <TouchableOpacity
                    style={[
                      styles.likeWrapper,
                      { backgroundColor: isDark ? "#FFB6C7" : colors.white },
                    ]}
                    onPress={() => onLikePress(merchantId)}
                  >
                    <HeartSvg
                      color={
                        isLiked ? "#E32251" : isDark ? colors.white : "#DDDFE4"
                      }
                      height={18}
                      width={18}
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TypographyText
                      size={16}
                      font={BALOO_SEMIBOLD}
                      title={rate}
                      style={styles.starText}
                    />
                    <StarDark style={{ top: -1, left: 4 }} />
                  </View>
                </View>
              </View>
              <View style={styles.subInfoWrapper}>
                {!!distance && (
                  <View style={styles.row}>
                    <LocationIconSmall
                      color={isDark ? colors.white : colors.darkBlue}
                    />
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
                  <View style={styles.row}>
                    <TimeIconDark
                      color={isDark ? colors.white : colors.darkBlue}
                    />
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
                  <View style={styles.row}>
                    <DeliveryItemIconDark
                      color={isDark ? colors.white : colors.darkBlue}
                    />
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
        </View>
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
  },
  merchantLogoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  likeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 24,
    width: 24,
    borderRadius: 12,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  merchantLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  subInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    width: "100%",
  },
  subInfoText: {
    fontWeight: "400",
    left: 5,
    bottom: 3,
  },
  nameText: {
    fontWeight: "600",
    marginTop: 10,
    flex: 1,
    paddingRight: 30,
  },
  descriptionWrapper: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 15,
  },
  descriptionText: {
    fontWeight: "400",
    color: "#999CAD",
    flex: 1,
    paddingRight: 10,
  },
  starText: {
    fontWeight: "600",
    color: "#FFB800",
  },
  textInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  infoBlock: {
    flex: 1,
    paddingHorizontal: 10,
    top: -5,
  },
  row: {
    flexDirection: "row",
  },
});

export default RestaurantListItem;
