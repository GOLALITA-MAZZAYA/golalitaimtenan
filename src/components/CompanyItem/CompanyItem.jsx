import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { mainStyles, SCREEN_WIDTH } from "../../styles/mainStyles";
import { colors } from "../colors";
import { BALOO_SEMIBOLD } from "../../redux/types";
import { TypographyText } from "../Typography";
import FullStarSvg from "../../assets/full_star.svg";
import HalfStarSvg from "../../assets/half_star.svg";
import { sized } from "../../Svg";
import { useTheme } from "../ThemeProvider";
import { connect } from "react-redux";
import { getMerchantDetails } from "../../redux/merchant/merchant-thunks";
import { useNavigation } from "@react-navigation/native";
import { subscribeNotification } from "../../redux/notifications/notifications-thunks";
import FastImage from "react-native-fast-image";
import { dateForWeeks, getFlexDirection, isRTL } from "../../../utils";
import { useTranslation } from "react-i18next";
import { getCategoryNameByIdAndLang } from "../Categories/helpres";

const FullStarIcon = sized(FullStarSvg, 16);
const HalfStarIcon = sized(HalfStarSvg, 16);

const CompanyItem = ({ width, merchant, getMerchantDetails, isPadding }) => {
  const navigation = useNavigation();

  const { isDark } = useTheme();

  const { t } = useTranslation();

  // const [isShow, setIsShow] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsShow(true);
  //   }, 500);
  // }, []);
  // if (!isShow) return <></>;

  return (
    <View
      style={[
        styles.company,
        isDark && { backgroundColor: colors.secBlue },
        width && { width },
        isPadding && { elevation: 0 },
      ]}
    >
      {merchant.ribbon_text && (
        <View
          style={[
            styles.ribbon,
            merchant.ribbon_color && { backgroundColor: merchant.ribbon_color },
          ]}
        >
          <TypographyText
            textColor={colors.white}
            size={14}
            font={BALOO_SEMIBOLD}
            title={merchant.ribbon_text}
            style={{ width: "75%", textAlign: "center" }}
            numberOfLines={1}
            textElipsis={"tail"}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          getMerchantDetails(
            merchant.merchant_id ?? merchant.partner_id?.[0] ?? merchant.id,
            navigation,
            t,
            getCategoryNameByIdAndLang(merchant.category_id),
            merchant.isOrganization
          );
        }}
      >
        {merchant.banner_image || merchant.banners?.length > 0 ? (
          <FastImage
            style={styles.company__preview}
            source={{
              uri:
                merchant.banner_image ??
                merchant.map_banner ??
                merchant.banners[0].banner_image,
              priority: FastImage.priority.fast,
            }}
          />
        ) : (
          <View
            style={[
              styles.company__preview,
              { backgroundColor: "rgba(0, 0, 0, 0.4)" },
            ]}
          />
        )}
      </TouchableOpacity>
      <View
        style={[
          mainStyles.betweenRow,
          mainStyles.p20,
          {
            marginTop: 40,
            marginBottom: 10,
            position: "relative",
          },
          getFlexDirection(),
        ]}
      >
        <View
          style={[
            mainStyles.logoWrapper,
            { position: "absolute", top: -60, left: 20 },
          ]}
        >
          <FastImage
            source={{
              uri: merchant.merchant_logo ?? merchant.image_512,
              priority: FastImage.priority.fast,
            }}
            style={{ width: 47, height: 47, borderRadius: 50 }}
          />
        </View>

        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={18}
          font={BALOO_SEMIBOLD}
          numberOfLines={1}
          style={{ width: "70%" }}
          title={
            merchant.name ??
            merchant.merchant_name ??
            (merchant.partner_id && merchant.partner_id[1])
          }
        />
        <View style={mainStyles.row}>
          <TypographyText
            textColor={colors.orange}
            size={18}
            font={BALOO_SEMIBOLD}
            title={(+(merchant.merchant_rating ?? merchant.rating)).toFixed(1)}
          />
          <View style={[mainStyles.row, { marginBottom: 4 }]}>
            {[1, 2, 3, 4, 5].map((i) => {
              return (
                <View key={i}>
                  {i <= +(merchant.merchant_rating ?? merchant.rating) ? (
                    <FullStarIcon />
                  ) : (
                    <HalfStarIcon />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  company: {
    shadowColor: "rgba(51, 42, 64, 0.1)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.33,
    shadowRadius: 15,
    elevation: 24,
    borderRadius: 8,
    // overflow: 'hidden',
    width: SCREEN_WIDTH - 40,
    backgroundColor: colors.white,
    position: "relative",
    marginBottom: 15,
    overflow: "hidden",
  },
  company__preview: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: "stretch",
  },
  shadow: {
    shadowColor: "rgba(29,0,13,0.45)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.63,
    shadowRadius: 30,
    elevation: 10,
  },
  ribbon: {
    position: "absolute",
    zIndex: 100,
    width: 170,
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: colors.green,
    top: 0,
    right: 0,
    // transform: [{rotate: '-45deg'}]
  },
});

export default connect(null, { getMerchantDetails })(
  React.memo(
    CompanyItem,
    (prevProps, nextProps) => prevProps.merchant.id === nextProps.merchant.id
  )
);
