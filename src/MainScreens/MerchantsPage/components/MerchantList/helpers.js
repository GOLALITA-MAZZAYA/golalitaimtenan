import i18next from "i18next";

export const getToggleBtns = (merchant, isB1G1) => {
  const isOrganization = merchant.org_name;
  const isBusinessHotel = merchant.is_business_hotel;

  if (isOrganization) {
    return [];
  }

  if (isBusinessHotel || isB1G1) {
    return [
      {
        hideText: i18next.t("Merchants.bookNow"),
        showText: i18next.t("Merchants.bookNow"),
        type: "offers",
      },
    ];
  }

  const btnsConfig = [];

  if (merchant.x_have_offers) {
    btnsConfig.push({
      hideText: i18next.t("AllOffers.hideAllOffers"),
      showText: i18next.t("AllOffers.showAllOffers"),
      type: "offers",
    });
  }

  if (merchant.x_have_branch) {
    btnsConfig.push({
      hideText: i18next.t("AllOffers.hideAllBranches"),
      showText: i18next.t("AllOffers.showAllBranches"),
      type: "branches",
    });
  }

  return btnsConfig;
};
