import {FlatList, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import {getLoyaltyVouchersList} from "../../../../api/loyalty";
import {timeLeft} from "../../helpers";
import {useTranslation} from "react-i18next";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import VoucherCard from "../../common/VoucherCard";
import {isRTL} from "../../../../../utils";
import {navigate} from "../../../../Navigation/RootNavigation";

const ListTab = () => {
  const {isLoading,  isError, data, error } = useQuery(["vouchers-list"], getLoyaltyVouchersList
        
  );

  const {i18n} = useTranslation();
  const language = i18n.language;
  const isAr = isRTL();


  const handleItemPress = voucher => {
    navigate('loyaltyPoints-vouchers-info',{voucher})
  }

    
    return (
        <FlatList 
          data={!isLoading ? data: []}
          renderItem={({item, index}) => <VoucherCard uri={item.logo} style={{marginTop: index ? 20: 0}} expiringDate={timeLeft(item.expiry_date
,language)} 
title={isAr ? item.name_arabic: item.name}
onPress={() => handleItemPress(item)}
value={item.x_minimum_point
}/>}
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

export default ListTab