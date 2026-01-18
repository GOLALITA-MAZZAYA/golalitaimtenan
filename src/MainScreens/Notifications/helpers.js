import i18next from "i18next";

export const getNotificationDescription = (notification) => {
  const language = i18next.language;
  let descriptionHtml = "";
  let descriptionText = "";

  if (language === "ar") {
    descriptionHtml = notification?.html_description_arabic;
    descriptionText = notification?.x_description_arabic;
  } else {
    descriptionHtml = notification.html_description;
    descriptionText = notification.description;
  }

  return { descriptionText, descriptionHtml };
};

export const getNotificationTitle = (notification) => {
  const language = i18next.language;

  return language === "ar"
    ? notification.merchant_name_arabic
    : notification.merchant_name;
};
