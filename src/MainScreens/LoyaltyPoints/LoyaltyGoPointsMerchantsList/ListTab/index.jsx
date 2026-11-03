import { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useQuery } from "react-query";
import ProductListCard from "../../common/ProductListCard";
import { useTranslation } from "react-i18next";
import NoData from "../../../Transactions/components/NoData";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { navigate } from "../../../../Navigation/RootNavigation";
import { getGoPointsMerchantsWithDiscount } from "../../../../api/merchants";
import { useDispatch } from "react-redux";
import { getMerchantDetailsWithoutNavigate } from "../../../../redux/merchant/merchant-thunks";

// ProductListCard's `wrapper` style is a fixed height: 242 (IMAGE_HEIGHT in
// that file). Every item except the first also gets marginTop: 20 (applied
// here via `style={{ marginTop: index ? 20 : 0 }}`).
const ITEM_HEIGHT = 242;
const ITEM_GAP = 20;

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT + (index === 0 ? 0 : ITEM_GAP),
  offset: ITEM_HEIGHT * index + ITEM_GAP * Math.max(0, index - 1),
  index,
});

const ListTab = () => {
  const { isLoading, isError, data, error } = useQuery(["go-points-merchant-list"], getGoPointsMerchantsWithDiscount);

  const { i18n } = useTranslation();
  const language = i18n.language;
  const dispatch = useDispatch();

  const handleItemPress = useCallback((item) => {
    console.log("handleItemPress item:", item.merchant_id)
    dispatch(getMerchantDetailsWithoutNavigate(item.merchant_id))

    navigate("loyaltyPoints-go-merchants-info", {
      screen: "merchant-info"
    })
  }, [dispatch]);

  const renderItem = useCallback(({ item, index }) => {
    return (
      <ProductListCard
        description={language === 'ar' ? item.x_arabic_name : item.merchant_name}
        onPress={() => handleItemPress(item)}
        uri={item.map_banner}
        style={{ marginTop: index ? 20 : 0 }}
      //  value={200}
      />
    )
  }, [language, handleItemPress]);

  console.log(data, 'go point merchants')

  return (
    <FlatList
      data={!isLoading ? data : []}
      keyExtractor={(item) => String(item.merchant_id)}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      renderItem={renderItem}
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
    flexGrow: 1,
    paddingBottom: 160
  }
});

export default ListTab