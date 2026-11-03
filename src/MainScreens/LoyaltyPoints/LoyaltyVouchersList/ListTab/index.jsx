import { FlatList, StyleSheet } from "react-native";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { getLoyaltyVouchersList } from "../../../../api/loyalty";
import { timeLeft } from "../../helpers";
import { useTranslation } from "react-i18next";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { isRTL } from "../../../../../utils";
import { navigate } from "../../../../Navigation/RootNavigation";
import { org } from "../../../../org/config";
import VoucherCard from "./VoucherCard";

const ListTab = ({ categoryId, onLeaveTab }) => {
  useEffect(() => {
    return () => {
      onLeaveTab?.();
    };
  }, []);

  const { isLoading, isError, data, error } = useQuery(
    ["vouchers-list", categoryId],
    () => getLoyaltyVouchersList({ category_id: categoryId, x_org_type: org.code }),
    // Default is 3 retries with backoff on a 15s timeout, which kept the
    // spinner up for over a minute when the request failed.
    { retry: 1 }
  );

  if (__DEV__ && isError) {
    console.warn('vouchers-list failed:', error?.message);
  }

  const { i18n } = useTranslation();
  const language = i18n.language;
  const isAr = isRTL();


  const handleItemPress = voucher => {
    navigate('loyaltyPoints-vouchers-info', { voucher })
  }

  return (
    <FlatList
      data={!isLoading && Array.isArray(data) ? data : []}
      keyExtractor={(item, index) => item.code || String(index)}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        <VoucherCard
          base64={item.logo}
          expiringDate={timeLeft(item.expiry_date, language)}
          description={isAr ? item.name_arabic : item.name}
          onPress={() => handleItemPress(item)}
          priceValue={item.voucher_amount}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.contentContainerStyle}
      ListEmptyComponent={!isLoading ? <NoData /> : <FullScreenLoader />}
    />
  )
};

const styles = StyleSheet.create({
  list: {
    marginTop: 20
  },
  contentContainerStyle: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: 160
  },
  columnWrapper: {
    justifyContent: 'space-between'
  }
});

export default ListTab
