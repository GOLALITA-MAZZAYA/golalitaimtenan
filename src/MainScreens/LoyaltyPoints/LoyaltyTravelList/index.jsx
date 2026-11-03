import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "react-query";
import { FlatList, StyleSheet } from "react-native";
import { getLoyaltyTavel } from "../../../api/loyalty";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import NoData from "../../Transactions/components/NoData";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import {isRTL} from "../../../../utils";
import {useTheme} from "../../../components/ThemeProvider";
import ListCard from "../common/ListCard";

const LoyaltyTravelList = ({navigation}) => {
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
    ["loyalty-travel-list"],
    getLoyaltyTavel,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const partners = data?.pages.flatMap(page => page.data) || [];

    const handleSelectPress = useCallback((item) => {
      if(item.merchant_id){
        navigation.navigate('loyaltyPoints-travel-info',{id: item.merchant_id})
      }
    }, [navigation]);

    const renderItem = useCallback(({ item }) => {
      return (
         <ListCard
          icon={item.merchant_logo}
          title={isAr ? item.x_arabic_name: item.merchant_name}
          description={"Redeem points for shopping online"}
          onPress={() => handleSelectPress(item)}
          style={styles.listCard}
          isDark={isDark}
        />
      );
    }, [isAr, isDark, handleSelectPress]);


  return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyTravel.title')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >

    <FlatList
      showsVerticalScrollIndicator={false}
      data={!isLoading ? partners : []}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      style={styles.list}
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
        !isLoading && !isFetchingNextPage ? <NoData /> : <FullScreenLoader />
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
  list: {
    marginTop: 20
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 160
  },
  listCard: {
    marginBottom: 15
  }
});

export default LoyaltyTravelList;
