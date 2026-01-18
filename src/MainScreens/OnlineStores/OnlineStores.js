import React, { useCallback, useEffect, useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import MainScreenTop from "../MainScreen/MainScreenTop";
import { mainStyles, SCREEN_HEIGHT } from "../../styles/mainStyles";
import { ActivityIndicator, FlatList, View } from "react-native";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/ThemeProvider";
import { colors } from "../../components/colors";
import {
  getFavoriteOffers,
  getMerchantList,
  getOffers,
} from "../../redux/merchant/merchant-thunks";
import { removeDuplicatesWithSameId } from "./helpres";
import MerchantsList from "../MerchantsPage/components/MerchantList";

const OnlineStores = ({
  route,
  user,
  merchants,
  offers,
  favoriteOffers,
  isMerchantsLoading,
  getOffers,
  getFavoriteOffers,
  getMerchantList,
  isOffersLoading,
}) => {
  const params = route?.params;
  const { i18n, t } = useTranslation();
  const { isDark } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const canGetMoreDataRef = useRef(true);

  const fetchMoreData = () => {
    if (
      (isMerchantsLoading || isOffersLoading,
      params?.isMyVouchers || !canGetMoreDataRef.current)
    ) {
      return;
    }

    if (params?.isB1G1) {
      getOffers({
        merchant_id: null,
        merchant_category_id: null,
        page: "next",
        params: { x_offer_type: "b1g1" },
        onGetData: (dataLength, limit) => {
          if (dataLength !== limit) {
            canGetMoreDataRef.current = false;
          }
        },
      });
    } else {
      getMerchantList({
        page: "next",
        category: null,
        filters: { x_online_store: true },
        onGetData: (dataLength, limit) => {
          if (dataLength !== limit) {
            canGetMoreDataRef.current = false;
          }
        },
      });
    }
  };

  useEffect(() => {
    if (params?.isB1G1)
      getOffers({
        merchant_id: null,
        merchant_category_id: null,
        page: 1,
        params: { x_offer_type: "b1g1" },
        onGetData: (dataLength, limit) => {
          if (dataLength !== limit) {
            canGetMoreDataRef.current = false;
          }
        },
      });
    else if (params?.isMyVouchers) {
      getFavoriteOffers(false, null, true);
    } else {
      canGetMoreDataRef.current = true;

      getMerchantList({
        page: 1,
        filters: { x_online_store: true },
        onGetData: (dataLength, limit) => {
          if (dataLength !== limit) {
            canGetMoreDataRef.current = false;
          }
        },
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 3000);
  }, []);

  const keyExtractor = useCallback(
    (item) => `${item.id ?? item.merchant_id}`,
    []
  );

  const renderCompanyItem = useCallback(
    ({ item: merchant }) => (
      <MerchantsList merchant={merchant} isB1G1={params.isB1G1} />
    ),
    [user, i18n.language, favoriteOffers, isLoaded]
  );

  let listData = [];

  if (params?.isMyVouchers) {
    listData = favoriteOffers;
  } else if (params?.isB1G1) {
    listData = removeDuplicatesWithSameId(offers);
  } else {
    listData = merchants.filter((m) => m.x_online_store);
  }

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={<MainScreenTop />}
      headerHeight={50}
      contentStyle={{
        height: SCREEN_HEIGHT - 120,
        paddingHorizontal: 20,
      }}
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <FlatList
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        data={listData}
        windowSize={SCREEN_HEIGHT}
        maxToRenderPerBatch={5}
        onEndReachedThreshold={0.4}
        onEndReached={fetchMoreData}
        ListFooterComponent={() =>
          isMerchantsLoading ? (
            <View style={[mainStyles.centeredRow, { marginVertical: 30 }]}>
              <ActivityIndicator size={"large"} color={colors.green} />
            </View>
          ) : null
        }
        renderItem={renderCompanyItem}
        keyExtractor={keyExtractor}
      />
    </MainLayout>
  );
};

const mapStateToProps = (state) => ({
  merchants: state.merchantReducer.merchants,
  user: state.authReducer.user,
  isMerchantsLoading: state.loadersReducer.isMerchantsLoading,
  offers: state.merchantReducer.offers,
  isOffersLoading: state.loadersReducer.isOffersLoading,
  favoriteOffers: state.merchantReducer.favoriteOffers,
});

export default connect(mapStateToProps, {
  getOffers,
  getFavoriteOffers,
  getMerchantList,
})(OnlineStores);
