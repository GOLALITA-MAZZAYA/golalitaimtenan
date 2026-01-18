import {FlatList, StyleSheet} from "react-native";
import {useInfiniteQuery} from "react-query";
import {useTranslation} from "react-i18next";
import { getLoyaltyTransferPartners} from "../../../../api/loyalty";
import PartnerListCard from "../../common/PartnerListCard";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import NoData from "../../../Transactions/components/NoData";
import {useTheme} from "../../../../components/ThemeProvider";
import {useNavigation} from "@react-navigation/native";

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

  const handleSelectPress = (item) => {
       navigation.navigate('loyaltyPoints-partners-transfer',{
          partner: item
      })
  }
    
    return (
          <FlatList
      data={!isLoading ? partners : []}
      renderItem={({ item, index }) => {
        return (
          <PartnerListCard howToUse={isAr ? item.x_use_term_ar: item.x_use_term_en} uri={item.merchant_logo} title={isAr ? item.x_arabic_name: item.merchant_name} isDark={isDark} submitText={t('LoyaltyPartners.select')} onPress={() => handleSelectPress(item)}/>
        );
      }}
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
   }
});

export default TransferTab