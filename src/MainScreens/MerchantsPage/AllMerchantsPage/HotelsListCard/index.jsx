import React, { memo, useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Image from "../../../../components/AppImage";
import Svg, { Path } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import { useTheme } from "../../../../components/ThemeProvider";
import { BALOO_2, BALOO_BOLD } from "../../../../redux/types";
import { isRTL } from "../../../../../utils";
import StarFilledSvg from "../../../../assets/star-filled.svg";
import LocationSvg from "../../../../assets/location.svg";
import HeartSvg from "../../../../assets/heart.svg";
import DiscountLabel from "../../../../assets/discountLabel.svg";
import useMerchantDiscount from "../../../../hooks/useMerchantDiscount";
import useRoadDistance from "../../../../hooks/useRoadDistance";
import useIsGuest from "../../../../hooks/useIsGuest";
import { userLocationSelector } from "../../../../redux/global/global-selectors";
import { sized } from "../../../../Svg";

const IMAGE_HEIGHT = 205;
const CARD_RADIUS = 22;

const StarIcon = sized(StarFilledSvg, 13, 13, "#FFB800");
const LocationIcon = sized(LocationSvg, 12, 14);
const HeartIcon = sized(HeartSvg, 16, 16);
const DiscountIcon = sized(DiscountLabel, 11, 11);

const HotelsListCard = ({
  onPress,
  uri,
  style,
  description,
  rating,
  address,
  merchantId,
  merchant,
  isFavorite = false,
  onPressFavourite,
}) => {
  const { isDark } = useTheme();
  const isGuest = useIsGuest();
  const isRtl = isRTL();

  const userLocation = useSelector(userLocationSelector);
  const targetMerchantId = merchantId || merchant?.merchant_id || merchant?.id;
  const { discount } = useMerchantDiscount(targetMerchantId);

  const partnerLat = merchant?.partner_latitude;
  const partnerLng = merchant?.partner_longitude;

  const { distance } = useRoadDistance(
    userLocation?.latitude,
    userLocation?.longitude,
    partnerLat,
    partnerLng
  );

  const ribbon = useMemo(() => {
    const rawDiscountArabic = discount?.x_ribbon_text_arabic;
    const rawDiscountEng = discount?.ribbon_text;
    const rawMerchantArabic =
      merchant?.x_ribbon_text_arabic ||
      merchant?.x_discount_tag_arabic ||
      (typeof merchant?.ribbon_text === "object"
        ? merchant?.ribbon_text?.x_ribbon_text_arabic
        : undefined);
    const rawMerchantEng =
      (typeof merchant?.ribbon_text === "string"
        ? merchant?.ribbon_text
        : merchant?.ribbon_text?.ribbon_text) ||
      merchant?.discount_tag ||
      merchant?.discount;

    if (isRtl) {
      return (
        rawDiscountArabic ||
        rawMerchantArabic ||
        rawDiscountEng ||
        rawMerchantEng ||
        ""
      );
    }
    return (
      rawDiscountEng ||
      rawMerchantEng ||
      rawDiscountArabic ||
      rawMerchantArabic ||
      ""
    );
  }, [discount, merchant, isRtl]);

  const resolvedAddress =
    address ||
    (isRtl
      ? merchant?.x_arabic_street_address || merchant?.street || merchant?.city
      : merchant?.street || merchant?.city);

  const imageSource = uri
    ? { uri }
    : merchant?.merchant_logo
    ? { uri: merchant.merchant_logo }
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E5E7EB",
          shadowOpacity: isDark ? 0.35 : 0.08,
        },
        style,
      ]}
    >
      {/* Hero Image Container */}
      <View style={styles.imageWrapper}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.heroImage}
            contentFit="cover"
          />
        ) : (
          <View
            style={[
              styles.heroImage,
              { backgroundColor: isDark ? "#2A2A2E" : "#E5E7EB" },
            ]}
          />
        )}

        {/* Gradient Overlay for seamless transition & contrast */}
        <LinearGradient
          colors={[
            "transparent",
            isDark ? "rgba(28, 28, 30, 0.4)" : "rgba(0, 0, 0, 0.3)",
            isDark ? "rgba(28, 28, 30, 0.9)" : "rgba(0, 0, 0, 0.6)",
          ]}
          style={styles.gradientOverlay}
        />

        {/* Top Badges Header */}
        <View
          style={[
            styles.topBadgesRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          {/* Star Rating Badge */}
          {!!rating ? (
            <View
              style={[
                styles.glassBadge,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <StarIcon />
              <TypographyText
                title={String(rating)}
                font={BALOO_BOLD}
                size={13}
                style={styles.ratingText}
                textColor="#FFFFFF"
              />
            </View>
          ) : (
            <View />
          )}

          {/* Right Floating Favorite */}
          {!!onPressFavourite && !isGuest && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPressFavourite}
              style={styles.favoriteButton}
            >
              <HeartIcon
                color={isFavorite ? "#EF4444" : "#FFFFFF"}
                fill={isFavorite ? "#EF4444" : "transparent"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Details Container */}
      <View
        style={[
          styles.detailsContainer,
          {
            flexDirection: isRtl ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        {/* Left Information Column */}
        <View style={styles.leftInfoColumn}>
          {/* Title */}
          <TypographyText
            title={description}
            size={17}
            numberOfLines={2}
            font={BALOO_BOLD}
            textColor={isDark ? "#FFFFFF" : "#111827"}
            style={{ textAlign: isRtl ? "right" : "left" }}
          />

          {/* Location & Distance (KM) */}
          {(!!resolvedAddress || !!distance) && (
            <View
              style={[
                styles.locationRow,
                {
                  flexDirection: isRtl ? "row-reverse" : "row",
                  alignItems: "center",
                },
              ]}
            >
              <LocationIcon
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
              />

              <TypographyText
                size={13}
                textColor={isDark ? "#9CA3AF" : "#6B7280"}
                font={BALOO_2}
                style={styles.locationText}
                numberOfLines={1}
                title={
                  resolvedAddress && distance
                    ? `${resolvedAddress} • ${distance}`
                    : resolvedAddress || `${distance}`
                }
              />
            </View>
          )}
        </View>

        {/* Right Column: Arrow Button + Ribbon Text Below Arrow */}
        <View
          style={[
            styles.rightColumn,
            {
              alignItems: isRtl ? "flex-start" : "flex-end",
              marginLeft: isRtl ? 0 : 12,
              marginRight: isRtl ? 12 : 0,
            },
          ]}
        >
          {/* Circular Arrow Button */}
          <View
            style={[
              styles.circleArrowButton,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "#F3F4F6",
                transform: [{ rotate: isRtl ? "180deg" : "0deg" }],
              },
            ]}
          >
            <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
              <Path
                d="M1 12.3105L6.65526 6.65524L1 1"
                stroke={isDark ? "#D1D5DB" : "#4B5563"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Ribbon Text Tag directly below arrow */}
          {!!ribbon && (
            <View
              style={[
                styles.discountBadge,
                {
                  backgroundColor: isDark
                    ? "rgba(221, 189, 107, 0.14)"
                    : "rgba(162, 148, 117, 0.12)",
                  flexDirection: isRtl ? "row-reverse" : "row",
                  marginTop: 6,
                },
              ]}
            >
              <DiscountIcon
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
              />
              <TypographyText
                textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                size={11}
                font={BALOO_BOLD}
                title={ribbon}
                numberOfLines={1}
                style={[
                  styles.discountText,
                  {
                    marginRight: isRtl ? 4 : 0,
                    marginLeft: isRtl ? 0 : 4,
                  },
                ]}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrapper: {
    width: "100%",
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
  topBadgesRow: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  glassBadge: {
    backgroundColor: "rgba(15, 15, 18, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    gap: 5,
  },
  ratingText: {
    fontWeight: "700",
    marginLeft: 2,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(15, 15, 18, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  leftInfoColumn: {
    flex: 1,
  },
  rightColumn: {
    justifyContent: "center",
  },
  circleArrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  discountText: {
    fontWeight: "700",
  },
  locationRow: {
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  locationText: {
    marginHorizontal: 2,
  },
});

export default memo(HotelsListCard);
