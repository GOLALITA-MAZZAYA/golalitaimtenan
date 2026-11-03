import { FlatList, StyleSheet } from "react-native";
import { useQuery } from "react-query";
import { getLoyaltyVouchersHistory } from "../../../../api/loyalty";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import VoucherHistoryCard from "./VoucherHistoryCard";

const HistoryTab = () => {
  const { isLoading, data } = useQuery(
    ["vouchers-history"],
    getLoyaltyVouchersHistory
  );

  return (
    <FlatList
      data={!isLoading ? data : []}
      keyExtractor={(item, index) => item.code || String(index)}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      renderItem={({ item, index }) => (
        <VoucherHistoryCard item={item} index={index} />
      )}
      style={styles.list}
      contentContainerStyle={styles.contentContainerStyle}
      ListEmptyComponent={!isLoading ? <NoData /> : <FullScreenLoader />}
    />
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

export default HistoryTab