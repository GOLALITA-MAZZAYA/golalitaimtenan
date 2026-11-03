import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import {HEADER_HEIGHT} from "../../../../constants";
import FormikCustomInput from "../../../../components/Formik/FormikCustomInput";
import * as Yup from "yup";
import Header from "../../../../components/Header";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import Button from "../../../../components/Button";
import {useDispatch, useSelector} from "react-redux";
import {restaurantBook, updateOrderThunk} from "../../../../redux/restaurant/restaurant-thunks";
import {restaurantLoadingSelector} from "../../../../redux/restaurant/restaurant-selectors";
import {setDeliveryFields} from "../../../../redux/restaurant/restaurant-actions";
import DeliveryAddressMap from "./DeliveryAddressMap";
import {cleanObject} from "../../../../helpers";
import {showMessage} from "react-native-flash-message";
import {getLocation} from "../../../../api/global";

const RestaurantDeliveryAddress = ({ route, navigation }) => {
  const restaurantId = route?.params?.restaurantId;
  const orderId = route?.params?.orderId;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector(restaurantLoadingSelector);

  const handleSubmit = async (formValues) => {
    try{

     // If we have order orderId it means we updating order
     if(orderId){
        const values = cleanObject(formValues)

        const deliveryCoordinates = await getLocation(values.zone_number, values.street_number, values.building_number);

        
       if(deliveryCoordinates?.error){
         showMessage({
            type: 'danger',
            message: deliveryCoordinates.error
         })

         return
       }
        
       const {latitude, longitude} = deliveryCoordinates.data;

       const res = await dispatch(updateOrderThunk({...values, order_id: orderId, latitude, longitude}));

       console.log(res,'res update res')

        if(res.success){

            showMessage({
                type: 'success',
                message: 'You successfully updated order'
            })

        navigation.reset({
            index: 0,
            routes: [{ name: 'bookings-list'}],
        });
        }
        
        return
     }

       const deliveryCoordinates = await getLocation(formValues.zone_number, formValues.street_number, formValues.building_number);

       console.log(deliveryCoordinates,'deliveryCoordinates')

       if(deliveryCoordinates?.error){
         showMessage({
            type: 'danger',
            message: deliveryCoordinates.error
         })

         return
       }

       const {latitude, longitude} = deliveryCoordinates.data;
     
      // If we do. not have orderId it means we creating order
      dispatch(setDeliveryFields({...formValues, latitude, longitude}))
      dispatch(restaurantBook(restaurantId));
    }catch(err){
      console.log(err,'error submit location')
        showMessage({
            type: 'danger',
            message: t('General.error')
        })
    }
  };
  

  return (
    <Formik
      initialValues={{
        unit_number: '',
        building_number: '',
        zone_number: '',
        street_number: '',
        latitude: '',
        longitude: '',
      }}
      validationSchema={Yup.object({
        unit_number: Yup.string().required(t("Login.required")),
        building_number: Yup.string().required(t("Login.required")),
        zone_number: Yup.string().required(t("Login.required")),
        street_number: Yup.string().required(t("Login.required")),
     })}
      onSubmit={handleSubmit}
    >
      {({
        values,
        handleSubmit,
        errors,
        submitCount,
      }) => {
        errors = submitCount > 0 ? errors : {};

        console.log(errors,'errors')
        return (
          <>
                <Header
                  label={t('Restaurants.deliveryAddressTitle')}
                  btns={['back']}
                />
 
                  <ScrollView
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainerStyle}
                  >

                      <DeliveryAddressMap label={t('Restaurants.locationLabel')} />

                      <FormikCustomInput
                          name="unit_number"
                          label={t('Restaurants.unitLabel')}
                          placeholder={t('Restaurants.unitPlaceholder')}
                          wrapperStyle={{...styles.blockMargin}}
                          textAlignVertical="top"
                        />

                      <FormikCustomInput
                          name="building_number"
                          label={t('Restaurants.buildingLabel')}
                          placeholder={t('Restaurants.buildingPlaceholder')}
                          wrapperStyle={{...styles.blockMargin}}
                          textAlignVertical="top"
                        />

                       <FormikCustomInput
                          name="zone_number"
                          label={t('Restaurants.zoneLabel')}
                          placeholder={t('Restaurants.zonePlaceholder')}
                          wrapperStyle={{...styles.blockMargin}}
                          textAlignVertical="top"
                        />

                        <FormikCustomInput
                          name="street_number"
                          label={t('Restaurants.streetLabel')}
                          placeholder={t('Restaurants.streetPlaceholder')}
                          wrapperStyle={{...styles.blockMargin}}
                          textAlignVertical="top"
                        />

                        <Button
                          onPress={handleSubmit}
                          text={t("Restaurants.confirm")}
                          style={styles.submitBtn}
                        />

                  </ScrollView> 

                  {loading && <FullScreenLoader absolutePosition style={styles.loader}/>}
          </>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
     list: {
       paddingHorizontal: 20
     },
     blockMargin: {
        marginTop: 20
     },
     submitBtn: {
        marginTop: 27
     },
     contentContainerStyle: {
        paddingBottom: 60,
     },
     loader: {
         width: "100%",
         height: Dimensions.get("window").height,
         top: -HEADER_HEIGHT,
    },
});


export default RestaurantDeliveryAddress;
