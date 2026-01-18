import { FlatList, View } from "react-native";
import { StyleSheet } from "react-native";
import {
  getOffersForNestedItemsCard,
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
          onPress={() => navigateTopProductPage(item, merchant)}
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

export default RoomRatesTab;
