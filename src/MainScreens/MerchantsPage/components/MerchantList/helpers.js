import i18next from "i18next";

export const getOffersCountLabel = merchant => {
  const offerCount = Number(
    merchant?.offer_count ?? merchant?.offers_count ?? 0,
  );
  const hasOffers = Boolean(merchant?.x_have_offers || offerCount > 0);

  if (!hasOffers) {
    return "";
  }

  const isArabic = i18next.language === "ar";

  if (offerCount > 0) {
    if (isArabic) {
      return `${offerCount} عروض`;
    }

    return `${offerCount} ${offerCount === 1 ? "Offer" : "Offers"}`;
  }

  return isArabic ? "عروض" : "Offers";
};

export const getToggleBtns = (merchant, isB1G1) => {
  const isOrganization = merchant.org_name;
  const isBusinessHotel = merchant.is_business_hotel;

  if (isOrganization) {
    return [];
  }

  // Hotels / B1G1: Room details (Book Now) expands nested offers.
  if (isBusinessHotel || isB1G1) {
    return [
      {
        hideText: i18next.t("Merchants.bookNow"),
        showText: i18next.t("Merchants.bookNow"),
        type: "offers",
        isBookNow: true,
      },
    ];
  }

  const btnsConfig = [];

  // Offers count is shown on the card (offersLabel), not as a toggle —
  // same as QLM, so the only expandable control here is branches.
  if (merchant?.x_have_branch) {
    btnsConfig.push({
      hideText: i18next.t("AllOffers.hideAllBranches"),
      showText: i18next.t("AllOffers.showAllBranches"),
      type: "branches",
    });
  }

  return btnsConfig;
};
