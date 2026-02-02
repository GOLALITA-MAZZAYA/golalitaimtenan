import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { TypographyText } from "../../../../components/Typography";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import {useTheme} from "../../../../components/ThemeProvider";
import {BALOO_BOLD, BALOO_MEDIUM, BALOO_REGULAR, BALOO_SEMIBOLD} from "../../../../redux/types";
import {isRTL} from "../../../../../utils";

const IMAGE_HEIGHT = 242;
const IMAGE_RADIUS = 38;

const ProductListCard = ({ onPress, uri, style, expiringDate, value, description }) => {
  const { t } = useTranslation();
  const {isDark} = useTheme();
  const isRtl = isRTL();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
      {/* Background image */}
      <Image
        source={{ uri: `data:image/png;base64,${uri}` }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Description block */}
      <View style={[styles.descriptionBlock, { backgroundColor: colors.loyaltyCardBackground, flexDirection: isRtl ? 'row-reverse': 'row' }]}>
        <View style={styles.nameWrapper}>
          <TypographyText
            title={description}
            size={20}
            style={styles.pointsBlockText}
            textColor={colors.loyaltyTextMainTitle}
            numberOfLines={2}
          />
        </View>

        <View style={[styles.pointsBlock, {flexDirection: isRtl ? 'row-reverse': 'row'}]}>
          <TypographyText
            title={value}
            size={20}
            style={styles.pointsValueText}
            textColor={colors.loyaltyPrimary}
            font={BALOO_BOLD}
          />
          <TypographyText
            title={t("LoyaltyOffers.points")}
            size={14}
            style={[
                styles.pointsText,
                {marginLeft: isRtl ? 0 : 3, marginRight: isRtl ? 3 : 0}
            ]}
            textColor={colors.loyaltyPrimary}
            font={BALOO_REGULAR}
          />
        </View>
      </View>

      {/* Expiring date */}
      <View style={[
          styles.expiringDateBlock,
          { backgroundColor: isDark ? colors.loyaltyCardBackground: colors.loyaltyTabsBackground,
            left: isRtl ? undefined: 20,
            right: isRtl ? 20 : undefined
           }
        ]}>
        <TypographyText
          title={expiringDate}
          textColor={isDark ? colors.loyaltyTextSecondary: colors.loyaltyTextMainTitle}
          size={10}
          style={styles.expiringDateText}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: IMAGE_RADIUS,
    height: IMAGE_HEIGHT,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  backgroundImage: {
    width: "100%",
    height: IMAGE_HEIGHT,
    borderRadius: IMAGE_RADIUS,
  },

  descriptionBlock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 2,
    borderBottomLeftRadius: IMAGE_RADIUS,
    borderBottomRightRadius: IMAGE_RADIUS,
  },

  nameWrapper: {
    flex: 1,
    marginRight: 12,
    overflow: "hidden",
  },

  pointsBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  pointsBlockText: {
    fontWeight: "700",
  },

  pointsValueText: {
    fontWeight: "700",
  },

  pointsText: {
    marginBottom: 4
  },

  expiringDateBlock: {
    position: "absolute",
    top: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 3,
  },

  expiringDateText: {
    fontWeight: "600",
  },
});

export default ProductListCard;
