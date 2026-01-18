import {FlatList, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import {getLoyaltyProductList} from "../../../../api/loyalty";
import ProductListCard from "../../common/ProductListCard";
import {timeLeft} from "../../helpers";
import {useTranslation} from "react-i18next";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {navigate} from "../../../../Navigation/RootNavigation";

const ListTab = () => {
  const {isLoading,  isError, data, error } = useQuery(["products-list"], getLoyaltyProductList
        
  );


  const {i18n} = useTranslation();
  const language = i18n.language;


    const handleItemPress = (item) => {

      navigate("loyaltyPoints-products-info",{
        product_id: item.id,
        title: language === 'ar' ? item.x_arabic_name: item.name
      })

    }

    
    return (
        <FlatList 
          data={!isLoading ? data: []}
          renderItem={({item, index}) => <ProductListCard onPress={() => handleItemPress(item)} uri={item.image_1920} style={{marginTop: index ? 20: 0}} expiringDate={timeLeft(item.loyalty_expiry_date
,language)} value={item.minimum_loyalty_points}/>}
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