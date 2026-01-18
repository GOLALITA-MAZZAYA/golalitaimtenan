import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { mainStyles } from "../../styles/mainStyles";
import FastImage from "react-native-fast-image";
import { styles } from "./styles";
import { colors } from "../colors";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";
import { TypographyText } from "../Typography";
import { useTheme } from "../ThemeProvider";
import { sized } from "../../Svg";
import FullStarSvg from "../../assets/full_star.svg";
import HalfStarSvg from "../../assets/half_star.svg";
import { connect } from "react-redux";
import {
  getMerchantDetails,
  saveOffer,
  track,
} from "../../redux/merchant/merchant-thunks";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import ArrowSvg from "../../assets/arrow_right.svg";
import { dateForWeeks, getStringDate } from "../../../utils";
import IconButton from "../IconButton/IconButton";
import StarSvg from "../../assets/favorites.svg";
import WhiteStarSvg from "../../assets/star_white.svg";
import StarActiveSvg from "../../assets/star_active.svg";
import ArrowRightGoldSvg from "../../assets/arrow_right_gold.svg";

const FullStarIcon = sized(FullStarSvg, 16);
const HalfStarIcon = sized(HalfStarSvg, 16);
const ArrowIcon = sized(ArrowSvg, 24);
const StarIcon = sized(StarSvg, 13);
const WhiteStarIcon = sized(WhiteStarSvg, 13);
const StarActiveIcon = sized(StarActiveSvg, 13);
const ArrowRightGoldIcon = sized(ArrowRightGoldSvg, 24);

const StoreItem = ({
  merchant,
  isB1G1,
  merchant_logo,
  favoriteOffers,
  getMerchantDetails,
  saveOffer,
  merchant_name,
  merchant_id,
  isSaved,
  id,
  track,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  let isFavourite =
    isSaved ||
    (favoriteOffers?.find?.((o) => o.id === merchant.id) !== undefined &&
      merchant_logo);

  return (
    <TouchableOpacity
      onPress={() => {
        if (merchant_logo || isFavourite) {
          navigation.navigate(isB1G1 ? "Promocode" : "Voucher", {
            merchant_name:
              merchant.merchant_name ?? merchant_name ?? merchant.name,
            name: merchant.name,
            expiryDate: merchant.end_date
              ? getStringDate(merchant.end_date.split(" ")[0])
              : null,
            merchant_logo:
              merchant_logo ?? merchant.merchant_logo ?? merchant.image_512,
            id: merchant.id,
            promocode: merchant.x_offer_type_promo_code,
            merchant_id:
              merchant.merchant_id ??
              merchant_id ??
              merchant.partner_id?.[0] ??
              merchant.id,
          });
        } else {
          getMerchantDetails(
            merchant.merchant_id ?? merchant.partner_id?.[0] ?? merchant.id,
            navigation,
            t,
            isB1G1
              ? merchant.merchant_name ??
                  merchant_name ??
                  merchant.name ??
                  (merchant.partner_id && merchant.partner_id[1])
              : t("TabBar.onlineStore"),
            merchant.isOrganization,
            !isB1G1,
            isB1G1
          );
        }
      }}
      style={[
        styles.item,
        { backgroundColor: isDark ? colors.secBlue : "#fff", margin: 10 },
      ]}
    >
      <View style={[styles.logoWrapper]}>
        {id ? (
          <Image source={{ uri: merchant_logo }} style={styles.logo} />
        ) : (
          <FastImage
            source={{
              uri:
                merchant_logo ??
                merchant.merchant_logo ??
                merchant.image_512 ??
                merchant.image_url,
            }}
            style={styles.logo}
          />
        )}
      </View>
      <View style={{ width: merchant_logo || isSaved ? "40%" : "70%" }}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={18}
          font={BALOO_SEMIBOLD}
          numberOfLines={1}
          style={{ width: "100%" }}
          title={
            isFavourite
              ? merchant.name
              : merchant.merchant_name ??
                merchant.name ??
                (merchant.partner_id && merchant.partner_id[1])
          }
        />
        {merchant_logo || isSaved ? (
          <TypographyText
            textColor={colors.grey}
            size={12}
            font={BALOO_REGULAR}
            numberOfLines={1}
            style={{ width: "100%" }}
            title={
              merchant.end_date
                ? `${t("PremiumPartner.expiryDate")}: ${getStringDate(
                    merchant.end_date.split(" ")[0]
                  )}`
                : ""
            }
          />
        ) : (
          <View style={mainStyles.row}>
            <TypographyText
              textColor={colors.orange}
              size={18}
              font={BALOO_SEMIBOLD}
              title={(+(merchant.merchant_rating ?? merchant.rating)).toFixed(
                1
              )}
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
        )}
      </View>
      {merchant_logo || isSaved ? (
        <>
          <View>
            <IconButton
              onPress={() => {
                if (!isFavourite) saveOffer(merchant.id, t);
              }}
              style={[isFavourite && mainStyles.selectedOrange]}
              icon={
                isFavourite ? (
                  <WhiteStarIcon />
                ) : isDark ? (
                  <StarActiveIcon />
                ) : (
                  <StarIcon />
                )
              }
              color={isFavourite ? colors.white : null}
              label={isFavourite ? t("ProductPage.saved") : t("Product.save")}
            />
            <View style={[mainStyles.row, { justifyContent: "flex-end" }]}>
              <TypographyText
                textColor={colors.orange}
                size={14}
                font={BALOO_SEMIBOLD}
                title={isB1G1 ? "B1G1 Free" : "Promo Code"}
              />
              <ArrowRightGoldIcon />
            </View>
          </View>
        </>
      ) : (
        <ArrowIcon style={styles.arrow} />
      )}
    </TouchableOpacity>
  );
};

const mapStateToProps = (state) => ({
  favoriteOffers: state.merchantReducer.favoriteOffers,
});

export default connect(mapStateToProps, {
  getMerchantDetails,
  saveOffer,
  track,
})(StoreItem);
