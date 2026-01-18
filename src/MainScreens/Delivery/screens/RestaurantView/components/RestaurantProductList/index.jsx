import { Tabs } from "react-native-collapsible-tab-view";
import RestaurantProductListItem from "../RestaurantProductListItem";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { getRestaurantProductsByCategory } from "../../../../../../api/delivery";
import { Text } from "react-native";
import { colors } from "../../../../../../components/colors";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { cartProductsSelector } from "../../../../../../redux/cart/cart-selectors";
import { BALOO_SEMIBOLD } from "../../../../../../redux/types";
import {
  addProduct,
  removeProduct,
} from "../../../../../../redux/cart/cart-thunks";

const RestaurantProductList = ({
  categoryId,
  merchantId,
  search,
  onItemPress,
  isDark,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const cartProducts = useSelector(cartProductsSelector);

  useEffect(() => {
    let category;

    if (categoryId !== "offers" && categoryId !== "all") {
      category = categoryId;
    }

    setLoading(true);
    getRestaurantProductsByCategory(merchantId, category)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setData([]);
        setLoading(false);
        console.log(err, "err");
      });
  }, []);

  let filteredData = data;

  if (search) {
    filteredData = data.filter((item) => item.name.includes(search));
  }

  if (categoryId === "offers") {
    filteredData = data.filter((item) => item.is_in_offer);
  }

  const handleIncreasePress = (product) => {
    dispatch(
      addProduct({
        product_id: product.id_restro,
        price: product.lst_price,
        product,
      })
    );
  };

  const handleDecreasePress = (product) => {
    dispatch(
      removeProduct({
        product_id: product.id_restro,
        price: product.lst_price,
      })
    );
  };

  const _renderItem = ({ item }) => {
    return (
      <RestaurantProductListItem
        isDark={isDark}
        name={item.name}
        image_url={item.image_url}
        description_sale={item.description_sale}
        onPress={() => onItemPress(item)}
        onIncreasePress={() => handleIncreasePress(item)}
        onDecreasePress={() => handleDecreasePress(item)}
        quantity={cartProducts[item.id_restro]?.quantity || 0}
        price={
          item.discount
            ? item.lst_price - (item.lst_price / 100) * item.discount
            : item.lst_price
        }
        priceWithoutDiscount={!!item.discount && item.lst_price}
      />
    );
  };

  return (
    <Tabs.FlatList
      data={filteredData}
      renderItem={_renderItem}
      style={[
        styles.flatList,
        { backgroundColor: isDark ? colors.darkBlue : colors.white },
      ]}
      contentContainerStyle={styles.contentContainerStyle}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.emptyComponentWrapper}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={[
                styles.notFoundText,
                { color: isDark ? colors.white : colors.darkBlue },
              ]}
            >
              No products found
            </Text>
          )}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    marginTop: 100,
  },
  contentContainerStyle: {
    paddingBottom: 80,
  },
  emptyComponentWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  notFoundText: {
    fontFamily: BALOO_SEMIBOLD,
    fontSize: 14,
  },
});

export default RestaurantProductList;
