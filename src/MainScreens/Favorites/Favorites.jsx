import React, { useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import ProductItem from "../../components/ProductItem/ProductItem";
import { mainStyles } from "../../styles/mainStyles";
import { colors } from "../../components/colors";
import { useTheme } from "../../components/ThemeProvider";
import { connect } from "react-redux";
import { getFavoriteOffers } from "../../redux/merchant/merchant-thunks";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import ListNoData from "../../components/ListNoData";

const Favorites = ({ favoriteOffers, isOffersLoading, getFavoriteOffers }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    getFavoriteOffers(false);
  }, []);

  const handleBackPress = () => {
    navigation.navigate("Main");
  };

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        flex: 1,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CommonHeader
          isWhite={isDark}
          label={t("Favorites.favorites")}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
          onBackPress={handleBackPress}
        />
        <ScrollView
          style={{ marginTop: 16 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {isOffersLoading ? (
            <View style={[mainStyles.centeredRow, { flexGrow: 1 }]}>
              <ActivityIndicator size={"large"} color={colors.green} />
            </View>
          ) : (
            favoriteOffers?.map?.((offer, index) => (
              <ProductItem key={index} product={offer} isSaved={true} />
            ))
          )}
          {!isOffersLoading && !favoriteOffers?.length && (
            <ListNoData text={t("AllOffers.listNoData")} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  favoriteOffers: state.merchantReducer.favoriteOffers,
  isOffersLoading: state.loadersReducer.isOffersLoading,
});

export default connect(mapStateToProps, { getFavoriteOffers })(Favorites);
