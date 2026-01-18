import {FlatList, StyleSheet} from "react-native";
import {useInfiniteQuery} from "react-query";
import {useTranslation} from "react-i18next";
import {getLoyaltyPartners} from "../../../../api/loyalty";
import PartnerListCard from "../../common/PartnerListCard";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import NoData from "../../../Transactions/components/NoData";
import {useTheme} from "../../../../components/ThemeProvider";
import {useNavigation} from "@react-navigation/native";

const ListTab = () => {
  const {
      data,
      isLoading,
      isError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage
    } = useInfiniteQuery(
      ["loyalty-partners-list1"],
      getLoyaltyPartners,
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );
  const navigation = useNavigation();
  const {t,i18n} = useTranslation();
  const {isDark} = useTheme();
  const isAr = i18n.language === 'ar';

  
    
  const partners = data?.pages.flatMap(page => page.data) || [];

  const handleBookNowPress = (item) => {


       navigation.navigate('loyaltyPoints-partners-info',{
          partnerName: isAr ? item.x_arabic_name: item.merchant_name,
          partnerLogo: item.map_banner,
          website: item.website,
          howToRedeem: isAr ? item.x_use_term_ar: item.x_use_term_en
      })
  }
    
    return (
          <FlatList
      data={!isLoading ? partners : []}
      renderItem={({ item, index }) => {
        return (
          <PartnerListCard howToUse={isAr ? item.x_use_term_ar: item.x_use_term_en} uri={item.merchant_logo} title={isAr ? item.x_arabic_name: item.merchant_name} isDark={isDark} submitText={t('LoyaltyPartners.bookNow')} onPress={() => handleBookNowPress(item)}/>
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

export default ListTab