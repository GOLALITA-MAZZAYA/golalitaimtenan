import { ScrollView, StyleSheet, View} from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import {useTranslation} from "react-i18next";
import useAppointmentDetails from "../hooks/useAppointmentDetails";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import AppointmentCard from "../../../../components/AppointmentCard";
import Button from "../../../../components/Button";
import {useState} from "react";
import {showMessage} from "react-native-flash-message";
import {canCancelAppointment, formatDate} from "../helpers";
import {cancelAppointment} from "../../../../api/clinics";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {colors} from "../../../../components/colors";
import DoctorCard from "../common/DoctorCard";
import {isRTL} from "../../../../../utils";
import {confirmAction} from "../../../../helpers";

const ClinicAppointmentDetails = ({route, navigation}) => {
    const booking_reference = route.params.booking_reference;

    const {data, loading} = useAppointmentDetails(booking_reference);
    const [cancelLoading, setCancelLoading] = useState(false);
    const {t} = useTranslation();
    const isRtl = isRTL();

    const handleCancelAppointment = async () => {
        let res;

        try{
          setCancelLoading(true);

          res = await cancelAppointment(data.appointment_id);

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
         message: t('Clinics.cancelAppointment'),
         title: t('Clinics.confirm'),
         cancelText: t('Clinics.cancel'),
         okText: t('Clinics.ok'),
         onConfirm: handleCancelAppointment,
      });
    }

    const doctorData = {
      ...data,
      date: undefined,
      status: undefined
    };

    console.log(data,'clinic data')

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

           <AppointmentCard 
               status={data.status}
               qrCode={data.qr_code}
               bookingReference={data.booking_reference}
               paymentStatus={data.appointment_payment_status}
               feeAmount={data.appointment_fee_amount}
              >
                      <View style={[styles.dateBlock,{alignSelf: isRtl ? 'flex-end': 'flex-start'}]}>
                      
                          <TypographyText
                              font={BALOO_2}
                              size={14}
                              textColor={colors.loyaltyTextSecondary}
                              title={t('Clinics.date')}     
                          />
                      
                          <TypographyText 
                             font={BALOO_2}
                             size={18}
                             textColor={colors.mainText}
                             title={formatDate(data.date)}
                             style={styles.infoText}
                          />
                      
                        </View>
                     
                        <DoctorCard
                          item={doctorData}
                          style={styles.doctorCard}
                        />
           </AppointmentCard>

          {canCancelAppointment(data.status) && <Button text={t('Clinics.cancelAppointmentBtn')} style={styles.cancelBtn} onPress={handleCancelPress} />}

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
   succesBtn: {
     marginTop: 15
   },
   confirmText: {
    fontWeight: '700',
    marginTop: 20
   },
   confirmTextSecondary:{
    marginTop: 5
   },
   qrcodeBlock: {
    alignItems: 'center',
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 20,
    borderWidth: 1
   },
   qrcode: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
   },
   qrCodeImage: {
    width: 180,
    height: 180,
    borderRadius: 20,
   },
   bookInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 6
   },
   infoText: {
    fontWeight: '500',
    marginTop: 3
   },
   goBackBtn: {
    paddingHorizontal: 100,
    marginTop: 20
   },
   circle: {
     width: 8,
     height: 8,
     borderRadius: 4,
     alignSelf: 'center'
   },
   dateBlock: {
    marginTop: 10,
    paddingHorizontal: 6
   },
   cancelBtn: {
    marginTop: 20
   },
   loader: {
     paddingBottom: 100
   },
   doctorCard: {
    marginTop: 20,
   },
   dateBlock: {
    marginTop: 10,
    paddingHorizontal: 6
   },
   infoText: {
    fontWeight: '500',
    marginTop: 3
   },
});

export default ClinicAppointmentDetails;
