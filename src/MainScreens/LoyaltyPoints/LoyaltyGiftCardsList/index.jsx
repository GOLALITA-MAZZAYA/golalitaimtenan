import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import MainLayout from '../../../components/MainLayout';
import { SCREEN_HEIGHT } from '../../../styles/mainStyles';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
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
import CateogiresSelect from './CategoriesSelect';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import SearchInput from '../../../components/Form/SearchInput';

const DEFAULT_COUNTRY = 'QA';
const SEARCH_DELAY_MS = 400;

const LoyaltyGiftCardsList = ({
  giftCards,
  getGiftCards,
  giftCardsLoading,
  navigation,
}) => {
  const { i18n, t } = useTranslation();
  const { isDark } = useTheme();

  const [selectedCountry, setSelectedCountry] = useState(undefined);
  const [categoryId, setCategoryId] =
    useState(undefined);
  // The mandatory first pick is only ever pending once. Clearing the
  // filters later sets selectedCountry back to undefined too, but that
  // must still fetch the unfiltered list rather than being mistaken for
  // "the gate hasn't been satisfied yet".
  const [hasAppliedFiltersOnce, setHasAppliedFiltersOnce] = useState(false);
  const [searchText, setSearchText] = useState('');
  // Waits until the user stops typing before calling the API.
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const title = t('LoyaltyGiftCards.title');


  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchText.trim()),
      SEARCH_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (!hasAppliedFiltersOnce) {
      return;
    }

    getGiftCards(categoryId, selectedCountry, debouncedSearch);

  }, [selectedCountry, categoryId, hasAppliedFiltersOnce, debouncedSearch]);


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
          tagline={item.tagline}
          brandCode={item.brand_code}
          imageUrl={item.product_image}
          isDark={isDark}
          key={item.id}
          onPress={() => handleGiftCardPress(item)}
        />
      );
    },
    [i18n.language, isDark, selectedCountry, categoryId],
  );


  const handleFiltersSubmit = ({ categoryId, country }) => {
    // The very first pick is mandatory -- dismissing or clearing without
    // choosing a country still falls back to a default. Once that gate is
    // satisfied, clearing is allowed to go all the way back to "no country
    // filter".
    const nextCountry = hasAppliedFiltersOnce ? country : (country || DEFAULT_COUNTRY);

    setCategoryId(categoryId);
    setSelectedCountry(nextCountry);
    setHasAppliedFiltersOnce(true);
  };

  const handleFiltersDismiss = () => {
    if (!hasAppliedFiltersOnce) {
      handleFiltersSubmit({ categoryId: undefined, country: undefined });
    }
  };


  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header
          label={title}
          style={styles.header}
          btns={['back']}
          rightChildren={
            <CateogiresSelect
              onSubmit={handleFiltersSubmit}
              autoOpen={!hasAppliedFiltersOnce}
              onDismiss={handleFiltersDismiss}
              defaultCountry={selectedCountry}
            />
          }
        />
      }
      headerHeight={50}
      contentStyle={{
        height: SCREEN_HEIGHT - 80,
      }}
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <View style={styles.listWrapper}>
        <SearchInput
          wrapperStyle={styles.search}
          value={searchText}
          onChangeText={setSearchText}
          onClearPress={() => setSearchText('')}
          placeholder={t('LoyaltyGiftCards.searchPlaceholder')}
          autoCorrect={false}
          returnKeyType="search"
        />
        <FlatList
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          data={giftCardsLoading ? [] : giftCards}
          keyExtractor={(item) => String(item.id)}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.loaderWrapper}>
              {!hasAppliedFiltersOnce ? null : !giftCardsLoading ? (
                <TypographyText
                  title={t('Vouchers.noCards')}
                  textColor={isDark ? colors.white : colors.darkBlue}
                  size={18}
                  font={BALOO_MEDIUM}
                />
              ) : (
                <FullScreenLoader />
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
    flex: 1
  },
  search: {
    marginTop: 12,
    marginHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 120,
    marginTop: 12,
    flexGrow: 1,
    paddingHorizontal: 20
  },
  loaderWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  bottomView: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  filtersWrapper: {
    width: '100%',
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
