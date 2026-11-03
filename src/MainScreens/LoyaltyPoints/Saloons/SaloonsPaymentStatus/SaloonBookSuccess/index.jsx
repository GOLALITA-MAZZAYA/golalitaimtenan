import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {TypographyText} from "../../../../../components/Typography";
import {BALOO_2} from "../../../../../redux/types";
import AppointmentCard from "../../../../../components/AppointmentCard";
import AppointmentCardValue from "../../../../../components/AppointmentCard/AppointmentCardValue";
import SuccessBtn from "../../../common/SuccessBtn";
import {isRTL} from "../../../../../../utils";
import {colors} from "../../../../../components/colors";

const SaloonBookAppointmentSuccess = ({ data }) => {
    const { t } = useTranslation();
    const isRtl = isRTL();

    const booking_reference = data?.booking_reference;
    const salonName = isRtl ? data?.salon?.name_ar: data?.salon?.name;
    const qrCode = data?.qr_code_url;
    const staffName = data?.staff?.name
        ? (isRtl ? data.staff.name_ar || data.staff.name : data.staff.name)
        : (isRtl ? data?.staff_ar || data?.staff : data?.staff);

    const servicesText = data?.services
        ? (Array.isArray(data.services)
            ? data.services.map(s => typeof s === 'object' ? (isRtl ? s.name_ar || s.name : s.name) : s).join(', ')
            : data.services)
        : '';

    const adults = data?.adults;
    const children = data?.children;

        console.log(data,'data');
        console.log(adults,'adults');
        console.log(children,'children')

    return (
            <View style={styles.wrapper} showsVerticalScrollIndicator={false}>

                <SuccessBtn style={styles.succesBtn} />

                <TypographyText
                    font={BALOO_2}
                    size={32}
                    textColor={colors.loyaltyTextMainTitle}
                    title={t('Saloons.bookingSuccess')}
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
                   qrCode={qrCode}
                   status={data.status}
                   bookingReference={booking_reference}
                   feeAmount={data.appointment_fee_amount}
                   paymentStatus={data.appointment_payment_status}
                >
                    <AppointmentCardValue title={t('Saloons.salon')} value={salonName} style={styles.block} />

                    <AppointmentCardValue title={t('Saloons.dateLabel')} value={`${data.date || ''} ${data.time || ''}`} style={styles.block} />

                            {!!adults && <AppointmentCardValue
                                title={t('Saloons.adults')}
                                value={adults}
                                style={styles.block}
                            />}

                            {!!children && <AppointmentCardValue
                                title={t('Saloons.children')}
                                value={children}
                                style={styles.block}
                            />}

                            {!!servicesText && <AppointmentCardValue
                                title={t('Saloons.servicesLabel')}
                                value={servicesText}
                                style={styles.block}
                            />}

                            {!!staffName && <AppointmentCardValue
                                title={t('Saloons.staffLabel')}
                                value={staffName}
                                style={styles.block}
                            />}

                            {!!data.pricing?.total_estimated_price && <AppointmentCardValue
                                title={t('Saloons.totalPrice')}
                                value={`${data.pricing.total_estimated_price} ${data.pricing.currency || 'QAR'}`}
                                style={styles.block}
                            />}

                            {!!data.notes && <AppointmentCardValue
                                title={t('Saloons.notes')}
                                value={data.notes}
                                style={styles.block}
                            />}
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
    confirmTextSecondary: {
        marginTop: 5
    },
    block: {
        marginTop: 15
    }
});

export default SaloonBookAppointmentSuccess;
