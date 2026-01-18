import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { colors } from "../../components/colors";
import IconButton from "../../components/IconButton/IconButton";
import { sized } from "../../Svg";
import ShareSvg from "../../assets/share.svg";
import styles from "./styles";
import Swiper from "react-native-swiper";
import {
  mainStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../styles/mainStyles";
import PremiumSvg from "../../assets/premium.svg";
import { B1G1, LUSAIL_REGULAR } from "../../redux/types";
import { TypographyText } from "../../components/Typography";
import StarSvg from "../../assets/favorites.svg";
import { useTheme } from "../../components/ThemeProvider";
import ShareActiveSvg from "../../assets/share_active.svg";
import StarActiveSvg from "../../assets/star_active.svg";
import { useTranslation } from "react-i18next";
import { getFlexDirection, getStringDate, isRTL } from "../../../utils";
import FastImage from "react-native-fast-image";
import CommonButton from "../../components/CommonButton/CommonButton";
import { captureRef } from "react-native-view-shot";
import ImageViewer from "react-native-image-zoom-viewer";
import CloseSvg from "../../assets/close_white.svg";
import {
  saveOffer,
  track,
  getMerchantDetails,
} from "../../redux/merchant/merchant-thunks";
import { connect } from "react-redux";
import Share from "react-native-share";
import WhiteStarSvg from "../../assets/star_white.svg";
import InfoBlock from "../../components/InfoBlock";

const StarIcon = sized(StarSvg, 13, 13, colors.mainDarkMode);
const StarActiveIcon = sized(StarActiveSvg, 13, 13, colors.mainDarkMode);
const WhiteStarIcon = sized(WhiteStarSvg, 13);
const ShareIcon = sized(ShareSvg, 15, 12, colors.darkBlue);
const PremiumIcon = sized(PremiumSvg, 24);
const ShareActiveIcon = sized(ShareActiveSvg, 15, 12);
const CloseIcon = sized(CloseSvg, 24);

const ProductPage = ({
  route,
  favoriteOffers,
  navigation,
  track,
  saveOffer,
}) => {
  const { t, i18n } = useTranslation();
  const { product } = route?.params || { product: null };
  const { isDark } = useTheme();
  const viewRef = useRef();
  const [isFullImage, setIsFullImage] = useState(false);
  const language = i18n.language;

  const onShare = async () => {
    try {
      const res = await captureRef(viewRef, {
        result: "tmpfile",
        height: 1300,
        width: 1100,
        quality: 1,
        format: "png",
      });

      await Share.open({ url: res });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${product.phone_number}`);
  };

  return (
    <>
      <Modal visible={isFullImage} transparent={true}>
        <ImageViewer
          supportedOrientations={[
            "portrait",
            "portrait-upside-down",
            "landscape",
            "landscape-left",
            "landscape-right",
          ]}
          saveToLocalByLongPress={false}
          index={0}
          renderImage={({ source, style }) => {
            return (
              <View
                style={{ alignItems: "center", justifyContent: "flex-end" }}
              >
                <Image
                  source={{ uri: product.image_url }}
                  style={[
                    {
                      width: SCREEN_WIDTH,
                      height: SCREEN_HEIGHT,
                      resizeMode: "contain",
                      marginTop: (SCREEN_HEIGHT / 100) * 22,
                    },
                    style,
                  ]} // your custom style object
                  // any supported props by Image
                />
              </View>
            );
          }}
          renderHeader={(props) => {
            return (
              <View
                style={[
                  mainStyles.row,
                  {
                    justifyContent: "space-between",
                    top: 50,
                    left: 20,
                    position: "absolute",
                    zIndex: 100,
                    width: "90%",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => setIsFullImage(false)}
                  style={mainStyles.modal__close}
                >
                  <CloseIcon />
                </TouchableOpacity>
              </View>
            );
          }}
          onSwipeDown={() => setIsFullImage(false)}
          enableSwipeDown={true}
          imageUrls={[
            {
              url: product.image_url,
              width: SCREEN_WIDTH,
              minHeight: SCREEN_HEIGHT / 2,
            },
          ]}
          loadingRender={() => (
            <ActivityIndicator
              size={"large"}
              color={isDark ? colors.mainDarkMode : colors.darkBlue}
            />
          )}
          renderIndicator={(currentIndex, allSize) => (
            <View style={styles.imagesIndicator}>
              <TypographyText
                textColor={colors.white}
                size={16}
                font={LUSAIL_REGULAR}
                title={`${currentIndex}/${allSize}`}
              />
            </View>
          )}
        />
      </Modal>
      <View
        style={{
          backgroundColor: isDark ? colors.darkBlue : colors.white,
          flex: 1,
        }}
      >
        <SafeAreaView>
          <CommonHeader isWhite={isDark} label={t("ProductPage.offer")} />
          <ScrollView style={{ height: SCREEN_HEIGHT }}>
            <View
              ref={viewRef}
              style={{
                backgroundColor: isDark ? colors.darkBlue : colors.white,
              }}
            >
              <View
                style={[
                  mainStyles.betweenRow,

                  { marginVertical: 16, paddingHorizontal: 10 },
                  getFlexDirection(),
                ]}
              >
                <View style={[mainStyles.row, getFlexDirection()]}>
                  <View style={[mainStyles.logoWrapper, { marginLeft: 6 }]}>
                    <FastImage
                      source={{
                        uri: product.merchant_logo,
                      }}
                      resizeMode="contain"
                      style={{ width: 46, height: 46, borderRadius: 50 }}
                    />
                    <PremiumIcon
                      style={{ position: "absolute", top: 0, right: 0 }}
                    />
                  </View>
                  <TypographyText
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={18}
                    font={LUSAIL_REGULAR}
                    title={
                      language === "ar"
                        ? product?.x_arabic_name
                          ? product.x_arabic_name
                          : product.merchant_name
                        : product.merchant_name
                    }
                    style={[styles.key, { flex: 1, fontWeight: "700" }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  />
                </View>
              </View>
              <View style={styles.swiperWrapper}>
                <Swiper
                  style={[
                    mainStyles.swiper,
                    styles.borderBottom,
                    { maxHeight: 210 },
                    isDark && { borderBottomColor: colors.secBlue },
                  ]}
                  dot={
                    <View
                      style={[
                        mainStyles.dot,
                        { backgroundColor: colors.lightGrey },
                      ]}
                    />
                  }
                  removeClippedSubviews={false}
                  activeDot={
                    <View
                      style={[
                        mainStyles.dot,
                        { backgroundColor: colors.green },
                      ]}
                    />
                  }
                  render
                >
                  <TouchableOpacity
                    onPress={() => setIsFullImage(true)}
                    style={[mainStyles.swiper__img, { alignItems: "center" }]}
                  >
                    <Image
                      source={{ uri: product.image_url }}
                      style={{
                        width: "100%",
                        height: undefined,
                        aspectRatio: 1,
                      }}
                    />
                  </TouchableOpacity>
                </Swiper>
              </View>

              <View style={[mainStyles.p20, { marginTop: 25 }]}>
                <View style={[getFlexDirection()]}>
                  <IconButton
                    onPress={() => {
                      saveOffer(product.id, t);
                    }}
                    color={
                      favoriteOffers?.find?.((o) => o?.id === product?.id) !==
                      undefined
                        ? colors.white
                        : colors.mainDarkMode
                    }
                    icon={
                      favoriteOffers?.find?.((o) => o?.id === product?.id) !==
                      undefined ? (
                        <WhiteStarIcon />
                      ) : isDark ? (
                        <StarActiveIcon />
                      ) : (
                        <StarIcon />
                      )
                    }
                    style={
                      favoriteOffers?.find?.((o) => o?.id === product?.id) !==
                      undefined
                        ? {
                            backgroundColor: colors.orange,
                            borderColor: "transparent",
                          }
                        : {}
                    }
                    label={t("Product.save")}
                  />

                  <IconButton
                    style={{
                      marginLeft: !isRTL() ? 15 : 0,
                      marginRight: isRTL ? 15 : 0,
                    }}
                    onPress={onShare}
                    icon={isDark ? <ShareActiveIcon /> : <ShareIcon />}
                    label={t("Product.share")}
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                </View>

                <InfoBlock title={t("Product.name")}>
                  <TypographyText
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={16}
                    font={LUSAIL_REGULAR}
                    title={product.name}
                    style={{ fontWeight: "700" }}
                  />
                </InfoBlock>
                {!!product.ribbon && (
                  <InfoBlock title={t("Product.specialOffer")}>
                    <TypographyText
                      textColor={isDark ? colors.white : colors.darkBlue}
                      size={16}
                      font={LUSAIL_REGULAR}
                      title={
                        language === "ar"
                          ? product.x_label_arabic
                          : product.offer_label
                      }
                      style={styles.value}
                    />
                  </InfoBlock>
                )}
                {!!product.lst_price && (
                  <InfoBlock title={t("ProductPage.price")}>
                    <TypographyText
                      textColor={isDark ? colors.white : colors.darkBlue}
                      size={16}
                      font={LUSAIL_REGULAR}
                      title={`${product.lst_price} QAR`}
                      style={styles.value}
                    />
                  </InfoBlock>
                )}
                {!!product.discount && (
                  <InfoBlock title={t("ProductPage.disReceivable")}>
                    <TypographyText
                      textColor={isDark ? colors.white : colors.darkBlue}
                      size={16}
                      font={LUSAIL_REGULAR}
                      title={`${product.discount}%`}
                      style={styles.value}
                    />
                  </InfoBlock>
                )}

                <InfoBlock title={t("ProductPage.description")}>
                  <TypographyText
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={16}
                    font={LUSAIL_REGULAR}
                    title={
                      i18n.language === "ar"
                        ? product.x_description_arabic
                        : product.description_sale ?? product.offer_label
                    }
                    style={styles.key}
                  />
                </InfoBlock>

                {!!product.phone_number && (
                  <InfoBlock title={t("ProductPage.phone")}>
                    <TouchableOpacity onPress={handlePhonePress}>
                      <TypographyText
                        textColor={isDark ? colors.white : colors.darkBlue}
                        size={16}
                        font={LUSAIL_REGULAR}
                        title={product.phone_number}
                        style={styles.key}
                      />
                    </TouchableOpacity>
                  </InfoBlock>
                )}

                {!!product.merchant_email && (
                  <InfoBlock title={t("ProductPage.email")}>
                    <TypographyText
                      textColor={isDark ? colors.white : colors.darkBlue}
                      size={16}
                      font={LUSAIL_REGULAR}
                      title={product.merchant_email}
                      style={styles.key}
                    />
                  </InfoBlock>
                )}
              </View>
            </View>

            <View style={mainStyles.p20}>
              {product.x_offer_type === B1G1 && (
                <CommonButton
                  label={"B1G1 Free"}
                  style={{
                    ...mainStyles.borderButton,
                    ...mainStyles.mt20,
                    backgroundColor: isDark
                      ? colors.mainDarkMode
                      : colors.white,
                    borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
                  }}
                  textColor={isDark ? colors.mainDarkModeText : colors.darkBlue}
                  onPress={() => {
                    navigation.navigate("Promocode", {
                      merchant_name: product.merchant_name,
                      name: product.name,
                      expiryDate: product.end_date
                        ? getStringDate(product.end_date.split(" ")[0])
                        : null,
                      merchant_logo: product.merchant_logo,
                      id: product.id,
                      promocode: product.x_offer_type_promo_code,
                      merchant_id: product.merchant_id,
                    });
                  }}
                />
              )}
              {product.x_offer_type_promo_code && (
                <CommonButton
                  onPress={() => {
                    // track('promocode', product.id, false, params?.promocode)
                    navigation.navigate("Voucher", {
                      name: product.name,
                      id: product.id,
                      merchant_name: product.merchant_name,
                      expiryDate: product.end_date
                        ? getStringDate(product.end_date.split(" ")[0])
                        : null,
                      merchant_logo: product.merchant_logo,
                      promocode: product.x_offer_type_promo_code,
                      merchant_id: product.merchant_id,
                    });
                  }}
                  label={t("ProductPage.getPromocode")}
                  style={{
                    ...mainStyles.borderButton,
                    ...mainStyles.mt20,
                    borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
                    backgroundColor: isDark
                      ? colors.mainDarkMode
                      : colors.white,
                  }}
                  textColor={isDark ? colors.mainDarkModeText : colors.darkBlue}
                />
              )}
              {product.x_merchant_online_store && (
                <CommonButton
                  label={
                    !product.x_online_store
                      ? `${t("ProductPage.goToOnlineStore")} ${t(
                          "ProductPage.merchantDetails"
                        )}`
                      : `${t("ProductPage.goToOnlineStore")} ${
                          product.merchant_name
                        } ${t("TabBar.onlineStore")}`
                  }
                  onPress={() => {
                    track(
                      "online_link",
                      product.id,
                      false,
                      product.x_merchant_online_store
                    );
                    Linking.openURL(product.x_merchant_online_store);
                  }}
                  style={{
                    ...mainStyles.borderButton,
                    ...mainStyles.mt20,
                    borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
                    backgroundColor: isDark
                      ? colors.mainDarkMode
                      : colors.white,
                  }}
                  textColor={isDark ? colors.mainDarkModeText : colors.darkBlue}
                />
              )}

              <View style={{ height: 200 }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

const mapStateToProps = (state) => ({
  favoriteOffers: state.merchantReducer.favoriteOffers,
});

export default connect(mapStateToProps, {
  track,
  saveOffer,
  getMerchantDetails,
})(ProductPage);
