import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "react-query";
import { FlatList, Linking, StyleSheet } from "react-native";
import { getLoyaltyTavel } from "../../../api/loyalty";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import NoData from "../../Transactions/components/NoData";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import {isRTL} from "../../../../utils";
import {useTheme} from "../../../components/ThemeProvider";
import PartnerListCard from "../common/PartnerListCard";
import MP4Slider from "../../../components/MP4Slider";

const BANNERS = [require('../../../assets/loyaltyPoints/travel/travel.mp4')];

const LoyaltyTravelList = () => {
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

    const handleSelectPress = (item) => {
       Linking.openURL(item.website);
    }


  return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyTravel.title')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
      <MP4Slider
         data={BANNERS}
      />
    <FlatList
      data={!isLoading ? partners : []}
      renderItem={({ item, index }) => {
        return (
          <PartnerListCard howToUse={isAr ? item.x_use_term_ar: item.x_use_term_en} uri={item.merchant_logo} title={isAr ? item.x_arabic_name: item.merchant_name} isDark={isDark} submitText={t('LoyaltyTravel.select')} onPress={() => handleSelectPress(item)}/>
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
  }
});

export default LoyaltyTravelList;
