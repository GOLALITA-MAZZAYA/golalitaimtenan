import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import Header from "../../../../components/Header";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {HEADER_HEIGHT} from "../../../../constants";
import FoodList from "../RestaurantBookTable/FoodList";
import {colors} from "../../../../components/colors";
import {BALOO_2} from "../../../../redux/types";
import {TypographyText} from "../../../../components/Typography";
import {useDispatch, useSelector} from "react-redux";
import {restaurantBook, updateReservationThunk} from "../../../../redux/restaurant/restaurant-thunks";
import {restaurantLoadingSelector} from "../../../../redux/restaurant/restaurant-selectors";
import ChartBlock from "../RestaurantBookTable/ChartBlock";
import {showMessage} from "react-native-flash-message";

const RestaurantReservationFoodList = ({ route, navigation }) => {
  const restaurantId = route?.params?.restaurantId;
  const bookingId = route?.params?.bookingId;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector(restaurantLoadingSelector);

  const handleSubmit = async () => {
    if(bookingId){

      const res = await dispatch(updateReservationThunk(bookingId));

      if(res.success){

        showMessage({
            type: "success",
            message: t('Restaurants.resubmitOrderSuccess')
        })

        navigation.reset({
            index: 0,
            routes: [{ name: 'bookings-list'}],
         });  

      }

      return
    }


    dispatch(restaurantBook(restaurantId));
  };

  
  return (
          <>

                <View style={styles.wrapper}>
                    <FoodList 
                       restaurantId={restaurantId}
                       formName={'reservation'}
                       renderHeader={() => (
                        <View>
                          <Header
                            label={t('Restaurants.offers')}
                            btns={['back']}
                          />
                        
                        </View>
                       )}
                    />
            
                    <ChartBlock type="reservation" onPress={handleSubmit} title={t('Restaurants.orderChart')} submitBtnText={t('Restaurants.confirm')} isDisabled={false}/>

                </View>

                {loading && <FullScreenLoader absolutePosition style={styles.loader}/>}
          </>
        );
};

const styles = StyleSheet.create({
     wrapper: {
       flex: 1,
     },
     loader: {
         width: "100%",
         height: Dimensions.get("window").height,
         top: -HEADER_HEIGHT,
    },
    title: {
      margin: 20
    },
    submitBtn: {
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    }
});


export default RestaurantReservationFoodList;
