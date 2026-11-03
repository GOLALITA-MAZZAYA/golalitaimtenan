import {useCallback} from "react";
import {FlatList, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import { getLoyaltyProductsHistory} from "../../../../api/loyalty";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import HistoryCard from "../../common/HistoryCard";
import {useTranslation} from "react-i18next";
import {isRTL} from "../../../../../utils";
import {formatDate} from "../../helpers";

// HistoryCard's `wrapper` style is a fixed height: 96. Every item except the
// first also gets marginTop: 25 (HistoryCard's own `{marginTop: index ? 25 : 0}`),
// so each item's full slot is 96 (+25 for every item after the first).
const ITEM_HEIGHT = 96;
const ITEM_GAP = 25;

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT + (index === 0 ? 0 : ITEM_GAP),
  offset: ITEM_HEIGHT * index + ITEM_GAP * Math.max(0, index - 1),
  index,
});

const HistoryTab = () => {
  const {isLoading,  isError, data, error } = useQuery(["products-history"], getLoyaltyProductsHistory
        
  );    
  const {i18n} = useTranslation();
  const lang = i18n.language;
  const isAr = isRTL();

    const renderItem = useCallback(({item, index}) => {
      const title = isAr ? item.merchant_name_arabic: item.merchant_name;
      const value = item.minimum_loyalty_points;

      return (
        <HistoryCard
          title={title}
          description={formatDate(item.redeem_date,lang)}
          value={value}
          index={index}
        />
      );
    }, [isAr, lang]);

    return (
        <FlatList 
          data={!isLoading ? data: []}
          keyExtractor={(item, index) => `${item.merchant_name || ''}-${item.redeem_date || index}`}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.contentContainerStyle}
          ListEmptyComponent={!isLoading ? <NoData /> :<FullScreenLoader />}
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
   }
});

export default HistoryTab