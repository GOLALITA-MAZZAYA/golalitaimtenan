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

  const offerCount = Number(
    merchant?.offer_count ?? merchant?.offers_count ?? 0
  );
  const hasOffers = Boolean(merchant?.x_have_offers || offerCount > 0);

  if (hasOffers) {
    const isArabic = i18next.language === "ar";
    let offersLabel = "";

    if (offerCount > 0) {
      if (isArabic) {
        offersLabel = `${offerCount} عروض`;
      } else {
        offersLabel = `${offerCount} ${offerCount === 1 ? "Offer" : "Offers"}`;
      }
    } else {
      offersLabel = isArabic ? "عروض" : "Offers";
    }

    btnsConfig.push({
      hideText: offersLabel,
      showText: offersLabel,
      type: "offers",
      count: offerCount,
      isBookNow: false,
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
