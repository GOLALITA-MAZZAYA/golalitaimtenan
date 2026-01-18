import instance from "../instance";
export const deliveryApi = {
  getRestaurants: (body) => instance.post("/user/restaurant/lists/v2", body),
  getRestaurantsItems: (body) =>
    instance.post("/user/restaurant/product/lists/new", body),
  getRestaurantCategories: (body) =>
    instance.post("/user/restaurant/category/lists", body),
};
