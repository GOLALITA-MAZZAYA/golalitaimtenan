import React, { memo, useMemo } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { TypographyText } from "../Typography";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";
import StartIcon from "../../assets/star.svg";
import { sized } from "../../Svg";
import FullScreenLoader from "../Loaders/FullScreenLoader";
import { getFlexDirection, isRTL } from "../../../utils";
import useIsGuest from "../../hooks/useIsGuest";
import { useTheme } from "../ThemeProvider";
import { colors } from "../colors";
import { useTranslation } from "react-i18next";

const CardWithNesetedItems = ({ parentProps }) => {
  const {
    uri,
    name,
    description,
    loadingDescription,
    isSaved,
    onPress,
    onPressFavourite,
    expiryDate,
    endDate,
  } = parentProps;

  const date = endDate || expiryDate;
  const { t } = useTranslation();
  const isGuest = useIsGuest();
  const { isDark } = useTheme();
  const StarIconSmall = useMemo(() => sized(StartIcon, 22, 22), []);
  const isRtl = isRTL();

  // Golalita layout + Etizaz palette
  const cardBg = isDark ? "#0F0F0F" : colors.white;
  const titleColor = isDark ? colors.white : colors.black;
  const descriptionColor = isDark ? "#B1B1B4" : colors.darkGrey;
  const expiryTextColor = colors.mainDarkMode;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.wrapper,
        !isDark && styles.wrapperLightBorder,
      ]}
    >
      <ImageBackground
        source={{ uri }}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        {!isGuest && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressFavourite}
            style={[
              styles.favoriteButton,
              {
                right: isRtl ? undefined : 10,
                left: isRtl ? 10 : undefined,
              },
            ]}
          >
            <StarIconSmall
              color={"white"}
              fill={isSaved ? "white" : "transparent"}
            />
          </TouchableOpacity>
        )}

        {loadingDescription && (
          <FullScreenLoader style={styles.loader} />
        )}
      </ImageBackground>

      <View
        style={[
          styles.bottomBlock,
          getFlexDirection(),
          { backgroundColor: cardBg },
        ]}
      >
        <View style={styles.infoWrapper}>
          <TypographyText
            title={name}
            size={15}
            font={BALOO_SEMIBOLD}
            textColor={titleColor}
            numberOfLines={2}
            style={styles.name}
          />
        </View>
        <View
          style={[
            styles.descriptionBlock,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          {!!description && !loadingDescription && (
            <TypographyText
              title={description}
              size={12}
              font={BALOO_REGULAR}
              textColor={descriptionColor}
              style={styles.description}
              numberOfLines={2}
            />
          )}
          {!!date && date !== "..." && !loadingDescription && (
            <TypographyText
              title={`${t("PremiumPartner.validTill")} ${date}`}
              size={11}
              font={BALOO_REGULAR}
              textColor={expiryTextColor}
              style={styles.endDate}
              numberOfLines={1}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 5,
    marginVertical: 16,
    borderRadius: 14,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
  },

  wrapperLightBorder: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },

  image: {
    width: "100%",
    aspectRatio: 16 / 9,
  },

  imageBorder: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  bottomBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingVertical: 10,
  },

  infoWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },

  name: {
    fontWeight: "600",
  },

  description: {
    alignSelf: isRTL() ? "flex-end" : "flex-start",
    marginTop: 5,
  },

  endDate: {
    alignSelf: isRTL() ? "flex-end" : "flex-start",
    marginTop: 3,
    fontWeight: "600",
  },

  favoriteButton: {
    position: "absolute",
    top: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 5,
    borderRadius: 16,
    zIndex: 10,
  },

  loader: {
    alignSelf: "flex-start",
    margin: 16,
  },

  descriptionBlock: {
    marginHorizontal: 10,
  },
});

export default memo(CardWithNesetedItems);
