import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../../components/ThemeProvider";
import { BALOO_SEMIBOLD } from "../../../../../redux/types";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import CardWithNesetedItems from "../../../../../components/CardWithNestedItems";
import { saveOffer } from "../../../../../redux/merchant/merchant-thunks";
import {
  getAllOffersByMeerchantId,
  getOffers,
} from "../../../../../api/merchants";
import {
  getOffersForNestedItemsCard,
  navigateTopProductPage,
} from "../../../helpres";
import { getCacheBustedUri, getStringDate, isRTL } from "../../../../../../utils";

const OffersTab = ({
  offers: propOffers,
  loading: propLoading,
  merchantId,
  offerId,
  merchant,
  offer,
}) => {
  const isControlled = Array.isArray(propOffers);
  const [internalLoading, setInternalLoading] = useState(!isControlled);
  const [internalData, setInternalData] = useState([]);
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = isControlled ? propLoading : internalLoading;
  const data = isControlled ? propOffers : internalData;

  const favoriteOffers = useSelector(
    (state) => state.merchantReducer.favoriteOffers
  );

  const fetchMerchantOffers = async () => {
    if (isControlled) return;

    try {
      setInternalLoading(true);
      const mId =
        merchantId || merchant?.merchant_id || merchant?.id || offer?.merchant_id;

      if (!mId) {
        setInternalData([]);
        return;
      }

      const filterOffers = (items) => {
        if (!Array.isArray(items)) return [];
        return items.filter(
          (item) =>
            String(item.id) !== String(offerId) &&
            String(item.product_id) !== String(offerId)
        );
      };

      const inlineOffers = [
        ...(Array.isArray(merchant?.offer_products)
          ? merchant.offer_products
          : []),
        ...(Array.isArray(merchant?.products) ? merchant.products : []),
      ];

      if (inlineOffers.length > 0) {
        const filtered = filterOffers(
          inlineOffers.map((item) => ({
            ...item,
            uri: item.image_url || item.uri,
            value: item.list_price ?? item.value,
          }))
        );
        setInternalData(filtered);
        return;
      }

      try {
        const res = await getAllOffersByMeerchantId(mId);
        const filtered = filterOffers(res);
        if (filtered.length > 0) {
          setInternalData(filtered);
          return;
        }
      } catch (e) {
        console.log("[OffersTab] getAllOffersByMeerchantId error:", e);
      }

      try {
        const res2 = await getOffers(mId);
        if (Array.isArray(res2) && res2.length > 0) {
          const mapped = res2.map((item) => ({
            ...item,
            uri: item.image_url || item.uri,
            value: item.list_price ?? item.value,
          }));
          const filtered = filterOffers(mapped);
          setInternalData(filtered);
          return;
        }
      } catch (e) {
        console.log("[OffersTab] getOffers error:", e);
      }

      if (merchant?.is_hotel || merchant?.is_business_hotel) {
        try {
          const hotelOffers = await getOffersForNestedItemsCard(merchant, "all");
          const filtered = filterOffers(hotelOffers);
          setInternalData(filtered);
          return;
        } catch (e) {
          console.log("[OffersTab] hotel offers error:", e);
        }
      }

      setInternalData([]);
    } catch (err) {
      console.log("[OffersTab] fetchMerchantOffers error:", err);
      setInternalData([]);
    } finally {
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    if (!isControlled) {
      fetchMerchantOffers();
    }
  }, [
    isControlled,
    merchantId,
    offerId,
    merchant?.merchant_id,
    merchant?.id,
    offer?.merchant_id,
  ]);

  const handleFavouritePress = (item) => {
    dispatch(saveOffer(item.id, t));
  };

  const handleCardPress = (item) => {
    const merchantDetails =
      merchant && (merchant.id || merchant.merchant_id)
        ? merchant
        : {
            id: offer?.merchant_id,
            merchant_id: offer?.merchant_id,
            name: offer?.merchant_name,
            merchant_name: offer?.merchant_name,
            merchant_name_arabic: offer?.merchant_name_arabic,
            merchant_logo: offer?.merchant_logo,
            merchant_phone: offer?.merchant_phone,
            merchant_email: offer?.merchant_email,
          };

    if (navigation?.push) {
      navigation.push("offer-info", {
        productId: item.id,
        title: isArabic ? item.x_arabic_name || item.name : item.name,
        merchant: merchantDetails,
        bookNow:
          merchantDetails?.is_business_hotel || merchantDetails?.is_hotel
            ? "true"
            : "false",
      });
    } else {
      navigateTopProductPage(item, merchantDetails);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={isDark ? colors.mainDarkMode : colors.darkBlue}
        />
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={styles.noData}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={14}
          font={BALOO_SEMIBOLD}
          title={t("AllOffers.noOffersFound", "No Offers found")}
          style={styles.noDataText}
          numberOfLines={1}
        />
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {data.map((item, index) => {
        const isFavorite = favoriteOffers?.some((o) => o?.id === item.id);
        const ribbonText = isArabic
          ? item.x_label_arabic || item.disc_ribbon || item.offer_label || ""
          : item.offer_label || item.disc_ribbon || item.x_label_arabic || "";

        return (
          <CardWithNesetedItems
            key={item.id ? `offer-${item.id}` : `offer-idx-${index}`}
            parentProps={{
              onPress: () => handleCardPress(item),
              onPressFavourite: () => handleFavouritePress(item),
              uri: getCacheBustedUri(
                item.uri ||
                  item.image_url ||
                  merchant?.merchant_logo ||
                  offer?.merchant_logo
              ),
              name: isArabic ? item.x_arabic_name || item.name : item.name,
              description: ribbonText,
              endDate: item.end_date
                ? getStringDate(item.end_date.split(" ")[0])
                : null,
              isSaved: isFavorite,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  noData: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  noDataText: {
    textAlign: "center",
  },
  list: {
    marginTop: 10,
  },
});

export default OffersTab;
