import React, {
  useCallback,
  useEffect,
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
  getGiftCards,
} from '../../../redux/giftCards/giftcards-thunks';
import { StyleSheet } from 'react-native';
import { BALOO_MEDIUM } from '../../../redux/types';
import { TypographyText } from '../../../components/Typography';
import GiftCard from './GiftCard';
import CountrySelect from '../LoyaltyGiftCardsFilters/CountrySelect';
import { useFocusEffect } from '@react-navigation/native';
import store from '../../../redux/store';
import { checkCardmolaPaymentById } from '../../../api/giftCard';
import { showMessage } from 'react-native-flash-message';
import { setPaymentDataGlobal } from '../../../redux/giftCards/giftcards-actions';
import UGotGiftCategorySelect from '../LoyaltyGiftCardsFilters/UGotGiftCategorySelect';
import MP4Slider from '../../../components/MP4Slider';

const DEFAULT_COUNTRY = 'QA';
const BANNERS = [require('../../../assets/loyaltyPoints/giftCards/giftcard.mp4'),];

const LoyaltyGiftCardsList = ({
  giftCards,
  getGiftCards,
  giftCardsLoading,
  navigation,
}) => {
  const { i18n, t } = useTranslation();
  const { isDark } = useTheme();

  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [selectedUGotGiftCategory, setSelectedUGotGiftCategory] =
    useState(undefined);
  const dispatch = useDispatch();

  const title = t('LoyaltyGiftCards.title');

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
  
      getGiftCards(selectedUGotGiftCategory, selectedCountry);
    
  }, [selectedCountry]);


  const handleGiftCardPress = giftCard => {

    navigation.navigate('loyaltyPoints-giftCards-info', {
      giftCard,
      filtersData: {
        country_code: selectedCountry,
        category_id: undefined,
      },
    });
  };


  const renderGifts = useCallback(
    ({ item, index }) => {
      return (
        <GiftCard
          index={index}
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


  const handleCounntryPress = country => {
    setSelectedCountry(country || DEFAULT_COUNTRY);
  };

  const handleUGotGiftCategoryPress = i => {
    setSelectedUGotGiftCategory(i || undefined);
  };
  

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={<Header label={title} style={styles.header} btns={['back']}/>}
      headerHeight={50}
      contentStyle={{
        height: SCREEN_HEIGHT - 80,
      }}
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
       
         <MP4Slider
            data={BANNERS}
            style={styles.banners}
          />

        <View  style={styles.listWrapper}>
          <View
            style={{
              flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row',
              ...styles.filtersWrapper
            }}
          >
            <TypographyText
              title={t('Vouchers.filterby')}
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              size={16}
              font={BALOO_MEDIUM}
            />
            <View
              style={styles.filters}
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
            style={styles.list}
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


    </MainLayout>
  );
};

const styles = StyleSheet.create({
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
    bottom: 0,
    width: '100%',
  },
  filtersWrapper: {
     width: '90%',
     alignItems: 'center',
     justifyContent: 'space-between',
     alignSelf: 'center',
  },
  filters: {
                  flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
  },
  list: {
     marginTop: 20
  },
  banners: {
    alignSelf: 'center'
  }
});

const mapStateToProps = state => ({
  giftCards: state.giftcardsReducer.giftCards,
  giftCardsLoading: state.giftcardsReducer.loading,
});

export default connect(mapStateToProps, {
  getGiftCards,
})(LoyaltyGiftCardsList);
