import {SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import Header from "../../../../components/Header";
import DoctorCard from "../common/DoctorCard";
import CustomCalendar from "../../../../components/CustomDateCalendar";
import {useState} from "react";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {colors} from "../../../../components/colors";
import CalendarSvg from '../../../../assets/clinics/calendar.svg';
import TimeSvg from '../../../../assets/clinics/clock.svg'
import {isRTL} from "../../../../../utils";
import Button from "../../../../components/Button";
import useDoctorAvailability from "../hooks/useDoctorAvailability";
import useUpdateEffect from "../../../../hooks/useUpdateEffect";
import {bookAppointment, resubmitAppointment} from "../../../../api/clinics";
import {showMessage} from "react-native-flash-message";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {useTranslation} from "react-i18next";
import {canReBookAppointment, formatDateToISO} from "../helpers";
import HorizontalTimes from "../../../../components/Form/HorizontalTimes";
import {setLoading} from "../../../../redux/globalTix/globalTix-actions";
import {canNavigate} from "../../../../Navigation/RootNavigation";
import AppointmentChart from "../../common/AppointmentChart";
import useClinicDetails from "../hooks/useClinicDetails";
import {getAmountInfo} from "../../helpers";
import {useDispatch, useSelector} from "react-redux";
import {loyaltySelector} from "../../../../redux/loyalty/loyalty-selectors";
import {setMarchantOrderDetails} from "../../../../redux/loyalty/loyalty-actions";
import { org } from "../../../../org/config";

const ClinicsBookAppointment = ({route, navigation}) => {
    const doctor = route?.params?.doctor;
    const clinic_id = route?.params?.clinicId;
    const appointment_id = route.params.appointment_id;

    const [date, setDate] = useState(new Date());
    const {data, loading} = useDoctorAvailability(doctor.doctor_id, formatDateToISO(date || new Date()));
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const {data: clinic} = useClinicDetails(clinic_id);
    const dispatch = useDispatch();

    const {t} = useTranslation();
    const isRtl = isRTL();
    const {isPointsEnabled} = useSelector(loyaltySelector);

    const {total_amount, usedPoints, remainingPoints, amount, discount} = getAmountInfo(
        [],
        {order_type: 'clinic-appointment', bookingFee: clinic?.appointment_fee_amount} );

    useUpdateEffect(() => {
        setSelectedTime(data?.[0] ? data?.[0] : null)
    },[data]);

    const book = async () => {
        if(!selectedTime){
            showMessage({
                type: 'danger',
                message: t('Clinics.timeIsRequired')
            });

            return
        }

        try{
          setLoading(true);


          const response =  await bookAppointment(
            {
                doctor_id: doctor.doctor_id,
                clinic_id: clinic_id,
                appointment_date: formatDateToISO(date),
                appointment_time: selectedTime,
                notes: 'Regular checkup',
                returnUrl: `${org.urlScheme}clinic-payment-result?usedPoints=${usedPoints}&totalAmount=${total_amount}`,
                total_amount,
                amount,
                discount
            }
          );

          const orderReference = response.booking?.booking_reference;
          const orderId = response?.booking?.appointment_id;
          
          if(orderReference && orderId){
              dispatch(setMarchantOrderDetails(orderReference, orderId))
          }



          if(response.error){
            showMessage({
                type: 'danger',
                message: response.error
            })
          }

          if(!response.booking){
            throw 'err'
          }

          navigation.navigate('clinics-appointment-skipcache',{payment_url: response.booking.payment_url})

        }catch(err){
          console.log(err,'error')
          showMessage({
            type: 'danger',
            message: t('General.error')
          })
        }finally{
            setBookingLoading(false)
        }
    }

    const rebook = async () => {
      if(!selectedTime){
            showMessage({
                type: 'danger',
                message: t('Clinics.timeIsRequired')
            });

            return
        }

        try{
          setLoading(true);

          const response =  await resubmitAppointment(
            {
                appointment_id: appointment_id,
                appointment_date: formatDateToISO(date),
                appointment_time: selectedTime,
            }
          );

          if(response.error){
            showMessage({
                type: 'danger',
                message: response.error
            })

            return
          }

          if(!response?.appointment?.booking_reference){
            throw 'err'
          }

          showMessage({
              type: 'danger',
              message: t('Clinics.resubmitSuccess')
          })

          if(canNavigate("clinics-list")){

          navigation.reset({
            index: 0,
            routes: [{ name: 'clinics-list'}],
          });

          }else{
           navigation.reset({
            index: 0,
            routes: [{ name: 'bookings-list'}],
          });
          }

        }catch(err){
          showMessage({
            type: 'danger',
            message: t('General.error')
          })
        }finally{
            setBookingLoading(false)
        }
    }


    const handleSubmitPress = async () => {

        if(clinic_id){
          book();
        }

        if(appointment_id){
          rebook();
        }

    };

    return (
        <>
        <SafeAreaView style={styles.wrapper}>
            <Header label={t('Clinics.bookAppointment')} btns={['back']}/>

             <ScrollView contentContainerStyle={styles.content}>
              <DoctorCard item={{clinic: doctor.clinic, doctor: isRtl ? doctor.name_ar: doctor.name, specialty: isRtl ? doctor.specialty_ar : doctor.specialty, doctor_photo: doctor.photo, }} />
              
              <View>
                <View style={[styles.title,{flexDirection: isRtl ? 'row-reverse': 'row', alignItems: 'center'}]}>
                    <CalendarSvg color={colors.primary} height={18} width={18}/>

                    <TypographyText 
                      font={BALOO_2}
                      size={14}
                      textColor={colors.textSecondary}
                      title={t('Clinics.selectDate')}
                      style={{marginLeft: isRtl ? 0: 5, marginRight: isRtl ? 5: 0}}
                    />
                </View>
                <CustomCalendar isModal={false} onChange={setDate} modes={true} />
              </View>

              <View>
                <View style={[styles.title,{flexDirection: isRtl ? 'row-reverse': 'row', alignItems: 'center'}]}>
                    <TimeSvg color={colors.primary} height={18} width={18}/>

                    <TypographyText 
                      font={BALOO_2}
                      size={14}
                      textColor={colors.textSecondary}
                      title={t('Clinics.selectTime')}
                      style={{marginLeft: isRtl ? 0: 5, marginRight: isRtl ? 5: 0}}
                    />
                    
                </View>

                <HorizontalTimes times={data} setTime={setSelectedTime} selectedTime={selectedTime} loading={loading} />
              </View>

              <AppointmentChart
                 style={styles.chart}
                 fee={clinic?.appointment_fee_amount}
                 total={total_amount}
                 usedPoints={usedPoints}
                 remainingPoints={remainingPoints}
              />

             {canReBookAppointment && <Button
                text={t('Clinics.confirmBooking')}
                onPress={handleSubmitPress}
                style={styles.submitBtn}
             />}
            </ScrollView>

        </SafeAreaView>
         {bookingLoading && <FullScreenLoader absolutePosition />}
        </>

    );
};

const styles = StyleSheet.create({
   wrapper: {
    flex: 1
   },
   content: {
     paddingHorizontal:16,
     paddingBottom: 40
   },
   doctorCard: {
    marginTop: 20
   },
   title: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 6
   },
   submitBtn: {
    marginTop: 30
   },
   chart: {
    marginTop: 20
   },
   rewardsPoints: {
    marginTop: 20
   }
});

export default ClinicsBookAppointment