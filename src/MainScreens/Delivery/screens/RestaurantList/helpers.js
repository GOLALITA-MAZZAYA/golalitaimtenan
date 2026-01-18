import { getDistance } from "../../../../../utils";

export const addDistanceToRestaurants = (restaurants, userLocation) => {
  if (userLocation) {
    return restaurants.map((item) => {
      if (item.partner_latitude && item.partner_longitude) {
        return {
          ...item,
          distance: getDistance(
            userLocation?.latitude,
            userLocation?.longitude,
            item.partner_latitude,
            item.partner_longitude,
            "Km"
          )?.toFixed(1),
        };
      }

      return item;
    });
  }

  return restaurants;
};
