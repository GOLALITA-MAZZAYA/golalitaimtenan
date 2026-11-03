import {useTranslation} from "react-i18next";
import { StyleSheet, View} from "react-native";
import {isRTL} from "../../../../../../utils";
import {TypographyText} from "../../../../../components/Typography";
import {BALOO_2} from "../../../../../redux/types";
import {colors} from "../../../../../components/colors";
import AppointmentCard from "../../../../../components/AppointmentCard";
import DoctorCard from "../../common/DoctorCard";
import SuccessBtn from "../../../common/SuccessBtn";
import {formatDate} from "../../../helpers";

const ClinicBookSuccess = ({data}) => {
    const {t} = useTranslation();
    const isRtl = isRTL();

    return (

        <View style={styles.wrapper}>

        <SuccessBtn style={styles.succesBtn}/>

        <TypographyText 
          font={BALOO_2}
          size={32}
          textColor={colors.loyaltyTextMainTitle}
          title={t('Clinics.bookingDoneTitle')}
          style={styles.confirmText}
        />

        <TypographyText 
          font={BALOO_2}
          size={16}
          textColor={colors.loyaltyTextSecondary}
          title={t('Clinics.qrCodeDescription')}
          style={styles.confirmTextSecondary}
        />

        <AppointmentCard 
             status={data.status}
             qrCode={data.qr_code}
             bookingReference={data.booking_reference}
             feeAmount={data.appointment_fee_amount}
             paymentStatus={data.appointment_payment_status}
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
              item={{
                 doctor: isRtl ? data.doctor_ar: data.doctor,
                 clinic: isRtl? data.clinic_ar: data.clinic,
                 specialty: isRtl?data.specialty_ar: data.specialty,
                 doctor_photo: data.doctor_photo 
              }}
              style={styles.doctorCard}
            />
        </AppointmentCard>

        </View>

    )
};

const styles = StyleSheet.create({
   wrapper: {
     alignItems: 'center'
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
   doctorCard: {
    marginTop: 20,
    borderWidth: 0,
    paddingHorizontal: 0
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

export default ClinicBookSuccess;
