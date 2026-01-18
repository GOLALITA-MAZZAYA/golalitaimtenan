import { deliveryApi } from "./delivery-api";
import {
  setRestaurants,
  setRestaurantsLoading,
  setRestaurantsItems,
  setRestaurantsCategories,
  setRestaurantProductsCategories,
} from "./delivery-actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getRestaurants =
  (categories, transformData) => async (dispatch) => {
    dispatch(setRestaurantsLoading(true));

    const token = await AsyncStorage.getItem("token");

    const res = await deliveryApi.getRestaurants({
      params: {
        token,
        restaurant_category_ids: categories ? categories : undefined,
      },
    });

    const data = transformData
      ? transformData(res.data.result)
      : res.data.result;

    dispatch(setRestaurants(data));

    dispatch(setRestaurantsLoading(false));
  };

export const getRestaurantsItems = (category_id) => async (dispatch) => {
  const token = await AsyncStorage.getItem("token");

  const res = await deliveryApi.getRestaurantsItems({
    params: {
      token: token,
      restaurant_category_ids: [category_id],
    },
  });

  dispatch(setRestaurantsItems(res.data.result));
};

export const getRestaurantsCategories = () => async (dispatch) => {
  const token = await AsyncStorage.getItem("token");

  const res = await deliveryApi.getRestaurantCategories({
    params: {
      token: token,
    },
  });

  dispatch(setRestaurantsCategories(res.data.result?.restro_category));
};

export const getRestaurantProductsCategories =
  (merchant_id) => async (dispatch) => {
    const token = await AsyncStorage.getItem("token");

    const res = await deliveryApi.getRestaurantCategories({
      params: {
        token: token,
        merchant_id,
      },
    });

    const additionalCategories = [
      {
        id: "all",
        name: "All",
        name_arbic: "الجميع",
        parent_id: null,
      },
      {
        id: "offers",
        name: "Offers",
        name_arbic: "عروض",
        parend_id: null,
      },
    ];

    dispatch(
      setRestaurantProductsCategories([
        ...additionalCategories,
        ...res.data.result?.restro_category,
      ])
    );
  };
