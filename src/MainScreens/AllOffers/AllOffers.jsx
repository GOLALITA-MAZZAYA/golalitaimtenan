import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../components/colors";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { TypographyText } from "../../components/Typography";
import { mainStyles } from "../../styles/mainStyles";
import { useTheme } from "../../components/ThemeProvider";
import { connect } from "react-redux";
import {
  getOffers,
  saveOffer,
  getFavoriteOffers,
  getGroupedByMerchantOffers,
} from "../../redux/merchant/merchant-thunks";
import { useTranslation } from "react-i18next";
import ListNoData from "../../components/ListNoData";
import CardWithNesetedItems from "../../components/OfferCardWithNestedItems";
import { getLocalizedValue } from "../../../utils";
import { getDescription, handleOfferCardPress } from "./helpres";
import { B1G1, DISCOUNT, LUSAIL_REGULAR, PROMOCODE } from "../../redux/types";

const AllOffers = ({
  offers,
  isOffersLoading,
  saveOffer,
  favoriteOffers,
  getFavoriteOffers,
  getGroupedByMerchantOffers,
  getOffers
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const canGetMoreDataRef = useRef(true);
  const language = i18n.language;

  const TABS = [
    { label: t("AllOffers.allOffers"), value: null },
    { label: t("AllOffers.b1g1Free"), value: B1G1 },
    { label: t("AllOffers.discount"), value: DISCOUNT },
    { label: t("AllOffers.promocode"), value: PROMOCODE },
  ];

  useEffect(() => {
    getFavoriteOffers(false, null);
  }, []);

  useEffect(() => {
    canGetMoreDataRef.current = true;
    setIsReady(false);

    const params = selectedFilter ? { x_offer_type: selectedFilter } : {};

    getOffers({
      page: 1,
      params,
      onGetData: (dataLength, limit) => {
        setIsReady(true);
        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  }, [selectedFilter]);

  const handleFavouritePress = (item) => {
    saveOffer(item.id, t);
  };

  const keyExtractor = (item, index) => item.id ? item.id.toString() : index.toString();

  const fetchMoreData = () => {
    if (isOffersLoading || !isReady || !canGetMoreDataRef.current) {
      return;
    }

    const params = selectedFilter ? { x_offer_type: selectedFilter } : {};

    getOffers({
      page: "next",
      params,
      onGetData: (dataLength, limit) => {
        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  };

  const renderItem = ({ item }) => {
    const isFavorite = favoriteOffers?.some((offer) => offer.id === item.id);
    const isArabic = language === "ar";

    return (
      <CardWithNesetedItems
        parentProps={{
          onPress: () => handleOfferCardPress(item, true),
          onPressFavourite: () => handleFavouritePress(item),
          uri: item.image_url,
          name: getLocalizedValue(item.x_arabic_name, item.name),
          description: getDescription(item),
          isSaved: isFavorite,
        }}
      />
    );
  };

  const activeColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const borderColor = isDark ? "#444444" : colors.grey;
  const bgColor = isDark ? "#444444" : colors.transparent;

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        ...styles.wrapper,
      }}
    >
      <SafeAreaView style={styles.safeAreaWrapper}>
        <CommonHeader
          isWhite={isDark}
          label={t("AllOffers.title")}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          style={[styles.tabsRow, { borderColor, backgroundColor: bgColor }]}
        >
          {TABS.map((tab, index) => {
            const isActive = selectedFilter === tab.value;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedFilter(tab.value)}
                style={[
                  styles.tab,
                  isActive && {
                    backgroundColor: activeColor,
                    borderRadius: 18,
                  },
                ]}
              >
                <TypographyText
                  size={12}
                  font={LUSAIL_REGULAR}
                  title={tab.label}
                  style={{ fontWeight: "700" }}
                  textColor={
                    isActive
                      ? isDark
                        ? colors.mainDarkModeText
                        : colors.white
                      : isDark
                        ? colors.white
                        : "#999CAD"
                  }
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <FlatList
          data={isReady ? offers : []}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.4}
          onEndReached={fetchMoreData}
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          initialNumToRender={20}
          ListFooterComponent={() =>
            isOffersLoading ? (
              <View style={[mainStyles.centeredRow, { marginTop: 30 }]}>
                <ActivityIndicator
                  size={"large"}
                  color={colors.mainDarkModeText}
                />
              </View>
            ) : null
          }
          style={styles.list}
          ListEmptyComponent={
            !isOffersLoading && !offers.length && (
              <ListNoData text={t("AllOffers.noOffersFound")} />
            )
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safeAreaWrapper: {
    flex: 1,
  },
  tabsRow: {
    flexGrow: 0,
    borderWidth: 1,
    borderRadius: 100,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  tabsContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  offers: state.merchantReducer.offers,
  isOffersLoading: state.loadersReducer.isOffersLoading,
  favoriteOffers: state.merchantReducer.favoriteOffers,
});

export default connect(mapStateToProps, {
  saveOffer,
  getOffers,
  getFavoriteOffers,
})(AllOffers);
