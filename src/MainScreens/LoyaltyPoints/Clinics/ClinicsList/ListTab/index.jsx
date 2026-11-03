import { FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useInfiniteQuery } from "react-query";
import FullScreenLoader from "../../../../../components/Loaders/FullScreenLoader";
import { getClinicsList } from "../../../../../api/clinics";
import ListNoData from "../../../../../components/ListNoData";
import ListTabItem from "./ListTabItem";
import { useNavigation, useRoute } from "@react-navigation/native";
import {isRTL} from "../../../../../../utils";

const LIMIT = 10;

const ListTab = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const merchant_id = route?.params?.merchantId;
  const isRtl = isRTL();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["clinics-list", merchant_id],
    ({ pageParam = 1 }) =>
      getClinicsList({
        page: pageParam,
        limit: LIMIT,
        merchant_id
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < LIMIT) return undefined;
        return pages.length + 1;
      },
    }
  );


  const clinics = data?.pages?.flat() ?? [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  


  return (
    <FlatList
      data={clinics}
      renderItem={({ item }) => (
        <ListTabItem
          logo={item.image}
          name={isRtl ? item.name_ar: item.name}
          time={item.open_status}
          rating={item.rating}
          tags={item.specialties}
          address={isRtl ? item.address_ar: item.address}
          onPress={() =>
            navigation.navigate("clinics-info", {
              clinicId: item.clinic_id,
            })
          }
        />
      )}
      keyExtractor={(item) => item.clinic_id.toString()}
      style={styles.list}
      contentContainerStyle={styles.contentContainerStyle}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size="small" /> : null
      }
      ListEmptyComponent={!isLoading ? <ListNoData /> : <FullScreenLoader />}
    />
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
});

export default ListTab;