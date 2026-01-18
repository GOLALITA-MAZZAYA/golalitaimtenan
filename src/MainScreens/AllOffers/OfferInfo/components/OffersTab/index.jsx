import { FlatList, View } from "react-native";
import { StyleSheet } from "react-native";
import {
  getOffersForNestedItemsCard,
  handleOfferCardPress,
} from "../../../helpres";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../components/ThemeProvider";
import { BALOO_SEMIBOLD } from "../../../../../redux/types";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import FullScreenLoader from "../../../../../components/Loaders/FullScreenLoader";
import { saveOffer } from "../../../../../redux/merchant/merchant-thunks";
import RoomRatesListItem from "../../../../PremiumPartner/MerchantInfo/RoomRatesTab/RoomRatesListItem";


const OffersTab = ({ merchantId, offerId, type }) => {
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

      console.log(offerId,'offerId');
      console.log(type,'offer type')

      const data = await getOffersForNestedItemsCard(
        {merchant_id: merchantId, type }
      );

      const filteredData = data.filter(item => +item.id !== +offerId);

      setData(filteredData);
    } catch (err) {
      console.log(err.message, "get offers error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffers();
  }, [merchantId, type]);



    return  (
    <FlatList 
        style={styles.flatList}
        contentContainerStyle={styles.contentContainerStyle}
        data={loading ? [] : data}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={({item}) => {

       const isLiked =
        favoriteOffers?.find?.((o) => o?.id === item?.id) !== undefined;

       const discRibbon =
        language === "ar" ? item.x_label_arabic : item.offer_label;
       const name = language === "ar" ? item.x_arabic_name : item.name;

        return (
         <RoomRatesListItem
          isDark={isDark}
          uri={item.image_url}
          isLiked={isLiked}
          title={name}
          description={discRibbon}
          onPress={() => handleOfferCardPress(item, true)}
          onSavePress={() => dispatch(saveOffer(item.id, t))}
        />
        )
        }}
        ListEmptyComponent={() => {
          if(loading){
            return  <FullScreenLoader style={styles.loader} />
          }
         

          return (
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
          )
        }}
      />
    )
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

export default OffersTab;
