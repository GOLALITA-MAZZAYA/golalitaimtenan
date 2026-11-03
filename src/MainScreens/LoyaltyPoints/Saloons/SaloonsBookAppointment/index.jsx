import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import Header from "../../../../components/Header";
import { useState, useEffect } from "react";
import { colors } from "../../../../components/colors";
import { isRTL } from "../../../../../utils";
import Button from "../../../../components/Button";
import useStaffAvailability from "../hooks/useStaffAvailability";
import useSaloonDetails from "../hooks/useSaloonDetails";
import { bookSaloonAppointment, updateSaloonAppointment } from "../../../../api/saloons";
import { showMessage } from "react-native-flash-message";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useTranslation } from "react-i18next";
import { formatDateToISO } from "../../Clinics/helpers";
import { org } from "../../../../org/config";
import AppointmentChart from "../../common/AppointmentChart";
import {getAmountInfo} from "../../helpers";
import {useDispatch, useSelector} from "react-redux";
import {loyaltySelector} from "../../../../redux/loyalty/loyalty-selectors";
import ServicesSummary from "./ServicesSummary";
import PeopleCounter from "./PeopleCounter";
import DateSelector from "./DateSelector";
import StaffSelector from "./StaffSelector";
import TimeSelector from "./TimeSelector";
import {setMarchantOrderDetails} from "../../../../redux/loyalty/loyalty-actions";

const SaloonsBookAppointment = ({ route, navigation }) => {
    const paramServices = route?.params?.selectedServices;
    const paramSingleService = route?.params?.service;
    const initialServices = paramServices || (paramSingleService ? [paramSingleService] : []);

    const saloonId = route?.params?.saloonId;
    const isUpdate = route?.params?.isUpdate;
    const appointment_id = route?.params?.appointment_id;
    const booking_reference = route?.params?.booking_reference;

    const [selectedServices, setSelectedServices] = useState(initialServices);
    const [date, setDate] = useState(route?.params?.date ? new Date(route.params.date) : new Date());
    const [selectedStaff, setSelectedStaff] = useState(route?.params?.staff || null);
    const [selectedTime, setSelectedTime] = useState(route?.params?.time || '');
    const [bookingLoading, setBookingLoading] = useState(false);
    const {merchantDiscount} = useSelector(loyaltySelector);
    const dispatch = useDispatch();

    // People counters
    const [adults, setAdults] = useState(route?.params?.adults || 1);
    const [children, setChildren] = useState(route?.params?.children || 0);

    const { services: allServices, staff, loading: staffLoading, saloon } = useSaloonDetails(saloonId);
    const { data: availability, isLoading: availabilityLoading } = useStaffAvailability(saloonId, formatDateToISO(date), selectedStaff?.id);
    
    const { t } = useTranslation();

    const totalPeople = adults + children;
  
    const baseDuration = selectedServices.reduce((sum, s) => sum + (parseInt(s.duration_minutes) || 0), 0);
    const totalDuration = baseDuration * totalPeople;
    const discountPercentage = merchantDiscount?.rule?.discount_percentage;

    console.log(discountPercentage,'discount percentage')

    const {total_amount, discount, amount, usedPoints, remainingPoints} = getAmountInfo(
        selectedServices,
    {discountPercentage, totalPeople, order_type: 'saloon_order', bookingFee: saloon.appointment_fee_amount} );

    useEffect(() => {
        if (staff && staff.length > 0 && !selectedStaff) {
            setSelectedStaff(staff[0]);
        }
    }, [staff, selectedStaff]);

    // Resolve service IDs for update mode
    useEffect(() => {
        if (isUpdate && allServices?.length > 0 && selectedServices.length > 0) {
            const needsResolution = selectedServices.some(s => !s.id);
            if (needsResolution) {
                const resolved = selectedServices.map(svc => {
                    if (svc.id) return svc;
                    const match = allServices.find(s =>
                        (s.name && s.name === svc.name) ||
                        (s.name_ar && s.name_ar === svc.name_ar)
                    );
                    return match ? { ...svc, ...match } : svc;
                });
                setSelectedServices(resolved);
            }
        }
    }, [isUpdate, allServices]);

    useEffect(() => {
        setSelectedTime('');
    }, [availability]);

    const handleBook = async () => {
        if (!selectedStaff) {
            showMessage({ type: 'danger', message: t('Saloons.staffIsRequired') });
            return;
        }

        const serviceIds = selectedServices.map(s => s.id || s.service_id).filter(Boolean);

        try {
            setBookingLoading(true);

            if (isUpdate) {
                const updatePayload = {
                    appointment_id,
                    booking_reference,
                    salon_id: saloonId,
                    appointment_date: formatDateToISO(date),
                    appointment_time: selectedTime,
                    staff_id: selectedStaff?.id,
                    adults,
                    children,
                };
                if (serviceIds.length > 0) {
                    updatePayload.service_ids = serviceIds;
                }

                const response = await updateSaloonAppointment(updatePayload);
                if (response.error) {
                    showMessage({ type: 'danger', message: response.error });
                    return;
                }

                showMessage({ type: 'success', message: t('Clinics.resubmitSuccess') });
                navigation.reset({ index: 0, routes: [{ name: 'bookings-list' }] });
                return;
            }

            // New booking
            const response = await bookSaloonAppointment({
                salon_id: saloonId,
                appointment_date: formatDateToISO(date),
                appointment_time: selectedTime,
                service_ids: serviceIds,
                staff_id: selectedStaff.id,
                adults,
                children,
                returnUrl: `${org.urlScheme}saloon-payment-result?usedPoints=${usedPoints},totalAmount=${total_amount}`,
                total_amount,
                amount,
                discount
            });


            if (response.error) {
                showMessage({ type: 'danger', message: response.error });
                return;
            }

            

            const orderReference = response.booking_reference;
            const orderId = response.details?.appointment_id;

            console.log(response,'saloon book order response');
            console.log(orderReference,'orderReference');
            console.log(orderId,'orderId')
            if(orderReference && orderId){
                console.log('before redux')
              dispatch(setMarchantOrderDetails(orderReference, orderId));
              console.log('after redux')
            }

            navigation.navigate('saloons-appointment-skipcache', {
                payment_url: response.details.payment_url,
            });

        } catch (err) {
            console.error("[DEBUG] Error in handleBook:", err);
            showMessage({ type: 'danger', message: err.message || t('General.error') });
        } finally {
            setBookingLoading(false);
        }
    }

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.loyaltyBackground }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <Header label={t('Saloons.bookAppointment')} btns={['back']} />

                <ScrollView contentContainerStyle={styles.content}>

                    <ServicesSummary services={selectedServices} t={t}/>

                    <PeopleCounter
                       adults={adults}
                       children={children}
                       setAdults={setAdults}
                       setChildren={setChildren}
                       t={t}
                    />


                    <DateSelector setDate={setDate} t={t}/>

                    <StaffSelector 
                       staff={staff}
                       selectedStaff={selectedStaff}
                       setSelectedStaff={setSelectedStaff}
                       t={t}
                    />


                    <TimeSelector
                       availability={availability}
                       selectedTime={selectedTime}
                       setSelectedTime={setSelectedTime}
                       loading={availabilityLoading}
                       t={t}
                    />

                    <AppointmentChart
                       total={total_amount}
                       subtotal={amount}
                       fee={saloon.appointment_fee_amount}
                       discount={discount}
                       serviesCount={selectedServices?.length}
                       adultsCount={adults}
                       childrenCount={children}
                       duration={totalDuration}
                       usedPoints={usedPoints}
                       remainingPoints={remainingPoints}
                       style={styles.appointmentChart}
                    />

                    <Button
                        text={t('Saloons.confirmBooking')}
                        onPress={handleBook}
                        style={styles.submitBtn}
                    />
                </ScrollView>
            </SafeAreaView>
            {bookingLoading && <FullScreenLoader absolutePosition />}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40
    },
    summaryCard: {
        backgroundColor: colors.smallCardBackground,
        padding: 16,
        borderRadius: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.primaryBorderLight
    },
    serviceRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.mainBorder,
    },
    totalCard: {
        backgroundColor: colors.smallCardBackground,
        padding: 16,
        borderRadius: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    section: {
        marginTop: 20
    },
    sectionTitle: {
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 10
    },
    staffList: {
        paddingVertical: 5
    },
    staffCard: {
        alignItems: 'center',
        marginRight: 15,
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    selectedStaffCard: {
        borderColor: colors.primary,
        backgroundColor: colors.smallCardBackground
    },
    staffPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5
    },
    staffName: {
        fontWeight: '500'
    },
    submitBtn: {
        marginTop: 30
    },
    appointmentChart: {
        marginTop: 20
    }
});

export default SaloonsBookAppointment;
