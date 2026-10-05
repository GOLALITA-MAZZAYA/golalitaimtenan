import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../components/ThemeProvider";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import { colors } from "../../../../components/colors";
import CardWithNesetedItems from "../../../../components/CardWithNestedItems";
import {
  handleOfferCardPress,
  navigateTopProductPage,
} from "../../../AllOffers/helpres";
import { saveOffer } from "../../../../redux/merchant/merchant-thunks";
import { getAllOffersByMeerchantId } from "../../../../api/merchants";
import { getStringDate, isRTL } from "../../../../../utils";

const OfferTab = ({ merchant, initialOffers }) => {
  const filteredInitial = Array.isArray(initialOffers) ? initialOffers : [];

  const [loading, setLoading] = useState(
    !Array.isArray(initialOffers) || initialOffers.length === 0
  );
  const [data, setData] = useState(filteredInitial);
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();
  const dispatch = useDispatch();

  const favoriteOffers = useSelector(
    (state) => state.merchantReducer.favoriteOffers
  );

  const fetchMerchantOffers = async () => {
    try {
      setLoading(true);
      const merchantId = merchant?.merchant_id || merchant?.id;

      // Offers are sourced only from /user/offers/v3
      if (merchantId) {
        const res = await getAllOffersByMeerchantId(merchantId);
        if (Array.isArray(res) && res.length > 0) {
          setData(res);
          return;
        }
      }

      setData([]);
    } catch (err) {
      console.log("[OfferTab] fetchMerchantOffers error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(initialOffers) && initialOffers.length > 0) {
      setData(initialOffers);
      setLoading(false);
      return;
    }
    fetchMerchantOffers();
  }, [merchant?.merchant_id, merchant?.id, initialOffers]);

  const handleFavouritePress = (item) => {
    dispatch(saveOffer(item.id, t));
  };

  const handleCardPress = (item) => {
    if (merchant) {
      navigateTopProductPage(item, merchant);
    } else {
      handleOfferCardPress(item, true);
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

  const displayedOffers = Array.isArray(data) ? data : [];

  if (!displayedOffers?.length) {
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
      {displayedOffers.map((item, index) => {
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
              uri: item.uri || item.image_url || merchant?.merchant_logo,
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

export default OfferTab;
