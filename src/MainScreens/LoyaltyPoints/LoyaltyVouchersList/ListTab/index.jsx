import {FlatList, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import {getLoyaltyVouchersList} from "../../../../api/loyalty";
import {timeLeft} from "../../helpers";
import {useTranslation} from "react-i18next";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {isRTL} from "../../../../../utils";
import {navigate} from "../../../../Navigation/RootNavigation";
import VoucherCard from "./VoucherCard";

const ListTab = () => {
  const {isLoading,  isError, data, error } = useQuery(["vouchers-list"], getLoyaltyVouchersList
        
  );

  const {i18n} = useTranslation();
  const language = i18n.language;
  const isAr = isRTL();


  const handleItemPress = voucher => {
    navigate('loyaltyPoints-vouchers-info',{voucher})
  }

  if(data){
    delete data[0].logo;

    console.log(data[0],'first voucher')
  }

  console.log(data,'vouchers data')

    
    return (
        <FlatList 
          data={!isLoading ? data: []}
          renderItem={({item, index}) => (
          <VoucherCard 
              base64={item.logo} 
              style={{marginTop: index ? 20: 0}}
              expiringDate={timeLeft(item.expiry_date,language)} 
              description={'Test value'}
              title={isAr ? item.name_arabic: item.name}
              onPress={() => handleItemPress(item)}
              pointValue={item.x_minimum_point}
              earnValue={item.x_points_earn}
              priceValue={item.voucher_amount}
        />

      )}
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