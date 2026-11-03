import { ScrollView, StyleSheet } from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import {useTranslation} from "react-i18next";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import AppointmentCard from "../../../../components/AppointmentCard";
import Button from "../../../../components/Button";
import {useState} from "react";
import {showMessage} from "react-native-flash-message";
import {canCancelAppointment, canReBookAppointment} from "../helpers";
import {isRTL} from "../../../../../utils";
import useBookTableDetails from "../hooks/useBookTableDetails";
import {confirmAction} from "../../../../helpers";
import AppointmentCardValue from "../../../../components/AppointmentCard/AppointmentCardValue";
import {restaurantBookingCancel} from "../../../../api/restaurants";

const RestaurantBookTableDetails = ({route, navigation}) => {
    const booking_reference = route.params.booking_reference;

    const {data, loading, error} = useBookTableDetails(booking_reference);
    const [cancelLoading, setCancelLoading] = useState(false);
    const {t} = useTranslation();
    const isRtl = isRTL();

    const handleCancelAppointment = async () => {
        let res;

        try{
          setCancelLoading(true);

          res = await restaurantBookingCancel(booking_reference);

          if(!res.success && res.error){
             throw res.error
          }


        }catch(err){

            showMessage({
                type: "danger",
                message: typeof err === 'string' ? err : t('General.error')
            })

        }finally{
          setCancelLoading(false);
        }

        if(res.success){
           navigation?.goBack()
        }
    };


    const handleCancelPress = () => {

        confirmAction({
         message: t('Restaurants.cancelAppointment'),
         title: t('Restaurants.confirm'),
         cancelText: t('Restaurants.cancel'),
         okText: t('Restaurants.ok'),
         onConfirm: handleCancelAppointment,
      });
    }

    const handleSubmitAgainPress = () => {

       navigation.navigate('booking-restaurant-appointment', {
          restaurantId: data.restaurant_id,
          booking_id: data.booking_id
       })

    }
    

    return (
        <>
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header btns={['back']} label={t('Clinics.appointmentDetailsTitle')}/>
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        {!loading && !!data && (
         <ScrollView contentContainerStyle={styles.contentStyle}>

           
        <AppointmentCard qrCode={data.qr_code_url} status={data.status} bookingReference={data.reference}>
          <AppointmentCardValue title={t('Restaurants.restaurant')} value={isRtl ? data.restaurant_ar: data.restaurant} style={styles.block}/>

          <AppointmentCardValue title={t('Restaurants.date')} value={data.datetime} style={styles.block}/>
        </AppointmentCard>

          {canCancelAppointment(data.status) && <Button text={t('Clinics.cancelAppointmentBtn')} style={styles.cancelBtn} onPress={handleCancelPress} />}

          {canReBookAppointment(data.status) && <Button text={t('Clinics.resubmitAppointmentBtn')} style={styles.cancelBtn} onPress={handleSubmitAgainPress} />}
        </ScrollView>
        )}

      </MainLayout>
      {loading || cancelLoading && <FullScreenLoader absolutePosition={true} style={styles.loader}/>}
      </>
    )
};

const styles = StyleSheet.create({
   contentStyle: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    flexGrow: 1
   },
   infoText: {
    fontWeight: '500',
    marginTop: 3
   },
   cancelBtn: {
    marginTop: 20
   },
   loader: {
     paddingBottom: 100
   },
   block: {
    marginTop: 15
   }
});

export default RestaurantBookTableDetails;
