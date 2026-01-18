import i18next from "i18next";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const isRTL = () => i18next.dir(i18next.language) === "rtl";

export const getFlexDirection = () => ({
  flexDirection:
    i18next.dir(i18next.language) === "rtl" ? "row-reverse" : "row",
});

export const getTextAlign = () => ({
  textAlign: i18next.dir(i18next.language) === "rtl" ? "right" : "left",
});

export function timeSince(date, t) {
  const dateFromNowInSec = Math.floor(new Date() - date);

  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneWeek = oneDay * 7;
  const oneMonth = oneWeek * 4;
  const oneYear = oneMonth * 12;

  if (dateFromNowInSec < oneMinute) {
    return (
      Math.floor(dateFromNowInSec / 1000) + ` ${t("Notifications.secondsAgo")}`
    );
  }

  if (dateFromNowInSec >= oneMinute && dateFromNowInSec < oneHour) {
    return (
      Math.floor(dateFromNowInSec / oneMinute) +
      ` ${t("Notifications.minutesAgo")}`
    );
  }

  if (dateFromNowInSec >= oneHour && dateFromNowInSec < oneDay) {
    return (
      Math.floor(dateFromNowInSec / oneHour) + ` ${t("Notifications.hoursAgo")}`
    );
  }

  if (dateFromNowInSec >= oneDay && dateFromNowInSec < oneWeek) {
    return (
      Math.floor(dateFromNowInSec / oneDay) + ` ${t("Notifications.daysAgo")}`
    );
  }

  if (dateFromNowInSec >= oneWeek && dateFromNowInSec < oneMonth) {
    return (
      Math.floor(dateFromNowInSec / oneDay) + ` ${t("Notifications.weeksAgo")}`
    );
  }

  if (dateFromNowInSec >= oneMonth && dateFromNowInSec < oneYear) {
    return (
      Math.floor(dateFromNowInSec / oneMonth) +
      ` ${t("Notifications.monthsAgo")}`
    );
  }

  if (dateFromNowInSec >= oneYear) {
    return (
      Math.floor(dateFromNowInSec / oneYear) + ` ${t("Notifications.yearsAgo")}`
    );
  }
}

export const fromStringToDate = (string) => {
  let date = string.split(" ")[0];
  let year = date.split("-")[0];
  let month =
    date.split("-")[1][0] === "0" ? date.split("-")[1][1] : date.split("-")[1];
  let day =
    date.split("-")[2][0] === "0" ? date.split("-")[2][1] : date.split("-")[2];
  let time = string.split(" ")[1];
  let hours =
    time.split(":")[0][0] === "0" ? time.split(":")[0][1] : time.split(":")[0];
  let minutes =
    time.split(":")[1][0] === "0" ? time.split(":")[1][1] : time.split(":")[1];
  let seconds =
    time.split(":")[2][0] === "0" ? time.split(":")[2][1] : time.split(":")[2];
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

export const getStringFromDate = (date) => {
  if (!date) return null;
  let day = date.getUTCDate().toString().padStart(2, "0");
  let month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear();
  let hours = date.getUTCHours().toString().padStart(2, "0");
  let minutes = date.getUTCMinutes().toString().padStart(2, "0");
  let seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getColor = (categoryId) => {
  switch (categoryId) {
    case 18:
      return "#FF6001";
    case 19:
      return "#F05253";
    case 20:
      return "#38CA86";
    case 21:
      return "#3784FF";
    case 22:
      return "#618392";
    case 23:
      return "#D300A4";
    case 24:
      return "#1AC175";
    case 26:
      return "#618392";
    case 27:
      return "#FF7600";
    case 29:
      return "#FF7193";
    case 34:
      return "#000AFF";
    case 38:
      return "#6E01DC";
    case 39:
      return "#774B3E";
    case 41:
      return "#EA7700";
    case 42:
      return "#FFB800";
    case 43:
      return "#FF00B8";
    case 44:
      return "#CA7943";
    case 45:
      return "#697E87";
    default:
      return "#697E87";
  }
};
export const getStringDate = (dateString) => {
  console.log(dateString, "date");
  if (dateString === undefined) return "...";
  let date = new Date(dateString);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear() + 1;
  return `${day.toString().padStart(2, "0")}.${month
    .toString()
    .padStart(2, "0")}.${year}`;
};

export const onBannerPress = async (
  path,
  getMerchantDetails,
  navigation,
  t,
  trackBanner,
  user,
  tracking_code
) => {
  const userId = await AsyncStorage.getItem("family_head_id");

  trackBanner({
    customer: `${user.name}`,
    customer_id: +userId,
    email: user.email,
    phone: user.phone,
    tracking_code: tracking_code,
    date_time: getStringFromDate(new Date()),
  });
  if (isNaN(path) === false) {
    getMerchantDetails(path, navigation, t, null);
  } else if (
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(path)
  ) {
    Linking.openURL(`tel:${path}`);
  } else {
    Linking.openURL(path);
  }
};

export function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/gi, "");
}

export const phoneRegExp =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const dateForWeeks = new Date().setDate(new Date().getDate() - 1);

export const reverseString = (str) => str.split("").reverse().join("");

export const getOffsetAndLimit = (page, limit = 20) => {
  return { offset: (page - 1) * limit, limit };
};

export const getOffsetAndLimitForOffers = (page=1, limit = 20) => {
  return { offset: page - 1, limit };
};

export const checkIsNew = (createDate) => {
  return (
    (new Date() - new Date(createDate.split(" ")[0])) / (1000 * 60 * 60 * 24) <=
    15
  );
};

export function getDistance(lat1, lon1, lat2, lon2, unit) {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    console.log("wrong coordnates in get distance func");
    return;
  }

  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    if (unit == "M") {
      dist = dist * 1.609344 * 1000;
    }
    return dist;
  }
}
