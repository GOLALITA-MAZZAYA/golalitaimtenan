import i18n from "../../../../languages";
import { ALL_OFFERS_ID } from "./config";

export const ALL_OFFERS_ITEM = {
  name: i18n.t("TabBar.allOffers"),
  id: ALL_OFFERS_ID,
  image_url: undefined,
};

export const transformOffersData = (offers) => {
  const transformedOffers = offers.map((offer) => ({
    ...offer,
    name: offer.name,
    image_icon: offer.image_url,
    id: offer.id,
  }));

  return transformedOffers;
};
