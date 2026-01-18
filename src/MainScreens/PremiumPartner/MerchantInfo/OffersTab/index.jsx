import { View } from "react-native";
import { StyleSheet } from "react-native";
import {
  handleInfoTextPress,
  navigateTopProductPage,
} from "../../../AllOffers/helpres";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../components/ThemeProvider";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import { colors } from "../../../../components/colors";
import { TypographyText } from "../../../../components/Typography";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { saveOffer } from "../../../../redux/merchant/merchant-thunks";
import OfferItem from "./components/OfferItem";
import { getTranslationForOfferType } from "../../../../helpers";
import { getAllOffersByMeerchantId } from "../../../../api/merchants";

const OfferTab = ({ merchant }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const dispatch = useDispatch();

  const favoriteOffers = useSelector(
    (state) => state.merchantReducer.favoriteOffers
  );

  const getOffers = async () => {
    try {
      setLoading(true);
      const data = await getAllOffersByMeerchantId(
        merchant
      );

      setData(data);
    } catch (err) {
      console.log(err.message, "get offers error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffers(merchant);
  }, []);

  if (loading) {
    return <FullScreenLoader style={styles.loader} />;
  }

  if (!loading && !data?.length) {
    const noDataText = t("General.noData");

    return (
      <View style={styles.noData}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={12}
          font={BALOO_SEMIBOLD}
          title={noDataText}
          style={styles.noDataText}
          numberOfLines={1}
        />
      </View>
    );
  }

  if (!loading && data?.length) {
    return data.map((item, i) => {
      const isLiked =
        favoriteOffers?.find?.((o) => o?.id === item?.id) !== undefined;

      const discRibbon =
        language === "ar" ? item.x_label_arabic : item.offer_label;
      const name = language === "ar" ? item.x_arabic_name : item.name;
      const type = getTranslationForOfferType(item.x_offer_type);

      return (
        <OfferItem
          key={i}
          name={name}
          isLiked={isLiked}
          type={type}
          discRibbon={discRibbon}
          onItemPress={() => navigateTopProductPage(item, merchant)}
          onSavePress={() => dispatch(saveOffer(item.id, t))}
          onInfoItemPress={() => handleInfoTextPress(item, merchant)}
        />
      );
    });
  }
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  noData: {
    flexDirection: "row",
    marginTop: 30,
  },
});

export default OfferTab;
