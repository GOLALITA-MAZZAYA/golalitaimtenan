import { FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useInfiniteQuery } from "react-query";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import ListNoData from "../../../../components/ListNoData";
import ListItem from "./ListItem";
import { useNavigation } from "@react-navigation/native";
import MainLayout from "../../../../components/MainLayout";
import Header from "../../../../components/Header";
import {SCREEN_HEIGHT} from "../../../../styles/mainStyles";
import {useTranslation} from "react-i18next";
import {getRestaurantsList} from "../../../../api/restaurants";
import {isRTL} from "../../../../../utils";
import {useEffect} from "react";
import {clearRestaurantStore} from "../../../../redux/restaurant/restaurant-actions";
import {useDispatch} from "react-redux";

const LIMIT = 10;

const RestaurantsList = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const isRtl = isRTL();
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["restaurants-lists"],
    ({ pageParam = 1 }) =>
      getRestaurantsList({
        page: pageParam,
        limit: LIMIT,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < LIMIT) return undefined;
        return pages.length + 1;
      },
    }
  );

  const restaurantsData = data?.pages?.flat() ?? [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
   dispatch(clearRestaurantStore())
  },[])


  return (
   <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('Restaurants.title')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
    <FlatList
      data={restaurantsData}
      renderItem={({ item }) => (
        <ListItem
          logo={item.banner_url || ''}
          name={isRtl ? item.name_ar: item.name}
          description={isRtl ? item.short_description_ar: item.short_description}
          onPress={() => navigation.navigate('restaurant-info',{restaurantId: item?.restaurant_id})}
        />
      )}
      keyExtractor={(item) => item?.id?.toString()}
      style={styles.list}
      contentContainerStyle={styles.contentContainerStyle}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size="small" /> : null
      }
      ListEmptyComponent={!isLoading ? <ListNoData /> : <FullScreenLoader />}
    />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: 20,
  },
  contentContainerStyle: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: 160,
  },
  contentStyle: {
    height: SCREEN_HEIGHT,
    flexGrow: 1,
    paddingHorizontal: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0 ,      
   },
});

export default RestaurantsList;