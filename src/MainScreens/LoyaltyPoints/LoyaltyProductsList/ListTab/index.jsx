import {useCallback} from "react";
import {FlatList, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import {getLoyaltyProductList} from "../../../../api/loyalty";
import ProductListCard from "../../common/ProductListCard";
import {getLoyaltyProductImageUri, timeLeft} from "../../helpers";
import {useTranslation} from "react-i18next";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {navigate} from "../../../../Navigation/RootNavigation";
import {SCREEN_WIDTH} from "../../../../styles/mainStyles";

const IMAGE_ASPECT_RATIO = 16 / 9;
const ITEM_HEIGHT = (SCREEN_WIDTH - 40) / IMAGE_ASPECT_RATIO;
const ITEM_GAP = 20;

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT + (index === 0 ? 0 : ITEM_GAP),
  offset: ITEM_HEIGHT * index + ITEM_GAP * Math.max(0, index - 1),
  index,
});

const ListTab = () => {
  const {isLoading,  isError, data, error } = useQuery(["products-list"], getLoyaltyProductList
        
  );


  const {i18n} = useTranslation();
  const language = i18n.language;


    const handleItemPress = useCallback((item) => {
      navigate("loyaltyPoints-products-info",{
        product_id: item.id,
      })
    }, []);

    const renderItem = useCallback(({item, index}) => (
      <ProductListCard
        description={language === 'ar' ? item.x_arabic_name: item.name}
        onPress={() => handleItemPress(item)}
        uri={getLoyaltyProductImageUri(item)}
        aspectRatio={IMAGE_ASPECT_RATIO}
        style={{marginTop: index ? 20: 0}}
        expiringDate={timeLeft(item.loyalty_expiry_date, language)}
        value={item.minimum_loyalty_points}
      />
    ), [language, handleItemPress]);
   console.log(data,'data')
    
    return (
        <FlatList 
          data={!isLoading ? data: []}
          keyExtractor={(item) => String(item.id)}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={false}
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

export default ListTab