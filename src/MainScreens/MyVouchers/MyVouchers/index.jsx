import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import MainLayout from '../../../components/MainLayout';
import { SCREEN_HEIGHT } from '../../../styles/mainStyles';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import Header from '../../../components/Header';
import {
  getVouchers,
  saveVoucher,
} from '../../../redux/voucher/voucher-thunks';
import {
  getCardmolaGiftCards,
  getGiftCards,
} from '../../../redux/giftCards/giftcards-thunks';
import PagerView from 'react-native-pager-view';
import { StyleSheet } from 'react-native';
import { BALOO_MEDIUM } from '../../../redux/types';
import { TypographyText } from '../../../components/Typography';
import GiftCard from '../components/GiftCard';
import CountrySelect from '../GiftCardFilters/components/CountrySelect';
import { useFocusEffect } from '@react-navigation/native';
import TwoButtons from '../../../components/TwoButtons/TwoButtons';
import CardmolaCountryPicker from '../GiftCardFilters/components/CardmolaCountryPicker';
import store from '../../../redux/store';
import { checkCardmolaPaymentById } from '../../../api/giftCard';
import { showMessage } from 'react-native-flash-message';
import { setPaymentDataGlobal } from '../../../redux/giftCards/giftcards-actions';
import UGotGiftCategorySelect from '../GiftCardFilters/components/UGotGiftCategorySelect';
import CardmolaCategoryPicker from '../GiftCardFilters/components/CardmolaCategoryPicker';

const DEFAULT_COUNTRY = 'QA';

const MyVouchers = ({
  vouchers,
  vouchersLoading,
  giftCards,
  getGiftCards,
  getCardmolaGiftCards,
  cardmolaGiftCards,
  cardmolaLoading,
  getVouchers,
  giftCardsLoading,
  navigation,
  route,
}) => {
  const propsSelectedPage = route?.params?.selectedPage || '0';

  const { i18n, t } = useTranslation();
  const { isDark } = useTheme();
  const [selectedPage, setSelectedPage] = useState('0');
  const pagerViewRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [selectedCardmolaCountry, setSelectedCardmolaCountry] =
    useState(undefined);
  const [selectedCardmolaCategory, setSelectedCardmolaCategory] =
    useState(undefined);
  const [selectedUGotGiftCategory, setSelectedUGotGiftCategory] =
    useState(undefined);
  const dispatch = useDispatch();

  const title = t('Drawer.vouchersAndGiftCards');

  const handlePageSelect = e => {
    setSelectedPage(e.nativeEvent.position.toString());
  };

  useFocusEffect(
    React.useCallback(() => {
      if (propsSelectedPage !== selectedPage && !selectedPage) {
        setSelectedPage(propsSelectedPage);
      }
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const { paymentDataGlobal } = store.getState().giftcardsReducer;

      async function checkPaymentStatus() {
        if (paymentDataGlobal) {
          try {
            const data = await checkCardmolaPaymentById(
              paymentDataGlobal.reference_id,
            );

            if (data.payment_status === 'Paid') {
              showMessage({
                message: t('Vouchers.giftCardPaymentSuccess'),
                type: 'success',
              });
            } else {
              showMessage({
                message: t('Vouchers.giftCardPaymentFailure'),
                type: 'danger',
              });
            }

            dispatch(setPaymentDataGlobal(null));
          } catch (err) {
            console.log(err.message, 'dsadaerr');
          }
        }
      }

      checkPaymentStatus();
    }, []),
  );

  useEffect(() => {
    if (selectedPage === '0') {
      getVouchers();
    }
  }, [selectedPage]);

  useEffect(() => {
    if (selectedPage === '1') {
      getGiftCards(selectedUGotGiftCategory, selectedCountry);
    }
  }, [selectedPage, selectedUGotGiftCategory, selectedCountry]);

  useEffect(() => {
    if (selectedPage === '2') {
      getCardmolaGiftCards(selectedCardmolaCountry);
    }
  }, [selectedPage, selectedCardmolaCountry]);

  const handleVoucherPress = voucher => {
    navigation.navigate('myVouchers-voucher', {
      voucher,
    });
  };

  const handleGiftCardPress = giftCard => {
    navigation.setParams({ selectedPage: undefined });
    navigation.navigate('myVouchers-giftCard', {
      giftCard,
      filtersData: {
        country_code: selectedCountry,
        category_id: undefined,
      },
    });
  };

  const handleCardmolaGiftCardPress = (id, encodedId) => {
    navigation.setParams({ selectedPage: undefined });
    navigation.navigate('myVouchers-cardmolaGiftCard', { id, encodedId });
  };

  const updatedCardmolaGiftCards = useMemo(() => {
    // If selectedCardmolaCategory is undefined, return the full list
    if (!selectedCardmolaCategory) {
      return cardmolaGiftCards;
    }

    // Otherwise, filter based on selectedCardmolaCategory
    return cardmolaGiftCards?.filter(item => {
      return selectedCardmolaCategory.includes(String(item?.id));
    });
  }, [cardmolaGiftCards, selectedCardmolaCategory, selectedCardmolaCountry]);

  const renderVouchers = useCallback(
    ({ item }) => {
      return (
        <GiftCard
          name={
            i18n.language === 'ar' && item.name_arabic != false
              ? item.name_arabic
              : item.name
          }
          imageUrl={
            item.logo ? `data:image/png;base64,${item.logo}` : undefined
          }
          isDark={isDark}
          key={item.id}
          onPress={() => handleVoucherPress(item)}
        />
      );
    },
    [i18n.language, isDark],
  );

  const renderGifts = useCallback(
    ({ item }) => {
      return (
        <GiftCard
          name={item.name}
          imageUrl={item.product_image}
          isDark={isDark}
          key={item.id}
          onPress={() => handleGiftCardPress(item)}
        />
      );
    },
    [i18n.language, isDark, selectedCountry, selectedUGotGiftCategory],
  );

  const renderCardmolaGifts = useCallback(
    ({ item }) => {
      return (
        <GiftCard
          name={item.name}
          imageUrl={item?.media?.photo}
          isDark={isDark}
          key={item.id}
          onPress={() => {
            console.log(item, 'item');
            handleCardmolaGiftCardPress(item.id, item.encodedId);
          }}
        />
      );
    },
    [i18n.language, isDark, selectedCardmolaCategory, selectedCardmolaCountry],
  );

  const HEADER_ITEMS = [
    {
      name: t('Vouchers.vouchers'),
      key: '0',
    },
    {
      name: t('Vouchers.giftCards'),
      key: '1',
    },
 //   {
     // name: t('Vouchers.cardmolaGiftCards'),
     // key: '2',
   // },
  ];

  const handleCounntryPress = country => {
    setSelectedCountry(country || DEFAULT_COUNTRY);
  };

  const handleCardmolaCountryPress = country => {
    setSelectedCardmolaCountry(country);
  };

  const handleCardmolaCategoryPress = i => {
    setSelectedCardmolaCategory(i);
  };

  const handleUGotGiftCategoryPress = i => {
    setSelectedUGotGiftCategory(i || undefined);
  };

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={<Header label={title} style={styles.header} />}
      headerHeight={50}
      contentStyle={{
        height: SCREEN_HEIGHT - 80,
      }}
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <TwoButtons
        isLight={!isDark}
        selectedButton={+selectedPage}
        onPress1={() => {
          pagerViewRef.current.setPage(+HEADER_ITEMS[0].key);
        }}
        onPress2={() => {
          pagerViewRef.current.setPage(+HEADER_ITEMS[1].key);
        }}
        onPress3={() => {
          pagerViewRef.current.setPage(+HEADER_ITEMS[2].key);
        }}
        label1={HEADER_ITEMS[0].name}
        label2={HEADER_ITEMS[1].name}
       // label3={HEADER_ITEMS[2].name}
      />

      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={+selectedPage}
        onPageSelected={handlePageSelect}
      >
        <View key="0" style={styles.listWrapper}>
          <FlatList
            contentContainerStyle={[
              styles.listContainer,
              styles.giftsContainer,
            ]}
            showsVerticalScrollIndicator={false}
            data={vouchers}
            maxToRenderPerBatch={5}
            ListEmptyComponent={
              <View style={styles.loaderWrapper}>
                {!vouchersLoading ? (
                  <TypographyText
                    title={t('Vouchers.noVouchers')}
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={18}
                    font={BALOO_MEDIUM}
                  />
                ) : (
                  <ActivityIndicator
                    size={'large'}
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                )}
              </View>
            }
            renderItem={renderVouchers}
          />
        </View>
        <View key="1" style={styles.listWrapper}>
          <View
            style={{
              flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row',
              width: '90%',
              alignItems: 'center',
              justifyContent: 'space-between',
              alignSelf: 'center',
              // backgroundColor: "red",
            }}
          >
            <TypographyText
              title={t('Vouchers.filterby')}
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              size={16}
              font={BALOO_MEDIUM}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
                // backgroundColor: "red",
              }}
            >
              <CountrySelect onChange={handleCounntryPress} />
              <UGotGiftCategorySelect onChange={handleUGotGiftCategoryPress} />
            </View>
          </View>

          <FlatList
            contentContainerStyle={[
              styles.listContainer,
              styles.giftsContainer,
            ]}
            showsVerticalScrollIndicator={false}
            data={giftCardsLoading ? [] : giftCards}
            maxToRenderPerBatch={5}
            ListEmptyComponent={
              <View style={styles.loaderWrapper}>
                {!giftCardsLoading ? (
                  <TypographyText
                    title={t('Vouchers.noCards')}
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={18}
                    font={BALOO_MEDIUM}
                  />
                ) : (
                  <ActivityIndicator
                    size={'large'}
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                )}
              </View>
            }
            renderItem={renderGifts}
          />
        </View>
        <View key="2" style={styles.listWrapper}>
          <View
            style={{
              flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row',
              width: '90%',
              alignItems: 'center',
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}
          >
            <TypographyText
              title={t('Vouchers.filterby')}
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              size={16}
              font={BALOO_MEDIUM}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
                // backgroundColor: "red",
              }}
            >
              <CardmolaCountryPicker onChange={handleCardmolaCountryPress} />
              <CardmolaCategoryPicker onChange={handleCardmolaCategoryPress} />
            </View>
          </View>

          <FlatList
            contentContainerStyle={[
              styles.listContainer,
              styles.giftsContainer,
            ]}
            showsVerticalScrollIndicator={false}
            data={cardmolaLoading ? [] : updatedCardmolaGiftCards}
            maxToRenderPerBatch={5}
            ListEmptyComponent={
              <View style={styles.loaderWrapper}>
                {!cardmolaLoading ? (
                  <TypographyText
                    title={t('Vouchers.noCards')}
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={18}
                    font={BALOO_MEDIUM}
                  />
                ) : (
                  <ActivityIndicator
                    size={'large'}
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                )}
              </View>
            }
            renderItem={renderCardmolaGifts}
          />
        </View>
      </PagerView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  pageViewHeader: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  pageViewHeaderItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
  },
  pageViewHeaderActiveItem: {
    borderBottomWidth: 2,
  },
  pagerView: {
    flex: 1,
  },
  listWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 60,
    marginTop: 12,
    flexGrow: 1,
  },
  loaderWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftsContainer: {
    paddingHorizontal: 20,
  },
  bottomView: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    bottom: 0, //,zIndex:2000
    width: '100%',
  },
});

const mapStateToProps = state => ({
  vouchers: state.voucherReducer.vouchers,
  vouchersLoading: state.voucherReducer.loading,
  giftCards: state.giftcardsReducer.giftCards,
  giftCardsLoading: state.giftcardsReducer.loading,
  cardmolaGiftCards: state.giftcardsReducer.cardmolaGiftCards,
  cardmolaLoading: state.giftcardsReducer.cardmolaLoading,
});

export default connect(mapStateToProps, {
  getVouchers,
  getGiftCards,
  saveVoucher,
  getCardmolaGiftCards,
})(MyVouchers);
