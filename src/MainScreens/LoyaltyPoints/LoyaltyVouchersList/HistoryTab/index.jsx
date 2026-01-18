import {FlatList, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import { getLoyaltyVouchersHistory} from "../../../../api/loyalty";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import HistoryCard from "../../common/HistoryCard";
import {useTranslation} from "react-i18next";
import {isRTL} from "../../../../../utils";
import {formatDate} from "../../helpers";

const HistoryTab = () => {
  const {isLoading,  isError, data, error } = useQuery(["vouchers-history"], getLoyaltyVouchersHistory
        
  );    
  const {i18n} = useTranslation();
  const lang = i18n.language;
  const isAr = isRTL();

  console.log(data,'vouchers history')

    
    return (
        <FlatList 
          data={!isLoading ? data: []}
          renderItem={({item, index}) => {
            const title = isAr ? item.merchant_name_arabic: item.merchant_name;
            const value = item.minimum_loyalty_points;
            return (
           <HistoryCard
            title={title}
            description={formatDate(item.redeem_date,lang)}
            value={value}
            index={index}
            />)}}
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