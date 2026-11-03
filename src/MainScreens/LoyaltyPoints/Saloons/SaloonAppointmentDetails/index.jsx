import { ScrollView, StyleSheet } from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import { useTranslation } from "react-i18next";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import AppointmentCard from "../../../../components/AppointmentCard";
import Button from "../../../../components/Button";
import { useState } from "react";
import { showMessage } from "react-native-flash-message";
import { isRTL } from "../../../../../utils";
import { useQuery } from "react-query";
import { getSaloonAppointmentDetails, saloonAppointmentAction } from "../../../../api/saloons";
import { confirmAction } from "../../../../helpers";
import AppointmentCardValue from "../../../../components/AppointmentCard/AppointmentCardValue";
import { colors } from "../../../../components/colors";

const SaloonAppointmentDetails = ({ route, navigation }) => {
    const booking_reference = route.params.booking_reference;
    const appointment_id = route.params.appointment_id;

    const { data, isLoading, error } = useQuery(
        ['saloon-appointment-details', appointment_id],
        () => getSaloonAppointmentDetails(appointment_id),
        {
            cacheTime: 0,
            staleTime: 0
        }
    );

    const [cancelLoading, setCancelLoading] = useState(false);
    const { t } = useTranslation();
    const isRtl = isRTL();

    const canCancel = data?.status === 'pending' || data?.status === 'confirmed';

    const handleCancelAppointment = async () => {
        try {
            setCancelLoading(true);

            const res = await saloonAppointmentAction({
                booking_reference,
                action: 'cancel'
            });

            if (!res.success && res.error) {
                throw res.error;
            }

            showMessage({
                type: 'success',
                message: t('Saloons.appointmentCancelled')
            });

            navigation?.goBack();

        } catch (err) {
            showMessage({
                type: "danger",
                message: typeof err === 'string' ? err : t('General.error')
            });
        } finally {
            setCancelLoading(false);
        }
    };

    const handleCancelPress = () => {
        confirmAction({
            message: t('Saloons.cancelAppointmentConfirm'),
            title: t('Saloons.confirm'),
            cancelText: t('Saloons.cancel'),
            okText: t('Saloons.ok'),
            onConfirm: handleCancelAppointment,
        });
    };

    const handleSubmitAgainPress = () => {
        navigation.navigate('saloons-appointment', {
            saloonId: data?.salon?.id || data?.salon_id,
            service: data?.services?.[0]
        });
    };

    const handleUpdatePress = () => {
        // Map services from details API into the format the booking form expects
        const mappedServices = (data?.services || []).map(svc => ({
            ...svc,
            price: svc.price || data?.pricing?.total_estimated_price,
            currency: svc.currency || data?.pricing?.currency || 'QAR'
        }));

        navigation.navigate('saloons-appointment', {
            appointment_id: data?.appointment_id || appointment_id,
            booking_reference: data?.booking_reference || booking_reference,
            saloonId: data?.salon?.id || data?.salon_id,
            selectedServices: mappedServices,
            staff: data?.staff,
            date: data?.date,
            time: data?.time,
            isUpdate: true
        });
    };

    const salonName = data?.salon?.name
        ? (isRtl ? data.salon.name_ar || data.salon.name : data.salon.name)
        : (isRtl ? data?.salon_ar || data?.salon : data?.salon);

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

    console.log(data,'saloon data')

    return (
        <>
            <MainLayout
                outsideScroll={true}
                headerChildren={
                    <Header btns={['back']} label={t('Saloons.appointmentDetails')} />
                }
                headerHeight={50}
                contentStyle={styles.contentStyle}
            >
                {!isLoading && data && (
                    <ScrollView contentContainerStyle={styles.contentStyle}>

                        <AppointmentCard
                            qrCode={data.qr_code_url}
                            status={data.status}
                            bookingReference={data.booking_reference}
                            feeAmount={data.appointment_fee_amount}
                            paymentStatus={data.appointment_payment_status}
                        >
                            <AppointmentCardValue
                                title={t('Saloons.salon')}
                                value={salonName}
                                style={styles.block}
                            />

                            <AppointmentCardValue
                                title={t('Saloons.dateLabel')}
                                value={`${data.date || ''} ${data.time || ''}`}
                                style={styles.block}
                            />

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

                        {canCancel && <Button
                            text={t('Saloons.cancelAppointmentBtn')}
                            style={styles.cancelBtn}
                            onPress={handleCancelPress}
                            bg={colors.loyaltyBackground}
                            textColor={colors.danger}
                            borderColor={colors.dangerColor}
                            variant="outline"
                        />}


                        {data.status === 'completed' ? (
                            <Button
                                text={t('Clinics.resubmitAppointmentBtn')}
                                onPress={handleSubmitAgainPress}
                                style={styles.cancelBtn}
                            />
                        ) : null}
                    </ScrollView>
                )}

            </MainLayout>
            {(isLoading || cancelLoading) && <FullScreenLoader absolutePosition={true} style={styles.loader} />}
        </>
    );
};

const styles = StyleSheet.create({
    contentStyle: {
        paddingHorizontal: 10,
        paddingBottom: 100,
        flexGrow: 1
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

export default SaloonAppointmentDetails;
