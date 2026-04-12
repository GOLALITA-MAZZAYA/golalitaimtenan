import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { TypographyText } from "../Typography";
import PremiumSvg from "../../assets/premium.svg";
import {
  mainStyles,
} from "../../styles/mainStyles";
import { colors } from "../colors";
import { LUSAIL_REGULAR } from "../../redux/types";
import { sized } from "../../Svg";
import { useTranslation } from "react-i18next";
import { isRTL } from "../../../utils";
import { getPremiumMerchants } from "../../api/merchants";
import CardWithNesetedItems from "../CardWithNestedItems";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavourites } from "../../redux/merchant/merchant-thunks";
import ListNoData from "../ListNoData";
import FullScreenLoader from "../Loaders/FullScreenLoader";
import { HEADER_HEIGHT } from "../../constants";
import { getToggleBtns } from "../../MainScreens/MerchantsPage/components/MerchantList/helpers";
import OfferItem from "../../MainScreens/MerchantsPage/components/OfferItem";
import BranchItem from "../../MainScreens/MerchantsPage/components/BranchItem";

import useMerchantDiscount from "../../hooks/useMerchantDiscount";
import useRoadDistance from "../../hooks/useRoadDistance";
import { userLocationSelector } from "../../redux/global/global-selectors";

const PremiumIcon = sized(PremiumSvg, 24, 24, "white");

const NewMerchants = (props) => {
  const { title, onPress, isDark } = props;
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const { favouriteMerchants } = useSelector(
    (state) => state.favouriteMerchantsReducer
  );

  const userLocation = useSelector(userLocationSelector);

  const language = i18n.language;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const favouriteMap = useMemo(() => {
    const map = new Set();
    favouriteMerchants.forEach((m) => map.add(m.merchant_id));
    return map;
  }, [favouriteMerchants]);

  useEffect(() => {
    getPremiumMerchants()
      .then(setData)
      .catch((error) => {
        console.error("Error fetching premium merchants:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderLocalClient = useCallback(
    ({ item }) => {
      return (
        <MerchantItem
          item={item}
          language={language}
          onPress={onPress}
          dispatch={dispatch}
          isSaved={favouriteMap.has(item.merchant_id)}
          userLocation={userLocation}
        />
      );
    },
    [language, favouriteMap, userLocation]
  );

  return (
    <View style={styles.wrapper}>
      {!!title && (
        <View
          style={[
            mainStyles.row,
            styles.titleWrapper,
            { alignSelf: isRTL() ? "flex-end" : "flex-start" },
          ]}
        >
          <PremiumIcon color="white" />

          <TypographyText
            textColor={isDark ? colors.white : "#000"}
            size={20}
            font={LUSAIL_REGULAR}
            title={title}
            style={{ marginHorizontal: 12 }}
          />
        </View>
      )}

      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={renderLocalClient}
        keyExtractor={(item) => `${item.merchant_id}`}
        contentContainerStyle={styles.contentContainerStyle}
        ListFooterComponent={
          loading ? <FullScreenLoader style={styles.loader} /> : null
        }
        ListEmptyComponent={
          !loading ? <ListNoData style={styles.loader} /> : null
        }
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={10}
      />
    </View>
  );
};

const MerchantItem = React.memo(
  ({ item, language, onPress, dispatch, isSaved, userLocation }) => {
    const isOrganization = item.org_name;
    const isBusinessHotel = item.is_business_hotel;

    const toggleBtns = getToggleBtns(item);

    const isOffersVisible = !isOrganization;
    const isBranchesVisible = !isOrganization && !isBusinessHotel;

    const { loading, discount } = useMerchantDiscount(item.merchant_id);

    const { distance, distaceLoading } = useRoadDistance(
      userLocation?.longitude,
      userLocation?.latitude,
      item.partner_longitude,
      item.partner_latitude
    );

    return (
      <CardWithNesetedItems
        toggleBtns={toggleBtns}
        onPress={() => onPress(item.merchant_id)}
        parentProps={{
          onPress: () => onPress(item.merchant_id),
          uri: item.merchant_logo,
          name:
            language === "ar"
              ? item?.x_arabic_name
              : item.merchant_name,

          description:
            language === "ar"
              ? discount?.x_ribbon_text_arabic || ""
              : discount?.ribbon_text || "",

          loadingDescription: loading,

          premium: true,

          distance,
          distaceLoading,

          latitude: item.partner_latitude,
          longitude: item.partner_longitude,

          onPressFavourite: () =>
            dispatch(toggleFavourites(item.merchant_id)),

          isSaved,
        }}
      >
        {isOffersVisible && (
          <OfferItem merchant={item} type={"offers"} />
        )}

        {isBranchesVisible && (
          <BranchItem merchantId={item.merchant_id} type={"branches"} />
        )}
      </CardWithNesetedItems>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  titleWrapper: {
    marginBottom: 16,
  },
  item: {
    width: "100%",
    marginBottom: 11,
    position: "relative",
    flexDirection: "row",
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 160,
  },
  loader: {
    width: "100%",
    height: Dimensions.get("window").height,
    top: -HEADER_HEIGHT,
  },
});

export default NewMerchants;