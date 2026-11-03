import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";
import {removeEmptyFields} from "../helpers";

export const getRestaurantsList = async (params) => {
  const token = await getToken();

  const res = await instance.post(`/restaurants`, {
    params: {
      token,
      ...params
    },
  });


  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result.data.restaurants;
};

export const getRestaurantsHistoryList = async () => {
  const token = await getToken();

  const res = await instance.post("/bookings/history", {
    params: {
      token,
      filter: 'all'
    },
  });

  console.log(res.data.result,'res.data.result booking history')

  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result?.data;
};

export const getRestaurantById = async (restaurant_id) => {
  const token = await getToken();


  const res = await instance.post("/restaurants/details", {
    params: {
      token,
      restaurant_id
    },
  });

  console.log(res.data.result,'res.data.result booking history')

  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result?.data;
};

export const getRestaurantSlots = async (restaurant_id, booking_date) => {
  const token = await getToken();

  const res = await instance.post(`/restaurants/slots`, {
    params: {
      token,
      restaurant_id,
      booking_date
    },
  });


  if (!res.data.result?.data?.slots) {
    throw new Error();
  }

  return res.data.result.data.slots.filter(item => item.available).map(item => item.time);
};

export const bookTableInRestaurant = async (body) => {
  const token = await getToken();

  const res = await instance.post(`/bookings/create`, {
    params: {
      token,
      ...body
    },
  });

  console.log(res,'booking res request')



  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getRestaurantBookingStatus = async (booking_ref) => {
  const token = await getToken();


  const res = await instance.post(`/bookings/status`, {
    params: {
      token,
      booking_ref
    },
  });

  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result?.data;
};

export const getRestaurantMenu = async (restaurant_id) => {
  const token = await getToken();


  const res = await instance.post(`/restaurants/menu`, {
    params: {
      token,
      restaurant_id
    },
  });

  console.log(res.data.result?.data,'res.data.result?.data')

  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result?.data
};

export const restaurantBookingCancel = async (booking_ref) => {
  const token = await getToken();


  const res = await instance.post(`/bookings/cancel`, {
    params: {
      token,
      booking_ref
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const restaurantBookingUpdate = async (params) => {
  const token = await getToken();


  const res = await instance.post(`/bookings/update`, {
    params: {
      token,
      ...params
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getRestaurantSeatingPreferences = async (restaurant_id) => {
  const token = await getToken();


  const res = await instance.post(`/restaurants/master-data`, {
    params: {
      token,
      restaurant_id
    },
  });

  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result.data.seating_preferences;
};

export const createOrder = async (restaurant_id,{order_type, unit_number, building_number, zone_number, street_number, customer_name, customer_phone, items, return_url, total_amount, amount, discount}) => {
  const token = await getToken();

  const params = {
       token,
       restaurant_id,
       order_type,
       customer_name,
       customer_phone,
       unit_number,
       building_number,
       zone_number, 
       street_number,
       items,
       return_url,
       total_amount,
       amount, 
       discount
    };
  console.log(params,'params')

  const cleanedParams = removeEmptyFields(params);


  const res = await instance.post(`/orders/create`, {
    params: {
       token,
       ...cleanedParams
    }
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getOrderStatus = async (order_ref) => {
  const token = await getToken();


  const res = await instance.post(`/orders/status`, {
    params: {
      token,
      order_ref
    },
  });

  console.log(res.data.result,'getOrderStatus')

  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result?.data;
};

export const getOrdersHistory = async () => {
  const token = await getToken();


  const res = await instance.post(`/orders/history`, {
    params: {
      token,
    },
  });

  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result?.data;
};

export const orderUpdate = async (params) => {
  const token = await getToken();


  const res = await instance.post(`/orders/update`, {
    params: {
      token,
      ...params
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const orderCancel = async (order_ref) => {
  const token = await getToken();


  const res = await instance.post(`/orders/cancel`, {
    params: {
      token,
      order_ref
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const verifySkipcachePayment = async (booking_id,
  order_ref, orderType
) => {
  const token = await getToken();

  const params = {
    token
  };

  if(orderType === 'booking'){
    params.booking_id = booking_id
  }

  if(orderType === 'order'){
    params.order_ref = order_ref
  }

  const res = await instance.post(`/restaurants/payment/status`, {
    params,
  });

  console.log(res.data,'/restaurants/payment/status')

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};


