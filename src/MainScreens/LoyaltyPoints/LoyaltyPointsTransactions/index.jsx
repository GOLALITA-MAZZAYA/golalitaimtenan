import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "react-query";
import { FlatList, StyleSheet } from "react-native";
import HistoryCard from "../common/HistoryCard";
import { formatDate } from "../helpers";
import NoData from "../../Transactions/components/NoData";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { getLoyaltyTransactionHistory } from "../../../api/loyalty";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";

const LoyaltyPointsTransactions = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    ["loyalty-points-history1"],
    getLoyaltyTransactionHistory,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const transactions = data?.pages.flatMap(page => page.data) || [];

  return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyMain.transactions')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
    <FlatList
      data={!isLoading ? transactions : []}
      renderItem={({ item, index }) => {
        const title = item.note;
        const value = item.points;

        return (
          <HistoryCard
            title={title}
            description={formatDate(item.date, lang)}
            value={value}
            index={index}
          />
        );
      }}
      keyExtractor={(item, index) => index.toString()}
      style={styles.list}
      contentContainerStyle={styles.contentContainerStyle}
      
      // Pagination - load more when end reached
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
  list: {
    marginTop: 20
  },
  contentContainerStyle: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: 160
  }
});

export default LoyaltyPointsTransactions;
