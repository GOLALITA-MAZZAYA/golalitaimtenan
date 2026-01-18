import React, { useCallback, useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import BackSvg from "../../../../assets/back.svg";
import { getRestaurantProductsCategories } from "../../../../redux/delivery/delivery-thunks";
import RestaurantItemDetails from "./components/RestaurantItemDetails";
import BottomSheet from "../BottommSheet/BottomSheet";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import { SearchFiledWithProfilePhoto } from "../_shared/componenets/SearchFiledWithProfilePhoto";
import RestaurantInfo from "./components/RestaurantInfo";
import { colors } from "../../../../components/colors";
import { BALOO_MEDIUM } from "../../../../redux/types";
import RestaurantProductList from "./components/RestaurantProductList";
import RestaurantCartSummary from "./components/RestaurantCartSummary";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../components/ThemeProvider";
import { clearProductCart } from "../../../../redux/cart/cart-actions";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";

const RestaurantView = ({
  getRestaurantProductsCategories,
  restaurantProductCategories,
  navigation,
  cartProducts,
  merchant,
  clearProductCart,
}) => {
  const merchant_id = merchant?.merchant_id;
  const isCartProducts = !!Object.keys(cartProducts)?.length;


  useEffect(() => {
    getRestaurantProductsCategories(merchant_id);
  }, []);

  const cartRef = useRef(null);
  const itemRef = useRef(null);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { isDark } = useTheme();
  const { i18n, t } = useTranslation();
  const language = i18n.language;

  useEffect(() => {
    if (Object.entries(cartProducts)?.length) {
      cartRef?.current?.scrollTo(-200);
    } else {
      cartRef?.current?.scrollTo(0);
    }
  }, [Object.entries(cartProducts)?.length]);

  const onSelectItem = useCallback((isShowItem, item) => {
    if (!isShowItem) {
      setSelectedItem(null);
      itemRef?.current?.scrollTo(0);
    } else {
      setSelectedItem(item);
      itemRef?.current?.scrollTo(-700);
    }
  }, []);

  useEffect(() => {
    if (merchant_id) {
      clearProductCart();
    }
  }, [merchant_id]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleOnAddToCartPress = () => {
    onSelectItem(false);
  };

  const header = () => (
    <RestaurantInfo
      name={merchant.merchant_name}
      rate={merchant.rating}
      distance={merchant.distance ? `${merchant.distance}km` : "Allow location"}
      deliveryPrice={
        merchant.delivery_cost ? `${merchant.delivery_cost} QR` : null
      }
      deliveryTime={merchant.time_for_order_prepration || null}
      logo={merchant.merchant_logo}
      phone={merchant.phone}
    />
  );

  if (!restaurantProductCategories) {
    return (
      <SafeAreaView
        style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
      >
        <FullScreenLoader />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.searchBlock,
          { backgroundColor: isDark ? colors.darkBlue : colors.white },
        ]}
      >
        <TouchableOpacity
          style={{ marginBottom: 3, marginLeft: 16 }}
          onPress={handleBackPress}
        >
          <BackSvg color={isDark ? colors.white : colors.darkBlue} />
        </TouchableOpacity>

        <SearchFiledWithProfilePhoto
          style={{ paddingHorizontal: 20, flex: 1 }}
          onChangeText={setSearch}
          isDark={isDark}
        />
      </View>
      <Tabs.Container
        lazy
        renderHeader={header}
        revealHeaderOnScroll
        headerContainerStyle={{ marginTop: 100 }}
        containerStyle={{
          backgroundColor: isDark ? colors.darkBlue : colors.white,
        }}
        renderTabBar={(props) => {
          const pressColor = isDark ? colors.white : colors.darkBlue;
          return (
            <MaterialTabBar
              {...props}
              style={{
                backgroundColor: isDark ? colors.darkBlue : colors.white,
              }}
              scrollEnabled
              pressColor={pressColor}
              activeColor={pressColor}
              inactiveColor={colors.grey}
              labelStyle={{ fontFamily: BALOO_MEDIUM, fontSize: 14 }}
              indicatorStyle={(isActive) => ({
                borderBottomColor: isActive ? pressColor : colors.grey,
              })}
            />
          );
        }}
      >
        {restaurantProductCategories.map((cat) => (
          <Tabs.Tab
            name={language === "ar" ? cat.name_arbic || cat.name : cat.name}
          >
            <RestaurantProductList
              categoryId={cat.id}
              merchantId={merchant_id}
              search={search}
              onItemPress={(item) => onSelectItem(true, item)}
              isDark={isDark}
            />
          </Tabs.Tab>
        ))}
      </Tabs.Container>

      {isCartProducts && <RestaurantCartSummary isDark={isDark} t={t} />}

      <BottomSheet
        ref={itemRef}
        backgroundColor={isDark ? colors.darkBlue : colors.white}
      >
        <RestaurantItemDetails
          onAddToCartPress={handleOnAddToCartPress}
          closeBottomSheet={handleOnAddToCartPress}
          item={selectedItem}
          isDark={isDark}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  searchBlock: {
    width: "100%",
    height: 100,
    position: "absolute",
    zIndex: 9999999,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 10,
  },
});

const mapStateToProps = (state) => ({
  restaurantProductCategories:
    state.restaurantReducer.restaurantProductCategories,
  cartProducts: state.cartReducer.cartProducts,
  merchant: state.restaurantReducer.selectedMerchant,
});
export default connect(mapStateToProps, {
  getRestaurantProductsCategories,
  clearProductCart,
})(RestaurantView);
