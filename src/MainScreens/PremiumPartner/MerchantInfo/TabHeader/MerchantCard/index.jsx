import React from "react";
import { StyleSheet, View } from "react-native";
import Image from "../../../../../components/AppImage";
import { BALOO_2 } from "../../../../../redux/types";
import { useTranslation } from "react-i18next";
import DiscountLabel from "../../../../../assets/discountLabel.svg";
import { sized } from "../../../../../Svg";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import { useTheme } from "../../../../../components/ThemeProvider";

const MerchantCard = ({ uri, ribbonText, merchantName }) => {
    const { i18n } = useTranslation();
    const { isDark } = useTheme();
    const isArabic = i18n.language === 'ar';

    const accentColor = isDark ? colors.mainDarkMode : colors.darkBlue;
    const DiscountLabelF = sized(
        DiscountLabel,
        13,
        13,
        accentColor,
    );

    return (
      <View
        style={[
          styles.wrapper,
          {
            flexDirection: isArabic ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View style={[styles.infoBlock, { paddingRight: isArabic ? 0 : 14, paddingLeft: isArabic ? 14 : 0 }]}>
          <TypographyText
            textColor={isDark ? '#FFFFFF' : '#1C1C1E'}
            size={20}
            font={BALOO_2}
            title={merchantName}
            numberOfLines={2}
            style={styles.title}
          />
          {!!ribbonText && (
            <View
              style={[
                styles.discountLabel,
                {
                  flexDirection: isArabic ? 'row-reverse' : 'row',
                  backgroundColor: isDark ? 'rgba(221, 189, 107, 0.12)' : 'rgba(162, 148, 117, 0.12)',
                },
              ]}
            >
              <DiscountLabelF />
              <TypographyText
                textColor={accentColor}
                size={13}
                font={BALOO_2}
                title={ribbonText}
                style={styles.discountText}
                numberOfLines={1}
              />
            </View>
          )}
        </View>

        {!!uri && (
          <Image
            source={{ uri }}
            style={[
              styles.logo,
              {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
              },
            ]}
          />
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 14,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    lineHeight: 26,
  },
  discountLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    marginHorizontal: 6,
    fontWeight: '700',
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 14,
    borderWidth: 1,
    flexShrink: 0,
  },
});

export default MerchantCard;