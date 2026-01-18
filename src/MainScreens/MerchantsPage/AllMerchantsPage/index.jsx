import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { colors } from '../../../components/colors';
import { mainStyles, SCREEN_HEIGHT } from '../../../styles/mainStyles';
import { connect } from 'react-redux';
import {
  getMerchantList,
  toggleFavourites,
} from '../../../redux/merchant/merchant-thunks';
import { useTranslation } from 'react-i18next';
import { setMerchants } from '../../../redux/merchant/merchant-actions';
import MainLayout from '../../../components/MainLayout';
import { useTheme } from '../../../components/ThemeProvider';
import Header from '../../../components/Header';
import { getFavouriteMerchantsList } from '../../../redux/favouriteMerchants/favourite-merchants-thunks';
import { navigationRef } from '../../../Navigation/RootNavigation';
import MerchantsList from '../components/MerchantList';
import ListNoData from '../../../components/ListNoData';
import {getUserLocationThunk} from '../../../redux/global/global-thunks';

const MerchantsPage = ({ route,
  merchants,
  isMerchantsLoading,
  getMerchantList,
  favoriteOffers,
  favouriteMerchants,
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk 
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const listRef = useRef(null);
  const canGetMoreDataRef = useRef(true);
  let params = route?.params;

  const parentCategoryName = params?.parentCategoryName;
  const filters = params?.filters;


  const title = parentCategoryName
    ? parentCategoryName
    : t('Drawer.allMerchants');


    const handleFavouritePress = (merchant) => {
    toggleFavourites(merchant.merchant_id);
  };

    useEffect(() => {
      if (!favouriteMerchants.length) {
        getFavouriteMerchantsList();
      }
      getUserLocationThunk();
    }, []);
  
    useEffect(() => {
      canGetMoreDataRef.current = true;
  
      getMerchantList({
        page: 1,
        filters: filters,
        onGetData: (dataLength, limit) => {
          if (dataLength !== limit) {
            canGetMoreDataRef.current = false;
          }
        },
      });
    }, [filters]);
  
    const data = useMemo(() => {
      return merchants?.filter((merchant) => merchant.x_moi_show);
    }, [merchants?.length]);
  
    const fetchMoreData = () => {
      if (isMerchantsLoading || !canGetMoreDataRef.current) {
        return;
      }
  
      getMerchantList({
        page: "next",
        filters: { ...filters },
        onGetData: (dataLength, limit) => {
          if (dataLength !== limit) {
            canGetMoreDataRef.current = false;
          }
        },
      });
    };

  const renderItem = useCallback(
    ({ item: merchant }) => {
      const isFavorite = favouriteMerchants.some(
        (o) => o.merchant_id === merchant.merchant_id
      );
      return (
        <View>
          <MerchantsList
            merchant={merchant}
            onPressFavourite={() => handleFavouritePress(merchant)}
            isFavorite={isFavorite}
          />
        </View>
      );
    },
    [favoriteOffers, favouriteMerchants]
  );

  const keyExtractor = (_, index) => `${index}`;


  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <>
          <Header
            label={title}
            style={styles.header}
            isHome={true}
            btns={['back','filter']}
            additionalBtnsProps={{
              back: {
                onPress: () => {
                  if (!parentCategoryName) {
                    navigationRef.current.navigate('Main');
                    return;
                  }

                  navigationRef.current.goBack();
                },
              },
              filter: {
                params: {
                  filters: params?.filters || {},
                },
              },
            }}
          />
        </>
      }
      headerHeight={50}
      contentStyle={styles.contentStyle}
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white,   }}
    >
      <FlatList
      ref={listRef}
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
      data={data}
      windowSize={SCREEN_HEIGHT}
      maxToRenderPerBatch={5}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={0.4}
      onEndReached={fetchMoreData}
      ListFooterComponent={() =>
        isMerchantsLoading && (
          <View style={[mainStyles.centeredRow, styles.loaderWrapper]}>
            <ActivityIndicator
              size={"large"}
              color={isDark ? colors.mainDarkMode : colors.darkBlue}
            />
          </View>
        )
      }
      ListEmptyComponent={
        !isMerchantsLoading && <ListNoData text={t("Merchants.listNoData")} />
      }
      renderItem={renderItem}
    />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  loaderWrapper: {
    marginVertical: 30,
  },
  categoryWrapper: {
    marginTop: 16,
  },
  category: {
    marginTop: 20,
    marginBottom: 10,
  },
  contentContainerStyle: {
    paddingBottom: 60,
    flexGrow: 1,
  },
  categoryTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    loaderWrapper: {
    marginVertical: 30,
  },
  categoryWrapper: {
    marginTop: 16,
  },
  category: {
    marginTop: 20,
    marginBottom: 10,
  },
  contentStyle: {
    height: SCREEN_HEIGHT - 120,
    paddingHorizontal: 20
  },
  contentContainerStyle: {
    paddingBottom: 60,
    flexGrow: 1,
  },
  categoryTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  merchants: state.merchantReducer.merchants,
  isMerchantsLoading: state.loadersReducer.isMerchantsLoading,
  organizations: state.merchantReducer.organizations,
  favoriteOffers: state.merchantReducer.favoriteOffers,
  favouriteMerchants: state.favouriteMerchantsReducer.favouriteMerchants,
});

export default connect(mapStateToProps, {
  getMerchantList,
  setMerchants,
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk
})(MerchantsPage);
