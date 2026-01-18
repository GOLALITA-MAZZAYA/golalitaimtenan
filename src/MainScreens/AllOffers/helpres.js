import i18next from "i18next";
import { getStringDate, isRTL } from "../../../utils";
import { getMerchantDetails, getOffers } from "../../api/merchants";
import i18n from "../../languages";
import { navigate } from "../../Navigation/RootNavigation";
import store from "../../redux/store";
import { B1G1 } from "../../redux/types";

export const handleOfferCardPress = (item, isOfferList) => {
  if (isOfferList) {
    navigate("offer-info", {
      productId: item.id,
      title: isRTL() ? item.x_arabic_name : item.name,
    });

    return;
  }

  navigate("AllOffers", {
    screen: "offer-info",
    params: {
      productId: item.id,
      title: isRTL() ? item.x_arabic_name : item.name,
    },
  });
};

export const navigateToBookNow = (offer, merchant) => {
  navigate("BookHotel", {
    productId: offer.id,
    title: isRTL() ? offer.x_arabic_name : offer.name,
    merchant_id: merchant.merchant_id,
    name: offer.merchant_name,
    email: merchant.email,
    product_id: offer.product_id,
    product_name: offer.name,
    product_price: offer.price,
  });
};

export const navigateTopProductPage = (offer, merchant) => {
  console.log(merchant.is_business_hotel, "merchant.is_business_hotel");
  console.log(offer, "offer");

  navigate("AllOffers", {
    screen: "offer-info",
    params: {
      productId: offer.id,
      title: isRTL() ? offer.x_arabic_name : offer.name,
      merchant,
      bookNow: merchant.is_business_hotel ? "true" : "false",
    },
  });

  return;

  // navigate("ProductPage", {
  //   product: {
  //     ...offer,
  //     merchant_logo: offer.merchant_logo,
  //     merchant_id: merchant.merchant_id,
  //     merchant_name: offer.merchant_name,
  //   },
  // });
};

export const getInfoText = (offer, merchant) => {
  if (merchant.is_business_hotel || offer.is_business_hotel) {
    return i18n.t("Merchants.details");
  }

  if (offer.x_offer_type_promo_code) {
    return i18n.t("Merchants.promoCode");
  }

  if (offer.x_offer_type === B1G1) {
    return i18n.t("Merchants.b1g1Free");
  }

  return "";
};

export const getDescription = (offer) => {
  return i18next.language === "ar" ? offer.x_label_arabic : offer.offer_label;
};

export const handleInfoTextPress = (offer, merchant) => {
  if (merchant.is_business_hotel || offer.is_business_hotel) {
    if (merchant.is_business_hotel) {
      navigate("AllOffers", {
        screen: "offer-info",
        params: {
          productId: offer.id,
          title: isRTL() ? offer.x_arabic_name : offer.name,
          merchant,
          bookNow: "true",
        },
      });

      return;
    }
  }

  if (offer.x_offer_type_promo_code) {
    navigate("Voucher", {
      name: offer.name,
      id: offer.id,
      merchant_name: offer.merchant_name,
      expiryDate: offer.end_date
        ? getStringDate(offer.end_date.split(" ")[0])
        : null,
      merchant_logo: offer.merchant_logo,
      promocode: offer.x_offer_type_promo_code,
      merchant_id: offer.merchant_id,
    });

    return;
  }

  if (offer.x_offer_type === B1G1) {
    navigate("Promocode", {
      merchant_name: offer.merchant_name,
      name: offer.name,
      expiryDate: offer.end_date
        ? getStringDate(offer.end_date.split(" ")[0])
        : null,
      merchant_logo: offer.merchant_logo,
      id: offer.id,
      promocode: offer.x_offer_type_promo_code,
      merchant_id: offer.merchant_id,
    });
  }
};

export const getOffersForNestedItemsCard = async (merchant, type) => {
  const user = store.getState().authReducer.user;

  if (merchant?.is_business_hotel || merchant.is_hotel || type === "all") {
    const merchantDetails = await getMerchantDetails({
      merchant_id: merchant.merchant_id || merchant.id,
      x_for_employee_type: user?.employee_type,
    });

    const productsAndOffers = [
      ...merchantDetails.offer_products,
      ...merchantDetails.products,
    ];

    const transformedData = productsAndOffers.map((item) => ({
      ...item,
      value: item.list_price,
      uri: item.image_url,
    }));

    return transformedData;
  }

  console.log(merchant.merchant_id,'merchant.merchant_id')

  let offers = await getOffers(merchant.merchant_id || merchant.id);

  console.log(offers,'offers offers')

  if (type === B1G1) {
    offers = offers.filter((o) => o.x_offer_type === B1G1);
  }

  const transformedOffers = offers?.map((offer) => ({
    ...offer,
    value: offer.list_price,
    name: offer.name,
    uri: offer.image_url,
  }));

  return transformedOffers;
};
