import i18n from "../../languages";

export const getCurrentMonthAndYear = () => {
  const monthNames = [
    i18n.t("General.january"),
    i18n.t("General.february"),
    i18n.t("General.march"),
    i18n.t("General.april"),
    i18n.t("General.may"),
    i18n.t("General.june"),
    i18n.t("General.july"),
    i18n.t("General.august"),
    i18n.t("General.september"),
    i18n.t("General.october"),
    i18n.t("General.november"),
    i18n.t("General.december"),
  ];

  const d = new Date();
  const year = d.getFullYear();
  const month = monthNames[d.getMonth()];

  return `${month} ${year}`;
};
