import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import RestaurantBlockItem from "./RestaurantBlockItem";
import { colors } from "../../../../../../components/colors";
import ListNoData from "../../../../../../components/ListNoData";
import { VIEW_CONSTANTS } from "../ViewChanger/config";
import RestaurantListItem from "./RestaurantListItem";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../../components/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMerchant } from "../../../../../../redux/delivery/delivery-actions";
import { CONSTANTS } from "../DeliveryTabs/config";
import { saveOffer } from "../../../../../../redux/merchant/merchant-thunks";

const RestaurantList = ({
  restaurants,
  restaurantsLoading,
  viewType,
  activeTab,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const { favoriteOffers } = useSelector((state) => state.merchantReducer);

  const handleListItemPress = (merchant) => {
    dispatch(setSelectedMerchant(merchant));

    navigation.navigate("restaurantView");
  };

  const handleLikePress = (productId) => {
    dispatch(saveOffer(productId, t));
  };

  return (
    <FlatList
      style={{ marginTop: 20 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      data={restaurantsLoading ? [] : restaurants}
      renderItem={({ item, index }) => {
        const distanceText = item.distance
          ? `${item.distance} Km`
          : t("RestaurantList.allowLocation");

        const priceText =
          activeTab === CONSTANTS.TAKEWAY ? undefined : item.delivery_cost;

        return viewType === VIEW_CONSTANTS.BLOCK ? (
          <RestaurantBlockItem
            onPress={() => handleListItemPress(item)}
            onLikePress={handleLikePress}
            isLiked={favoriteOffers.find((offer) => offer.id === item.id)}
            mapBanner={item.map_banner}
            merchantLogo={item.merchant_logo}
            merchantName={item.merchant_name}
            merchantId={item.merchant_id}
            price={priceText}
            rate={item.rating}
            distance={distanceText}
            time={item.time_for_order_prepration}
            isDark={isDark}
            description={item.description}
          />
        ) : (
          <RestaurantListItem
            onPress={() => handleListItemPress(item)}
            onLikePress={handleLikePress}
            isLiked={favoriteOffers.find((offer) => offer.id === item.id)}
            merchantLogo={item.merchant_logo}
            merchantName={item.merchant_name}
            merchantId={item.merchant_id}
            price={priceText}
            rate={item.rating}
            distance={distanceText}
            time={item.time_for_order_prepration}
            isDark={isDark}
            description={item.description}
          />
        );
      }}
      keyExtractor={(item) => `${item.merchant_id}`}
      ListEmptyComponent={() =>
        restaurantsLoading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size={"large"} color={colors.green} />
          </View>
        ) : (
          <ListNoData text={t("RestaurantList.notFound")} />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  loaderWrapper: {
    marginVertical: 30,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RestaurantList;
