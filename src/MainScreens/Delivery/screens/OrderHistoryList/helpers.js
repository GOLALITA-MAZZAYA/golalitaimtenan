import i18next from "i18next";
import { ORDER_STATUSES_CONFIG } from "./config";

export const concatStrings = (arr, field) => {
  return arr.reduce((a, b) => {
    if (!b[field]) {
      return a;
    }

    if (!a) {
      return `${b[field]}`;
    }

    return `${a},  ${b[field]}`;
  }, "");
};

export const getDeliveryTypeDisplayValue = (delivery_type) => {
  if (delivery_type === "take_away") {
    return i18next.t("RestaurantList.takeaway");
  }

  return i18next.t("RestaurantList.delivery");
};

export const transformDateFormat = (dateStr) => {
  const [date, time] = dateStr.split(" ");
  const [year, month, day] = date.split("-");

  const newDate = new Date(year, month, day);
  const monthLong = newDate.toLocaleString(i18next.language, {
    month: "short",
  });

  return `${day} ${monthLong} ${year}`;
};

export const canReorder = (status) => {
  return ORDER_STATUSES_CONFIG[status].can_reorder;
};
