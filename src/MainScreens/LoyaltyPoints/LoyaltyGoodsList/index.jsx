import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "react-query";
import { FlatList, StyleSheet } from "react-native";
import { getLoyaltyGoods } from "../../../api/loyalty";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import NoData from "../../Transactions/components/NoData";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import {isRTL} from "../../../../utils";
import {useTheme} from "../../../components/ThemeProvider";
import ListCard from "../common/ListCard";


const LoyaltyGoodsList = ({navigation}) => {
  const { t } = useTranslation();
  const {isDark} = useTheme();
  const isAr = isRTL();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    ["loyalty-goods-list"],
    getLoyaltyGoods,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const partners = data?.pages.flatMap(page => page.data) || [];

    const navigateToGoodInfoScreen = useCallback((item) => {
       navigation.navigate('loyaltyPoints-goods-info',{id: item.merchant_id})
  }, [navigation]);

    const renderItem = useCallback(({ item }) => {
      return (
        <ListCard
          icon={item.merchant_logo}
          title={isAr ? item.x_arabic_name: item.merchant_name}
          description={"Redeem points for shopping online"}
          onPress={() => navigateToGoodInfoScreen(item)}
          style={styles.listCard}
          isDark={isDark}
        />
      );
    }, [isAr, isDark, navigateToGoodInfoScreen]);

  return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyMain.shop')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >

    <FlatList
      data={!isLoading ? partners : []}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.contentContainerStyle}
      
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.3}
      
      ListFooterComponent={
        isFetchingNextPage ? <FullScreenLoader /> : null
      }
      
      ListEmptyComponent={
        !isLoading ? <NoData /> : <FullScreenLoader />
      }
    />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 160
  },
  listCard: {
    marginTop: 15
  }
});

export default LoyaltyGoodsList;
