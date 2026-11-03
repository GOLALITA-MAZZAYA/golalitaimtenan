import { View } from "react-native";
import { StyleSheet } from "react-native";
import {
  getOffersForNestedItemsCard,
  navigateToBookNow,
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
import RoomRatesListItem from "./RoomRatesListItem";

const RoomRatesTab = ({ merchant }) => {
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
      const data = await getOffersForNestedItemsCard(
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


  console.log(data?.[0],'first')

  const items = loading ? [] : data;

  // Renders inside the merchant info screen's Tabs.ScrollView, so this must
  // not be its own scrollable/virtualized list — a FlatList here nests a
  // VirtualizedList inside a same-orientation ScrollView, which RN warns
  // breaks windowing (i.e. the virtualization was never actually effective
  // in this position anyway). Plain View + map instead.
  if (!items.length) {
    return (
      <View style={styles.contentContainerStyle}>
        {loading ? (
          <FullScreenLoader style={styles.loader} />
        ) : (
          <View style={styles.noData}>
            <TypographyText
              textColor={isDark ? colors.white : colors.darkBlue}
              size={12}
              font={BALOO_SEMIBOLD}
              title={t("General.noData")}
              style={styles.noDataText}
              numberOfLines={1}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.flatList}>
      {items.map((item) => {
        const isLiked =
          favoriteOffers?.find?.((o) => o?.id === item?.id) !== undefined;
        const name = language === "ar" ? item.x_arabic_name : item.name;

        return (
          <RoomRatesListItem
            key={item.id}
            isDark={isDark}
            uri={item.image_url}
            isLiked={isLiked}
            title={name}
            onPress={() => navigateTopProductPage(item, merchant)}
            onSavePress={() => dispatch(saveOffer(item.id, t))}
            onBookPress={() => navigateToBookNow(item, merchant)}
            price={item.value}
          />
        );
      })}
    </View>
  );
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
  flatList: {
    marginTop: 20
  },
  contentContainerStyle: {
    flexGrow: 1,
  }
});

export default RoomRatesTab;
