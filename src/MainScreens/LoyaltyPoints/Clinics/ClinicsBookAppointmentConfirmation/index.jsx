import { ScrollView, StyleSheet, View} from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import SuccessBtn from "../../common/SuccessBtn";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {useTranslation} from "react-i18next";
import {colors} from "../../../../components/colors";
import {formatDate} from "../helpers";
import DoctorCard from "../common/DoctorCard";
import {isRTL} from "../../../../../utils";
import AppointmentCard from "../../../../components/AppointmentCard";

const ClinicsBookAppointmentConfirmation = ({route, navigation}) => {
    const booking = route.params.booking;
    const {t} = useTranslation();
    const isRtl = isRTL();

    console.log(booking,'booking aaaa')

    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header btns={['back']} label={t('Clinics.bookingConfirmationTitle')} additionalBtnsProps={{
            back: {
              onPress: () => {
                  navigation.reset({
                      index: 0,
                      routes: [{ name: 'clinics-list' , params: {activeTab: 'clinics-history'}}],
                  });
              }
            }
          }}/>
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        <ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>

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

        <AppointmentCard status={booking.status} qrCode={booking.qr_code} bookingReference={booking.booking_reference}>
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
                 title={formatDate(booking.date)}
                 style={styles.infoText}
              />
          
            </View>

          
            <DoctorCard
              item={{
                 doctor: isRtl ? booking.doctor_ar: booking.doctor,
                 clinic: isRtl? booking.clinic_ar: booking.clinic,
                 specialty: isRtl?booking.specialty_ar: booking.specialty,
                 doctor_photo: booking.doctor_photo 
              }}
              style={styles.doctorCard}
            />
        </AppointmentCard>

        </ScrollView>
      </MainLayout>
    )
};

const styles = StyleSheet.create({
   contentStyle: {
    paddingHorizontal: 10,
    alignItems: 'center',
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

export default ClinicsBookAppointmentConfirmation;
