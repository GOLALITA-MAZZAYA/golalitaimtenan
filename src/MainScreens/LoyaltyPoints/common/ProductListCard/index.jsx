import { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../components/AppImage";
import { TypographyText } from "../../../../components/Typography";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import {useTheme} from "../../../../components/ThemeProvider";
import {BALOO_2} from "../../../../redux/types";
import {isRTL} from "../../../../../utils";
import ArrowSvg from '../../../../assets/loyaltyPoints/rightArrow.svg';

const IMAGE_HEIGHT = 242;
const IMAGE_RADIUS = 38;

const ProductListCard = memo(({ onPress, uri='', style, expiringDate, value, description, onArrowPress, aspectRatio }) => {
  const { t } = useTranslation();
  const {isDark} = useTheme();
  const isRtl = isRTL();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.wrapper,
        aspectRatio ? { aspectRatio } : styles.fixedHeight,
        style,
      ]}
    >

      <Image
        source={{ uri }}
        style={[
          styles.backgroundImage,
          aspectRatio ? { aspectRatio } : styles.fixedHeight,
        ]}
        contentFit="cover"
        recyclingKey={uri}
      />

      {!!onArrowPress && <TouchableOpacity style={[styles.arrow,{right: isRtl ? undefined: 20, left: isRtl ? 20: undefined}]} onPress={onArrowPress}>
        <ArrowSvg color={colors.loyaltyTextMain}/>
      </TouchableOpacity>}


      <View style={[styles.descriptionBlock, { backgroundColor: colors.loyaltyCardBackground, flexDirection: isRtl ? 'row-reverse': 'row' }]}>
        <View style={styles.nameWrapper}>
          <TypographyText
            title={description}
            size={18}
            style={styles.pointsBlockText}
            textColor={colors.loyaltyTextMainTitle}
            numberOfLines={2}
            font={BALOO_2}
          />
        </View>

        {!!value && <View style={[styles.pointsBlock, {flexDirection: isRtl ? 'row-reverse': 'row'}]}>
          <TypographyText
            title={value}
            size={18}
            style={styles.pointsValueText}
            textColor={colors.loyaltyPrimary}
            font={BALOO_2}
          />
          <TypographyText
            title={t("LoyaltyOffers.points")}
            size={13}
            style={[
                styles.pointsText,
                {marginLeft: isRtl ? 0 : 3, marginRight: isRtl ? 3 : 0}
            ]}
            textColor={colors.loyaltyPrimary}
            font={BALOO_2}
          />
        </View>}
      </View>


      {expiringDate && <View style={[
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
          font={BALOO_2}
        />
      </View>}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: IMAGE_RADIUS,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  fixedHeight: {
    height: IMAGE_HEIGHT,
  },

  backgroundImage: {
    width: "100%",
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
    marginBottom: 1
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
  arrow: {
    position: 'absolute',
    top: 100
  }
});

export default ProductListCard;
