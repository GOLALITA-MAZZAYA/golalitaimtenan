import {StyleSheet, View} from "react-native";
import SuccessBtn from "../../../common/SuccessBtn";
import {TypographyText} from "../../../../../components/Typography";
import {BALOO_2} from "../../../../../redux/types";
import {colors} from "../../../../../components/colors";
import {useTranslation} from "react-i18next";
import AppointmentCard from "../../../../../components/AppointmentCard";
import AppointmentCardValue from "../../../../../components/AppointmentCard/AppointmentCardValue";

const BookSuccess = ({data, paymentStatus}) => {
    const {t} = useTranslation();

    return (
       <View style={styles.wrapper}>

        <SuccessBtn style={styles.succesBtn}/>

        <TypographyText 
          font={BALOO_2}
          size={32}
          textColor={colors.loyaltyTextMainTitle}
          title={t('Restaurants.bookingDoneTitle')}
          style={styles.confirmText}
        />

        <TypographyText 
          font={BALOO_2}
          size={16}
          textColor={colors.loyaltyTextSecondary}
          title={t('Restaurants.qrCodeDescription')}
          style={styles.confirmTextSecondary}
        />

        <AppointmentCard 
            qrCode={data.qr_code_url}
            status={data.status}
            bookingReference={data.reference}
            paymentStatus={paymentStatus}
            feeAmount={data.total_amount}

        >
          <AppointmentCardValue title={t('Restaurants.restaurant')} value={data.restaurant} style={styles.block}/>

          <AppointmentCardValue title={t('Restaurants.date')} value={data.datetime} style={styles.block}/>
          {/* <AppointmentCardValue title={t('Restaurants.fee')} value={`25 ${t('General.qar')}`} style={styles.block}/> */}
          <AppointmentCardValue title={t('Restaurants.total')} value={`${data.total_amount} ${t('General.qar')}`} style={styles.block}/>
        </AppointmentCard>

       </View>
    );
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
   block: {
    marginTop: 15
   }
})

export default BookSuccess;