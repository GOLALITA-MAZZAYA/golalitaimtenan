import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  mainStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../styles/mainStyles';
import { sized } from '../../../Svg';
import { colors } from '../../../components/colors';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../../redux/types';
import { TypographyText } from '../../../components/Typography';
import styles from './styles';
import NotificationSvg from '../../../assets/notification_yellow.svg';
import NotificationDisabledSvg from '../../../assets/notification.svg';
import { useTheme } from '../../../components/ThemeProvider';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ShareSvg from '../../../assets/share.svg';
import DiscountLabel from '../../../assets/discountLabel.svg';
import { subscribeNotification } from '../../../redux/notifications/notifications-thunks';
import ImageViewer from 'react-native-image-zoom-viewer';
import CloseSvg from '../../../assets/close_white.svg';
import CommonButton from '../common/CommonButton';
import { Tabs } from 'react-native-collapsible-tab-view';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { saveOffer } from '../../../redux/merchant/merchant-thunks';
import Header from '../../../components/Header';
import { isRTL } from '../../../../utils';
import { getContracts } from '../../../api/merchants';
import InfoTab from '../MerchantInfo/InfoTab';
import MapTab from './components/InfoTabs/MapTab';
import OfferTab from './components/InfoTabs/OffersTab';
import i18next from 'i18next';
import { ScrollView } from 'react-native';
import BannerSwiper from '../../../components/BannerSwiper';
import RoomRatesTab from '../MerchantInfo/RoomRatesTab';

const CONSTANTS = {
  INFO: 'INFO',
  LOCATION: 'LOCATION',
  OFFERS: 'OFFERS',
  ROOM_RATES: "ROOM_RATES"
};

const getTabs = () => {
  return [
    {
      key: 'INFO',
      label: i18next.t('Merchants.info'),
    },
    {
      key: 'LOCATION',
      label: i18next.t('Merchants.location'),
    },
    {
      key: 'OFFERS',
      label: i18next.t('Merchants.offers'),
    },
    {
      key: 'ROOM_RATES',
      label: i18next.t('Merchants.roomRates'),
    },

  ];
};

const NotificationIcon = sized(NotificationSvg, 17, 20, '#fff');
const NotificationDisabledIcon = sized(NotificationDisabledSvg, 17, 17, '#fff');
const ShareIcon = sized(ShareSvg, 20, 20, '#fff');
const CloseIcon = sized(CloseSvg, 24);

const Overview = ({
  route,
  merchantDetails,
  subscribeNotification,
  title,
  loading,
}) => {
  const { i18n, t } = useTranslation();
  const params = route?.params;
  const { isDark } = useTheme();
  const [isFullImage, setIsFullImage] = useState(false);
  const [activeTab, setActiveTab] = useState(CONSTANTS.INFO);
  const isArabic = i18n.language === 'ar';
  const language = i18n.language;

  const tabs = useMemo(() => getTabs(), [language]);

  const DiscountLabelF = sized(
    DiscountLabel,
    12,
    12,
    isDark ? colors.black : colors.darkBlue,
  );
  const viewRef = useRef();

  useEffect(() => {
    getContracts();
  }, []);

  const ribbonText =
    i18n.language === 'ar'
      ? merchantDetails?.ribbon_text?.x_ribbon_text_arabic
      : merchantDetails?.ribbon_text?.ribbon_text;

  const onShare = async () => {
    try {
      const url = await viewRef.current.capture({
        result: 'tmpfile',
        height: 400,
        width: 335,
        quality: 1,
        format: 'png',
      });

      await Share.open({ url });
    } catch (error) {
      console.log(error);
    }
  };

  const renderHeader = useCallback(() => {

    const imageViwerImages = merchantDetails?.banners?.length
      ? merchantDetails?.banners.map(banner => ({
          url: banner.banner_image,
          width: SCREEN_WIDTH,
          height: 232,
        }))
      : [
          {
            url: merchantDetails.map_banner,
            width: SCREEN_WIDTH,
            height: 232,
          },
        ];

    return (
      <View
        style={{
          paddingBottom: 44,
          backgroundColor: isDark ? colors.navyBlue : '#fff',
        }}
      >
        <View>
          <Header
            label={
              title
                ? title
                : params?.isOrganization
                  ? t('PremiumPartner.organization')
                  : merchantDetails?.category
            }
            style={{ paddingHorizontal: 20, paddingBottom: 20 }}
          />

          <View
            style={{
              marginTop: 14,
              paddingHorizontal: 20,
            }}
          >
            <BannerSwiper
              banners={merchantDetails.banners}
              singleBannerUrl={merchantDetails.map_banner}
              onBannerPress={() => setIsFullImage(true)}
              isDark={isDark}
              aspectRatio={23 / 10}
              autoplay={true}
              autoplayTimeout={3}
              loop={true}
            />
          </View>
        </View>
        <View style={styles.titleWrapper}>
          <View
            style={{
              flexDirection: isRTL() ? 'row-reverse' : 'row',
              alignItems: 'center',
              flex: 1,
              marginTop: 20,
            }}
          >
            <View>
              <Image
                source={{
                  uri:
                    merchantDetails.merchant_logo ?? merchantDetails.org_logo,
                }}
                style={styles.logo}
              />
            </View>
            <TypographyText
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              size={18}
              font={BALOO_SEMIBOLD}
              title={
                isArabic
                  ? merchantDetails?.merchant_name_arabic
                    ? merchantDetails.merchant_name_arabic
                    : merchantDetails.merchant_name
                  : merchantDetails.merchant_name
              }
              style={{
                marginHorizontal: 8,
                flex: 1,
              }}
              numberOfLines={1}
            />
            {!!ribbonText && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? colors.mainDarkMode : null,
                  padding: 5,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: isDark ? null : colors.darkBlue,
                }}
              >
                <DiscountLabelF />
                <TypographyText
                  textColor={isDark ? colors.mainDarkModeText : colors.darkBlue}
                  size={14}
                  font={BALOO_SEMIBOLD}
                  title={ribbonText}
                  style={{
                    // width: "75%",
                    marginLeft: 6,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                  textElipsis={'tail'}
                />
              </View>
            )}
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'flex-end',
              width: 95,
              marginRight: 20,
            }}
          >
            <TouchableOpacity
              onPress={onShare}
              style={[
                styles.shareIcon,
                {
                  borderWidth: 1.5,
                  borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
                  backgroundColor: null,
                },
              ]}
            >
              <ShareIcon
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
              />
            </TouchableOpacity>
            {!merchantDetails.isOrganization && (
              <TouchableOpacity
                onPress={() =>
                  subscribeNotification(
                    !merchantDetails.is_subscribe,
                    merchantDetails.merchant_id ??
                      merchantDetails.partner_id?.[0] ??
                      merchantDetails.id,
                    t,
                  )
                }
                style={[
                  styles.notificationIcon,
                  {
                    borderWidth: 1.5,
                    borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
                    backgroundColor: null,
                  },
                ]}
              >
                {merchantDetails.is_subscribe ? (
                  <NotificationIcon
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                ) : (
                  <NotificationDisabledIcon
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {merchantDetails.x_online_store && (
          <CommonButton
            text={`${t('ProductPage.openOnlineStore')} ${
              merchantDetails.merchant_name.length > 15
                ? `${merchantDetails.merchant_name.slice(0, 15)}...`
                : merchantDetails.merchant_name
            } ${t('TabBar.onlineStore')}`}
            onPress={() => Linking.openURL(merchantDetails.website)}
            wrapperStyle={{
              backgroundColor: '#00A3FF',
              marginHorizontal: 20,
              borderWidth: 0,
              marginTop: 25,
            }}
            textStyle={{ color: '#fff' }}
          />
        )}

        <ScrollView
          contentContainerStyle={{
            marginTop: 10,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map(item => {
            const color = isDark ? colors.mainDarkMode : colors.darkBlue;
            const activeBorder = isDark ? colors.mainDarkMode : colors.darkBlue;
            const passiveBorder = isDark ? colors.borderGrey : colors.lightGrey;

            return (
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    borderColor:
                      item.key === activeTab ? activeBorder : passiveBorder,
                  },
                ]}
                onPress={() => setActiveTab(item.key)}
              >
                <TypographyText
                  textColor={color}
                  size={15}
                  style={{ fontWeight: '700' }}
                  title={item.label}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Modal visible={isFullImage} transparent={true}>
          <ImageViewer
            supportedOrientations={[
              'portrait',
              'portrait-upside-down',
              'landscape',
              'landscape-left',
              'landscape-right',
            ]}
            pageAnimateTime={100}
            saveToLocalByLongPress={false}
            index={0}
            renderImage={({ source, style }) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingVertical: 10,
                  }}
                >
                  <Image
                    source={{
                      uri: merchantDetails.banners
                        ? source.uri
                        : merchantDetails.map_banner,
                    }}
                    style={[
                      {
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                        marginTop: (SCREEN_HEIGHT / 100) * 22,
                      },
                      style,
                    ]} // your custom style object
                    // any supported props by Image
                  />
                </View>
              );
            }}
            renderHeader={props => {
              return (
                <View
                  style={[
                    mainStyles.row,
                    {
                      justifyContent: 'space-between',
                      top: 50,
                      left: 20,
                      position: 'absolute',
                      zIndex: 100,
                      width: '90%',
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
            imageUrls={imageViwerImages}
            loadingRender={() => (
              <ActivityIndicator size={'large'} color={colors.green} />
            )}
            renderIndicator={(currentIndex, allSize) => (
              <View style={styles.imagesIndicator}>
                <TypographyText
                  textColor={colors.white}
                  size={16}
                  font={BALOO_REGULAR}
                  title={`${currentIndex}/${allSize}`}
                />
              </View>
            )}
          />
        </Modal>
      </View>
    );
  }, [merchantDetails, isFullImage, activeTab]);

  if (loading) return <FullScreenLoader />;

  return (
    <ViewShot ref={viewRef} style={{ flex: 1 }}>
      <View
        style={{ flex: 1, backgroundColor: isDark ? colors.navyBlue : '#fff' }}
      >
        <Tabs.Container
          minHeaderHeight={100}
          headerContainerStyle={{ minHeight: 10 }}
          renderTabBar={() => null}
          renderHeader={renderHeader}
        >
          <Tabs.Tab name="a">
            <Tabs.ScrollView
              contentContainerStyle={{
                paddingBottom: 30,
                paddingHorizontal: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              <>
                {activeTab === CONSTANTS.INFO && (
                  <InfoTab merchantDetails={merchantDetails} />
                )}
                {activeTab === CONSTANTS.LOCATION && (
                  <MapTab merchantDetails={merchantDetails} />
                )}
                {activeTab === CONSTANTS.OFFERS && (
                  <OfferTab
                    merchant={merchantDetails}
                    isHotel={merchantDetails.is_business_hotel}
                  />
                )}
                {activeTab === CONSTANTS.ROOM_RATES && (
                  <RoomRatesTab
                    merchant={merchantDetails}
                    isHotel={merchantDetails.is_business_hotel}
                  />
                )}
              </>
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.Container>
      </View>
    </ViewShot>
  );
};

const mapStateToProps = state => ({
  merchantDetails: state.merchantReducer.merchantDetails,
  favoriteOffers: state.merchantReducer.favoriteOffers,
  loading: state.merchantReducer.merchantDetailsLoading,
});

export default connect(mapStateToProps, { subscribeNotification, saveOffer })(
  React.memo(Overview),
);
