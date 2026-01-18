import React, { useCallback, useRef, useState } from 'react';
import { colors } from '../../components/colors';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import { mainStyles } from '../../styles/mainStyles';
import { styles } from './styles';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../redux/types';
import { TypographyText } from '../../components/Typography';
import { useTranslation } from 'react-i18next';
import DeliverySvg from '../../assets/delivery.svg';
import DeliveryWhiteSvg from '../../assets/delivery_white.svg';
import { sized } from '../../Svg';
import CommonButton from '../../components/CommonButton/CommonButton';
import IconButton from '../../components/IconButton/IconButton';
import Slider from 'react-native-slide-to-unlock';
import SwipeSvg from '../../assets/swipe.svg';
import CopySvg from '../../assets/copy.svg';
import { connect } from 'react-redux';
import {
  getMerchantDetails,
  saveOffer,
  track,
} from '../../redux/merchant/merchant-thunks';
import Clipboard from '@react-native-clipboard/clipboard';
// import RNPrint from "react-native-print";
// import { captureRef } from "react-native-view-shot";
// import Share from "react-native-share";

const DeliveryIcon = sized(DeliverySvg, 24);
const DeliveryWhiteIcon = sized(DeliveryWhiteSvg, 24);
const SwipeIcon = sized(SwipeSvg, 60);
const CopyIcon = sized(CopySvg, 24);

const Voucher = ({
  route,
  navigation,
  saveOffer,
  getMerchantDetails,
  track,
}) => {
  let params = route?.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [isSlided, setIsSlided] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  // const [isHideButtons, setIsHideButtons] = useState(false);
  const viewRef = useRef();
  const toContactUs = useCallback(() => {
    navigation.navigate('ContactUs');
  }, []);

  // const downloadPromocode = async (isShare) => {
  //   setIsHideButtons(true);
  //   setTimeout(async () => {
  //     const base64 = await captureRef(viewRef, {
  //       result: "base64",
  //       height: 545,
  //       width: 345,
  //       quality: 1,
  //       format: "png",
  //     });

  //     if (isShare) {
  //       await Share.open({ url: base64 });
  //       setIsHideButtons(false);
  //     } else {
  //       const html = `
  //       <html>
  //         <head>
  //           <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  //         </head>
  //         <body style="text-align: center;">
  //           <img
  //             src="data:image/png;base64,${base64}"
  //             style="width: 100vw; height: 100vh;"/>
  //         </body>
  //       </html>
  //       `;
  //       try {
  //         await RNPrint.printAsync({
  //           html,
  //         });
  //         setIsHideButtons(false);
  //       } catch (e) {
  //         setIsHideButtons(false);
  //       }
  //     }
  //   }, 100);
  // };

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        flex: 1,
      }}
    >
      <SafeAreaView>
        <CommonHeader isWhite={isDark} label={params?.merchant_name} />
        <ScrollView>
          <View style={mainStyles.p20}>
            <View
              ref={viewRef}
              style={[
                styles.container,
                { backgroundColor: isDark ? colors.darkBlue : colors.white },
              ]}
            >
              <TypographyText
                textColor={!isDark ? colors.green : colors.white}
                size={24}
                font={BALOO_SEMIBOLD}
                title={params?.name}
                style={mainStyles.centeredText}
              />

              <View style={[mainStyles.centeredRow, { marginVertical: 36 }]}>
                {isDark ? <DeliveryWhiteIcon /> : <DeliveryIcon />}
                <TypographyText
                  textColor={!isDark ? colors.darkBlue : colors.white}
                  size={14}
                  font={BALOO_SEMIBOLD}
                  title={t('PremiumPartner.delivery')}
                  style={{ marginLeft: 11 }}
                />
              </View>
              {
                <Slider
                  onEndReached={() => {
                    setIsSlided(true);

                    // saveOffer(params?.id, t, true);

                    track(
                      'promocode',
                      params?.id,
                      false,
                      params?.promocode,

                      () => {
                        track('promocode', params?.id, true, params?.promocode);
                      },
                    );
                  }}
                  containerStyle={{
                    margin: 8,
                    backgroundColor: isCopied ? '#8286B1' : colors.navyBlue,
                    borderRadius: 10,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '95%',
                  }}
                  sliderElement={
                    isSlided ? (
                      <View style={{ height: 60 }}></View>
                    ) : (
                      <SwipeIcon />
                    )
                  }
                >
                  {isSlided ? (
                    <View style={mainStyles.row}>
                      <TypographyText
                        textColor={colors.white}
                        size={24}
                        font={BALOO_SEMIBOLD}
                        title={`${params?.promocode ?? ''} |`}
                      />
                      <TouchableOpacity
                        onPress={async () => {
                          setIsCopied(true);
                          Clipboard.setString(params?.promocode ?? '');

                          setTimeout(() => {
                            navigation.navigate('Main');
                          }, 3000);
                        }}
                        style={mainStyles.row}
                      >
                        <CopyIcon style={{ marginHorizontal: 5 }} />
                        <TypographyText
                          textColor={colors.white}
                          size={24}
                          font={BALOO_SEMIBOLD}
                          title={isCopied ? 'Copied' : 'Copy'}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TypographyText
                      textColor={colors.white}
                      size={18}
                      font={BALOO_SEMIBOLD}
                      title={t('PremiumPartner.swipeToGetCode')}
                      style={[mainStyles.centeredText, { marginLeft: 30 }]}
                    />
                  )}
                </Slider>
              }
              <TypographyText
                textColor={!isDark ? colors.darkBlue : colors.white}
                size={14}
                font={BALOO_SEMIBOLD}
                title={t('PremiumPartner.applyPromo', {
                  name: params?.merchant_name,
                })}
                style={[mainStyles.centeredText, { marginVertical: 35 }]}
              />
              <CommonButton
                label={t('PremiumPartner.visitStore', {
                  name:
                    params?.merchant_name?.length > 15
                      ? `${params?.merchant_name.slice(0, 15)}...`
                      : params?.merchant_name,
                })}
                textColor={isDark ? colors.white : colors.green}
                style={{
                  ...mainStyles.borderButton,
                  ...mainStyles.mb20,
                  borderColor: isDark ? colors.white : colors.green,
                  backgroundColor: isDark ? colors.darkBlue : colors.white,
                }}
                onPress={() => {
                  //Linking.openURL(merchantDetails.website)
                  getMerchantDetails(params?.merchant_id, navigation, t);
                }}
              />
              {/* {isSlided && !isHideButtons && (
                <>
                  <CommonButton
                    label={t("PremiumPartner.downloadPromocode")}
                    icon={isDark ? <PDFWhiteIcon /> : <PDFIcon />}
                    textColor={isDark ? colors.white : colors.green}
                    style={{
                      ...mainStyles.borderButton,
                      ...mainStyles.mb20,
                      borderColor: isDark ? colors.white : colors.green,
                      backgroundColor: isDark ? colors.darkBlue : colors.white,
                    }}
                    onPress={() => downloadPromocode()}
                  />
                  <CommonButton
                    label={t("PremiumPartner.sharePromocode")}
                    icon={isDark ? <ShareWhiteIcon /> : <ShareIcon />}
                    textColor={isDark ? colors.white : colors.green}
                    style={{
                      ...mainStyles.borderButton,
                      borderColor: isDark ? colors.white : colors.green,
                      backgroundColor: isDark ? colors.darkBlue : colors.white,
                    }}
                    onPress={() => downloadPromocode(true)}
                  />
                </>
              )} */}
              <View style={[mainStyles.centeredRow, { marginTop: 30 }]}>
                <IconButton
                  onPress={toContactUs}
                  color={isDark ? colors.white : null}
                  label={t('PremiumPartner.reportAnIssue')}
                />
              </View>

              {params?.expiryDate && (
                <TypographyText
                  textColor={!isDark ? colors.grey : colors.white}
                  size={12}
                  font={BALOO_REGULAR}
                  title={`${t('PremiumPartner.validTill')} ${
                    params.expiryDate
                  }`}
                  style={[mainStyles.centeredText, { marginTop: 20 }]}
                />
              )}

              <View style={mainStyles.mb20} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  saveOffer,
  getMerchantDetails,
  track,
})(Voucher);
