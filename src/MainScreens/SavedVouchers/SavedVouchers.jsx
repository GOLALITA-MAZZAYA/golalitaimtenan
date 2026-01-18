import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../components/ThemeProvider';
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { mainStyles, SCREEN_HEIGHT } from '../../styles/mainStyles';
import { colors } from '../../components/colors';
import { onBannerPress } from '../../../utils';
// import YoutubePlayer from "react-native-youtube-iframe";
import Categories from '../../components/Categories/Categories';
import StoreItem from '../../components/StoreItem/StoreItem';
import MainLayout from '../../components/MainLayout';
import MainScreenTop from '../MainScreen/MainScreenTop';
import { B1G1 } from '../../redux/types';
import { connect } from 'react-redux';
import {
  getFavoriteOffers,
  getMerchantDetails,
  trackBanner,
} from '../../redux/merchant/merchant-thunks';

const SavedVouchers = ({
  advert,
  route,
  getOffers,
  offers,
  getMerchantDetails,
  trackBanner,
  isMerchantsLoading,
  user,
  favoriteOffers,
  getFavoriteOffers,
}) => {
  const params = route?.params;
  const { i18n, t } = useTranslation();
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    // getOffers({
    //   merchant_id: null,
    //   merchant_category_id: selectedCategory,
    //   page: 1,
    // });

    getFavoriteOffers(false, selectedCategory, true);
  }, [selectedCategory]);

  const keyExtractor = useCallback(item => `${item.merchant_id}`, []);
  const renderFooter = useCallback(
    () => <View style={{ marginBottom: 130 }} />,
    [],
  );

  const renderHeader = useCallback(() => {
    return (
      <>
        {advert && advert.ad_3 && advert.ad_3.length > 0 && (
          <Swiper
            style={{ maxHeight: 100 }}
            autoplay={true}
            autoplayTimeout={8}
            dot={<View style={mainStyles.dot} />}
            activeDot={
              <View
                style={[
                  [
                    mainStyles.dot,
                    {
                      backgroundColor: isDark ? colors.green : colors.darkBlue,
                    },
                  ],
                ]}
              />
            }
            removeClippedSubviews={false}
          >
            {advert.ad_3.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                onPress={() =>
                  onBannerPress(
                    item.banner_url,
                    getMerchantDetails,
                    navigation,
                    t,
                    trackBanner,
                    user,
                    item.tracking_code,
                  )
                }
              >
                {/* {item.banner_image.indexOf("banner_image") !== -1 ? (
                  <Image
                    source={{ uri: item.banner_image }}
                    style={{
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      height: 94,
                      width: "100%",
                    }}
                  />
                ) : (
                  // <YoutubePlayer
                  //   height={150}
                  //   play={true}
                  //   videoId={
                  //     item.banner_url.split("=").length > 1
                  //       ? item.banner_url.split("=")[1]
                  //       : item.banner_url.split("/")[
                  //           item.banner_url.split("/").length - 1
                  //         ]
                  //   }
                  //   mute={true}
                  //   onChangeState={() => {}}
                  //   initialPlayerParams={{
                  //     controls: 0,
                  //     showInfo: false,
                  //     loop: true,
                  //   }}
                  //   webViewStyle={{
                  //     borderTopLeftRadius: 10,
                  //     borderTopRightRadius: 10,
                  //     pointersEvents: "none",
                  //   }}
                  // />
                )} */}
              </TouchableOpacity>
            ))}
          </Swiper>
        )}

        <Categories setSelectedCategory={setSelectedCategory} />
        {isMerchantsLoading ? (
          <View style={[mainStyles.centeredRow, { marginVertical: 30 }]}>
            <ActivityIndicator size={'large'} color={colors.green} />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  }, [user, advert, isDark, isMerchantsLoading]);

  const renderCompanyItem = useCallback(
    ({ item }) => {
      return (
        <View style={mainStyles.p20}>
          <StoreItem merchant={item} isB1G1={params?.isB1G1} />
        </View>
      );
    },
    [user, i18n.language],
  );

  return (
    <></>
    // <MainLayout outsideScroll={true} headerChildren={<MainScreenTop/>}
    //             headerHeight={50} contentStyle={{height: SCREEN_HEIGHT - 120,}}>
    //   {/*<FlatList data={params?.isMyVouchers ? [...favoriteOffers] : [...new Map(offers.map(item =>*/}
    //   {/*  [item['merchant_id'], item])).values()].filter(o => params?.isB1G1 ? o.x_offer_type === B1G1 : true)}*/}
    //   {/*          legacyImplementation={true}*/}
    //   {/*          disableVirtualization={true}*/}
    //   {/*          windowSize={SCREEN_HEIGHT}*/}
    //   {/*          maxToRenderPerBatch={5}*/}
    //   {/*          removeClippedSubviews={true}*/}
    //   {/*          ListHeaderComponent={renderHeader}*/}
    //   {/*          ListFooterComponent={renderFooter}*/}
    //   {/*          renderItem={renderCompanyItem}*/}
    //   {/*          keyExtractor={keyExtractor}*/}
    //   {/*          refreshing={false}*/}
    //   {/*/>*/}
    // </MainLayout>
  );
};

const mapStateToProps = state => ({
  merchants: state.merchantReducer.merchants,
  user: state.authReducer.user,
  advert: state.merchantReducer.advert,
  isMerchantsLoading: state.loadersReducer.isMerchantsLoading,
  offers: state.merchantReducer.offers,
  favoriteOffers: state.merchantReducer.favoriteOffers,
});

export default connect(mapStateToProps, {
  getMerchantDetails,
  trackBanner,
  getFavoriteOffers,
})(SavedVouchers);
