import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../../components/AppImage";
import { BALOO_2, BALOO_BOLD } from "../../../../../redux/types";
import { TypographyText } from "../../../../../components/Typography";
import HeartSvg from "../../../../../assets/heart.svg";
import { colors } from "../../../../../components/colors";
import { isRTL } from "../../../../../../utils";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../components/ThemeProvider";
import { sized } from "../../../../../Svg";

const HeartIcon = sized(HeartSvg, 16, 16);

const RoomRatesListItem = ({
  uri,
  isLiked,
  title,
  price,
  onPress,
  onBookPress,
  onSavePress,
}) => {
  const isRtl = isRTL();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E5E7EB",
          flexDirection: isRtl ? "row-reverse" : "row",
          shadowOpacity: isDark ? 0.3 : 0.08,
        },
      ]}
      onPress={onPress}
    >
      {/* Thumbnail Image */}
      <View
        style={[
          styles.imageWrapper,
          {
            borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <View
            style={[
              styles.image,
              { backgroundColor: isDark ? "#2A2A2E" : "#E5E7EB" },
            ]}
          />
        )}
      </View>

      {/* Content Area */}
      <View
        style={[
          styles.contentWrapper,
          {
            marginLeft: isRtl ? 0 : 12,
            marginRight: isRtl ? 12 : 0,
          },
        ]}
      >
        {/* Title and Favorite Button Row */}
        <View
          style={[
            styles.headerRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <TypographyText
            textColor={isDark ? "#FFFFFF" : "#111827"}
            size={15}
            font={BALOO_BOLD}
            title={title}
            numberOfLines={2}
            style={[
              styles.titleText,
              {
                textAlign: isRtl ? "right" : "left",
                marginRight: isRtl ? 0 : 8,
                marginLeft: isRtl ? 8 : 0,
              },
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSavePress}
            style={[
              styles.favoriteButton,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "#F3F4F6",
              },
            ]}
          >
            <HeartIcon
              color={isLiked ? "#EF4444" : isDark ? "#A1A1AA" : "#9CA3AF"}
              fill={isLiked ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Price & Book Button Row */}
        <View
          style={[
            styles.footerRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          {/* Price Block */}
          <View style={styles.priceBlock}>
            <TypographyText
              textColor={isDark ? "#9CA3AF" : "#6B7280"}
              size={11}
              font={BALOO_2}
              title={t("PremiumPartner.startingFrom")}
              style={{ textAlign: isRtl ? "right" : "left" }}
            />
            {!!price && (
              <TypographyText
                textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                size={16}
                font={BALOO_BOLD}
                title={`${price} ${t("General.qar")}`}
                numberOfLines={1}
                style={[
                  styles.priceText,
                  { textAlign: isRtl ? "right" : "left" },
                ]}
              />
            )}
          </View>

          {/* Book Now Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.bookButton,
              {
                backgroundColor: isDark
                  ? colors.mainDarkMode
                  : colors.darkBlue,
              },
            ]}
            onPress={onBookPress}
          >
            <TypographyText
              textColor={isDark ? "#000000" : "#FFFFFF"}
              size={13}
              font={BALOO_BOLD}
              title={t("PremiumPartner.book")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    width: 104,
    height: 104,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    flex: 1,
    height: 104,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  headerRow: {
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleText: {
    flex: 1,
    fontWeight: "700",
  },
  favoriteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  footerRow: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  priceBlock: {
    flex: 1,
  },
  priceText: {
    fontWeight: "700",
    marginTop: 2,
  },
  bookButton: {
    height: 34,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17,
  },
});

export default memo(RoomRatesListItem);