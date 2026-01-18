import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DeleteSvg from "../../../../assets/delete.svg";
import BottomSheet from "../BottommSheet/BottomSheet";
import { SizedBox } from "../_shared/componenets/SizedBox";
import { useTheme } from "../../../../components/ThemeProvider";
import { colors } from "../../../../components/colors";
import { useDispatch, useSelector } from "react-redux";
import RestaurantProductListItem from "../RestaurantView/components/RestaurantProductListItem";
import { clearProductCart } from "../../../../redux/cart/cart-actions";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../../../components/CustomHeader";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import VoucherCode from "./VoucherCode";
import { useRoute } from "@react-navigation/native";
import { getRestaurantProductsByCategory } from "../../../../api/delivery";
import { setSelectedMerchant } from "../../../../redux/delivery/delivery-actions";
import { addProduct, removeProduct } from "../../../../redux/cart/cart-thunks";
import { CONSTANTS } from "../RestaurantList/components/DeliveryTabs/config";

const CartSummary = ({ navigation }) => {
  const cartRef = useRef(null);
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { selectedMerchant } = useSelector((state) => state.restaurantReducer);
  const {
    cartProducts,
    voucher,
    totalPrice,
    totalDiscount,
    subtotal,
    activeTab,
  } = useSelector((state) => state.cartReducer);

  const transformedCardProducts = Object.entries(cartProducts).map(
    (item) => item[1].product
  );

  const restaurants = useSelector(
    (state) => state.restaurantReducer.restaurants
  );

  const route = useRoute();
  const paramsReorderData = route?.params?.reorderData;
  const [loading, setLoading] = useState(!!paramsReorderData);

  useEffect(() => {
    cartRef?.current?.scrollTo(-180);
  }, [loading]);

  useEffect(() => {
    (async () => {
      if (paramsReorderData) {
        try {
          setLoading(true);
          dispatch(clearProductCart());

          const res = await getRestaurantProductsByCategory(
            paramsReorderData.merchant_id
          );

          const selectedMerchant = restaurants.find(
            (item) => item.merchant_id === paramsReorderData.merchant_id
          );

          const orderedProducts = [];
          const orderedProductIds = paramsReorderData.products.map(
            (item) => item.product_id
          );

          res.forEach((item) => {
            if (orderedProductIds.includes(item.id)) {
              const newItem = {
                ...item,
                quantity: paramsReorderData.products.find(
                  (product) => product.product_id === item.id
                ).quantity,
              };

              orderedProducts.push(newItem);
            }
          });

          orderedProducts.forEach((product) => {
            dispatch(
              addProduct({
                product_id: product.id_restro,
                price: product.lst_price,
                product,
                quantity: product.quantity,
              })
            );
          });

          dispatch(setSelectedMerchant(selectedMerchant));

          setLoading(false);
        } catch (err) {
          console.log(err, "err");
        } finally {
        }
      }
    })();
  }, [paramsReorderData?.merchant_id]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? colors.darkBlue : colors.white,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  const handleBackPress = () => {
    navigation.goBack();
  };

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

  const handleAddItemsPress = () => {
    navigation.navigate("restaurantView");
  };

  const handleDeleteOrder = () => {
    dispatch(clearProductCart());

    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <CustomHeader
        title={selectedMerchant.merchant_name}
        onLeftBtnPress={handleBackPress}
        rightBtn={() => <DeleteSvg color={"red"} height={24} width={24} />}
        onRightBtnPress={handleDeleteOrder}
      />
      <ScrollView>
        {transformedCardProducts.map((item) => (
          <RestaurantProductListItem
            key={item.id}
            isDark={isDark}
            name={item.name}
            image_url={item.image_url}
            description_sale={item.description_sale}
            onPress={() => {}}
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
        ))}

        <VoucherCode isDark={isDark} />

        <SizedBox size={12} />

        <View style={{ marginHorizontal: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: BALOO_SEMIBOLD,
              color: isDark ? colors.white : colors.grey,
            }}
          >
            {t("CartSummary.totalSummary")}
          </Text>
          <SizedBox size={8} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: BALOO_SEMIBOLD,
                color: isDark ? colors.white : colors.darkBlue,
              }}
            >
              {t("CartSummary.subtotal")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: BALOO_SEMIBOLD,
                color: isDark ? colors.white : colors.darkBlue,
              }}
            >
              {`${subtotal} QR`}
            </Text>
          </View>
          {selectedMerchant.delivery_cost &&
            activeTab === CONSTANTS.DELIVERY && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: BALOO_SEMIBOLD,
                    color: isDark ? colors.white : colors.darkBlue,
                  }}
                >
                  {t("CartSummary.deliveryCost")}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: BALOO_SEMIBOLD,
                    color: isDark ? colors.white : colors.darkBlue,
                  }}
                >
                  {`${selectedMerchant.delivery_cost} QR`}
                </Text>
              </View>
            )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: BALOO_SEMIBOLD,
                color: isDark ? colors.white : colors.darkBlue,
              }}
            >
              {t("CartSummary.discount")}
            </Text>
            <Text
              style={{ fontSize: 14, fontFamily: BALOO_SEMIBOLD, color: "red" }}
            >
              {`- ${totalDiscount} QR`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: BALOO_SEMIBOLD,
                color: isDark ? colors.white : colors.darkBlue,
              }}
            >
              {t("CartSummary.voucherDiscount")}
            </Text>
            <Text
              style={{ fontSize: 14, fontFamily: BALOO_SEMIBOLD, color: "red" }}
            >
              {`- ${voucher?.discount || 0} QR`}
            </Text>
          </View>

          <SizedBox size={20} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#08003B" }}>
              {t("CartSummary.totalAmount")}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#08003B" }}>
              {`${totalPrice + (selectedMerchant.delivery_cost || 0)} QR`}
            </Text>
          </View>
        </View>

        <SizedBox size={200} />
      </ScrollView>
      <BottomSheet
        ref={cartRef}
        backgroundColor={isDark ? "#0B177E" : colors.darkBlue}
      >
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginHorizontal: 16, flex: 1 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Checkout", { activeTab })}
              >
                <View
                  style={{
                    backgroundColor: isDark ? colors.darkBlue : "#0B177E",
                    borderRadius: 16,
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "600", color: "white" }}
                  >
                    {t("CartSummary.checkout")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 16, flex: 1 }}>
              <TouchableOpacity onPress={handleAddItemsPress}>
                <View
                  style={{
                    backgroundColor: isDark ? "#0B177E" : colors.darkBlue,
                    borderRadius: 16,
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "white",
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "600", color: "white" }}
                  >
                    {`+ ${t("CartSummary.add")}`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default CartSummary;
