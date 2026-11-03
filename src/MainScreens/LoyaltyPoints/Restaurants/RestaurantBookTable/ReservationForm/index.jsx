import {useTranslation} from "react-i18next";
import {getRestaurantSeatingPreferences} from "../../../../../api/restaurants";
import AsyncFormikCustomSelect from "../../../../../components/Formik/AsyncFormikCustomSelect";
import FormikCounter from "../../../../../components/Formik/FormikCounter";
import FormikCustomInput from "../../../../../components/Formik/FormikCustomInput";
import FormikDate from "../../../../../components/Formik/FormikDate";
import FormikTabsSelect from "../../../../../components/Formik/FormikTabsSelect";
import AsyncFormikTimeSelect from "../AsyncTimeSelect";
import {Dimensions, SafeAreaView, ScrollView, StyleSheet} from "react-native";
import {HEADER_HEIGHT} from "../../../../../constants";
import {getOccasionOptions} from "../helpers";
import {useFormikContext} from "formik";
import Header from "../../../../../components/Header";
import Button from "../../../../../components/Button";
import {useEffect} from "react";
import ChartBlock from "../ChartBlock";
import {useDispatch} from "react-redux";
import {setReservationFields} from "../../../../../redux/restaurant/restaurant-actions";

const ReservationForm = ({restaurantId, bookingFee}) => {
    const {t} = useTranslation();
    const { values, handleSubmit, setFieldValue } = useFormikContext();
    const dispatch = useDispatch();


    const getSeatingOptionsReq = async () => {
        const data = await getRestaurantSeatingPreferences(restaurantId);
    
        return data.map(item => ({label: item.name, value: item.name, label_arabic: item.name_ar}))
    };
    
    const occasionOptions = getOccasionOptions();


    useEffect(() => {
      setFieldValue('bookingFee',bookingFee);
      dispatch(setReservationFields({bookingFee}));
    },[])


    return (
        <SafeAreaView style={{flex: 1}}>
          <Header
             label={t("Restaurants.bookTableTitle")}
              btns={['back']}
          />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
        
                        <FormikDate
                           label={t("Restaurants.dateLabel")}
                           value={values.date}
                           name="date"
                           isModal={false}
                           hasModes
                           style={{marginTop: 0}}
                        />

                        <AsyncFormikTimeSelect name="time" label={t("Restaurants.timeLabel")} restaurant_id={restaurantId} booking_date={values.date}/>

                        <FormikCounter name="guests" label={t("Restaurants.adultsLabel")} style={styles.blockMargin}/>

                        <FormikCounter name="child_count" label={t("Restaurants.childrenLabel")} style={styles.blockMargin}/>

                        <FormikTabsSelect name="occasion" label={t("Restaurants.occasionLabel")} style={styles.blockMargin} options={occasionOptions} />

                        <AsyncFormikCustomSelect getOptions={getSeatingOptionsReq} name="seating_preference_id" placeholder={t("Restaurants.seatingPreferencePlaceholder")} label={t("Restaurants.seatingPreferenceLabel")} style={styles.blockMargin} />

                        <FormikCustomInput
                          name="note"
                          label={t("Restaurants.noteLabel")}
                          placeholder={t("Restaurants.notePlaceholder")}
                          wrapperStyle={{...styles.blockMargin, height: 120}}
                          inputStyle={{paddingTop: 20}}
                          multiline={true}
                          numberOfLines={4}
                          textAlignVertical="top"
                        />

          <ChartBlock 
              type="reservation"
              style={styles.chart}
          />

         <Button
              onPress={handleSubmit}
              text={t("Restaurants.continue")}
              style={styles.submitBtn}
         />

                       
        </ScrollView>


        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
     list: {
       paddingHorizontal: 20
     },
     blockMargin: {
        marginTop: 20
     },
     submitBtn: {
        marginBottom: 20,
        marginTop: 20
     },
     contentContainerStyle: {
        paddingBottom: 0,
        paddingHorizontal: 20,
     },
     loader: {
         width: "100%",
         height: Dimensions.get("window").height,
         top: -HEADER_HEIGHT,
    },
    chart: {
      marginTop: 20,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12
    },
    scrollView: {

    }
});


export default ReservationForm;