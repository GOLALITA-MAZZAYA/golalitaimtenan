import { ScrollView, StyleSheet } from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import AppointmentCard from "../../../../components/AppointmentCard";
import SuccessBtn from "../../common/SuccessBtn";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { CommonActions } from "@react-navigation/native";
import AppointmentCardValue from "../../../../components/AppointmentCard/AppointmentCardValue";
import { useQuery } from "react-query";
import { getSaloonAppointmentDetails } from "../../../../api/saloons";
import { isRTL } from "../../../../../utils";

const SaloonBookAppointmentSuccess = ({ route, navigation }) => {
    const appointment_id = route.params?.appointment_id;
    const bookingResult = route.params?.bookingResult;
    const { t } = useTranslation();
    const isRtl = isRTL();

    const { data: fetchedData, isLoading } = useQuery(
        ['saloon-appointment-details', appointment_id],
        () => getSaloonAppointmentDetails(appointment_id),
        {
            enabled: !!appointment_id,
            cacheTime: 0,
            staleTime: 0
        }
    );

    const data = fetchedData || bookingResult?.details || bookingResult;
    const booking_reference = bookingResult?.booking_reference || data?.booking_reference;

    // Use full fallback chains so partial fetchedData doesn't erase initial booking data
    let salonNameStr = fetchedData?.salon?.name || fetchedData?.salon_name || fetchedData?.saloon_name
        || bookingResult?.details?.salon_name || bookingResult?.salon_name || bookingResult?.details?.saloon_name;
    if (!salonNameStr && typeof fetchedData?.salon === 'string') salonNameStr = fetchedData.salon;
    if (!salonNameStr && typeof fetchedData?.salon_ar === 'string' && isRtl) salonNameStr = fetchedData.salon_ar;
    if (!salonNameStr && typeof bookingResult?.details?.salon === 'string') salonNameStr = bookingResult.details.salon;

    // Add additional fallbacks for name and qrCode if the structure varies
    const salonName = salonNameStr || route.params?.salonName || '';
    const qrCode = fetchedData?.qr_code_url || fetchedData?.qr_code || bookingResult?.details?.qr_code || bookingResult?.qr_code_url || bookingResult?.details?.qr_code_url || '';

    return (
        <MainLayout
            outsideScroll={true}
            headerChildren={
                <Header btns={['back']} label={t('Clinics.bookingConfirmationTitle')} additionalBtnsProps={{
                    back: {
                        onPress: () => {
                            navigation.dispatch(state => {
                                const firstRoute = state.routes[0];
                                return CommonActions.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: firstRoute.name,
                                            params: firstRoute.params,
                                        },
                                    ],
                                });
                            });
                        }
                    }
                }} />
            }
            headerHeight={50}
            contentStyle={styles.contentStyle}
        >
            {!isLoading && data && (<ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>

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

                <AppointmentCard qrCode={qrCode} status={data.status || 'pending'} bookingReference={booking_reference}>
                    <AppointmentCardValue title={t('Saloons.salon')} value={salonName} style={styles.block} />

                    <AppointmentCardValue title={t('Saloons.dateLabel')} value={`${data.date || ''} ${data.time || ''}`} style={styles.block} />
                </AppointmentCard>

            </ScrollView>)}
            {isLoading && <FullScreenLoader absolutePosition={true} style={styles.loader} />}

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
    confirmTextSecondary: {
        marginTop: 5
    },
    block: {
        marginTop: 15
    }
});

export default SaloonBookAppointmentSuccess;
