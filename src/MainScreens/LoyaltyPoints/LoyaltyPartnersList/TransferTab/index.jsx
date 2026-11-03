import {useCallback} from "react";
import {FlatList, StyleSheet} from "react-native";
import {useInfiniteQuery} from "react-query";
import {useTranslation} from "react-i18next";
import { getLoyaltyTransferPartners} from "../../../../api/loyalty";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import NoData from "../../../Transactions/components/NoData";
import {useTheme} from "../../../../components/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import ListCard from "../../common/ListCard";

const TransferTab = () => {
  const {
      data,
      isLoading,
      isError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
    } = useInfiniteQuery(
      ["loyalty-transfer-partners"],
      getLoyaltyTransferPartners,
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );
  const navigation = useNavigation();
  const {t,i18n} = useTranslation();
  const {isDark} = useTheme();
  const isAr = i18n.language === 'ar';

  
    
  const partners = data?.pages.flatMap(page => page.data) || [];

  const handleSelectPress = useCallback((item) => {
       navigation.navigate('loyaltyPoints-partners-transfer',{
          partner: item
      })
  }, [navigation]);

  const renderItem = useCallback(({ item }) => {
    return (
      <ListCard
        icon={item.merchant_logo}
        title={isAr ? item.x_arabic_name: item.merchant_name}
        description={t('LoyaltyPartners.transferListCardInfo')}
        onPress={() => handleSelectPress(item)}
        style={styles.listCard}
        isDark={isDark}
      />
    )
  }, [isAr, isDark, t, handleSelectPress]);
    
    return (
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
        !isLoading ? <NoData /> : <FullScreenLoader />
      }
    />
    )
};

const styles = StyleSheet.create({
   list: {
    marginTop: 20
   },
   contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 160
   },
   listCard: {
    marginTop: 15
   },
   title: {
    fontWeight: '500'
   }
});

export default TransferTab