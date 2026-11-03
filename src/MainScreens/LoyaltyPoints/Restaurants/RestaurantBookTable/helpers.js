import i18next from "i18next";
import {OCCASION_CONSTANTS} from "./config"


export const getSeatingOptions = () => {
    return [
        {
            label: i18next.t('Restaurants.indoor'),
            label_arabic: i18next.t('Restaurants.indoor'),
            value: i18next.t('Restaurants.indoor')
        },
        {
            label: i18next.t('Restaurants.outdoor'),
            label_arabic: i18next.t('Restaurants.outdoor'),
            value: i18next.t('Restaurants.outdoor')
        },
        {
            label: i18next.t('Restaurants.rooftop'),
            label_arabic: i18next.t('Restaurants.rooftop'),
            value: i18next.t('Restaurants.rooftop')
        },
    ]
};

export const getOccasionOptions = () => {
    return [
        {
            label: i18next.t('Restaurants.casual'),
            label_arabic: i18next.t('Restaurants.casual'),
            value: OCCASION_CONSTANTS.CASUAL
        },
        {
            label: i18next.t('Restaurants.anniversary'),
            label_arabic: i18next.t('Restaurants.anniversary'),
            value: OCCASION_CONSTANTS.ANNIVERSARY
        },
        {
            label: i18next.t('Restaurants.birthday'),
            label_arabic: i18next.t('Restaurants.birthday'),
            value: OCCASION_CONSTANTS.BIRTHDAY
        },
        {
            label: i18next.t('Restaurants.bussines'),
            label_arabic: i18next.t('Restaurants.bussines'),
            value: OCCASION_CONSTANTS.BUSSINESS
        },
    ]
};

export const getDateString = (date) => {
    if (!date.getFullYear) return "";
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };