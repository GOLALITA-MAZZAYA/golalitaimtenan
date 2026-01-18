import instance from "../instance";

export const orderHistoryApi = {
  getOrderHistoryList: (body) => instance.post("/user/restro/order/list", body),
};
