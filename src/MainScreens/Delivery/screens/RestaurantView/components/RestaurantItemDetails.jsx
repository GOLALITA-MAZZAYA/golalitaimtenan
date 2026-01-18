import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  CloseIcon,
  DecreaseQuantityIcon,
  IncreaseQuantityIcon,
} from "../../../../../assets/delivery_assets";

import {} from "react-native-gesture-handler";
import { SizedBox } from "../../_shared/componenets/SizedBox";
import { colors } from "../../../../../components/colors";
import { useDispatch, useSelector } from "react-redux";
import { cartProductsSelector } from "../../../../../redux/cart/cart-selectors";
import { useTranslation } from "react-i18next";
import {
  addProduct,
  removeProduct,
} from "../../../../../redux/cart/cart-thunks";

const RestaurantItemDetails = ({
  closeBottomSheet,
  item,
  onAddToCartPress,
  isDark,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { totalPrice, totalQuantity } = useSelector(
    (state) => state.cartReducer
  );

  if (!item) {
    return null;
  }

  const addProductToCart = () => {
    dispatch(
      addProduct({
        product_id: item.id_restro,
        price: item.lst_price,
        product: item,
      })
    );
  };

  const removeProductFromCart = () => {
    dispatch(
      removeProduct({
        product_id: item.id_restro,
        price: item.lst_price,
      })
    );
  };

  const handleAddToCart = () => {
    onAddToCartPress(null);
  };

  const defColor = isDark ? colors.white : colors.darkBlue;

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? colors.darkBlue : colors.white },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={closeBottomSheet}>
          <CloseIcon style={styles.closeIcon} color={defColor} />
        </TouchableOpacity>
        <Text style={[styles.name, { color: defColor }]}>{item.name}</Text>
        <SizedBox size={1} />
      </View>
      <SizedBox size={24} />
      <Image
        source={{
          uri: item.image_url,
        }}
        style={styles.image}
      />
      <SizedBox size={24} />
      <Text numberOfLines={2} style={styles.description}>
        {item.description}
      </Text>

      <View style={styles.bottomBorder} />
      <SizedBox size={24} />
      <View style={styles.priceBlockWrapper}>
        <Text style={[styles.priceText, { color: defColor }]}>{`${
          item.discount
            ? item.lst_price - (item.lst_price / 100) * item.discount
            : item.lst_price
        } QR`}</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={removeProductFromCart}>
            <DecreaseQuantityIcon />
          </TouchableOpacity>
          <SizedBox size={12} />
          <Text style={[styles.priceText, { color: defColor }]}>
            {totalQuantity}
          </Text>
          <SizedBox size={12} />
          <TouchableOpacity onPress={addProductToCart}>
            <IncreaseQuantityIcon color={defColor} />
          </TouchableOpacity>
        </View>
      </View>
      <SizedBox size={24} />
      <TouchableOpacity onPress={handleAddToCart}>
        <View
          style={[
            styles.submitBtn,
            { backgroundColor: isDark ? "#0B177E" : colors.darkBlue },
          ]}
        >
          <Text style={[styles.submitText, { color: colors.white }]}>
            {t("RestaurantView.add")}
          </Text>
          <Text
            style={[styles.submitText, { color: colors.white }]}
          >{`${totalPrice} QR`}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RestaurantItemDetails;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    backgroundColor: "#f3f3f3",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    height: 200,
    borderRadius: 16,
  },
  priceBlockWrapper: {
    flexDirection: "row",
    margin: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
  },
  submitBtn: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  submitText: {
    fontSize: 18,
    fontWeight: "600",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#08003B",
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1F2666",
  },
  bottomBorder: {
    borderBottomColor: "grey",
    borderBottomWidth: 0.4,
  },
});
