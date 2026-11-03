import { StyleSheet } from "react-native";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import MainLayout from "../../components/MainLayout";
import { useState } from "react";
import HistoryList from "./HistoryList";
import DoctorCard from "../LoyaltyPoints/Clinics/common/DoctorCard";
import { getClinicsHistoryList } from "../../api/clinics";
import HeaderTabs from "./HeaderTabs";
import {navigate} from "../../Navigation/RootNavigation";
import {getOrdersHistory, getRestaurantsHistoryList} from "../../api/restaurants";
import {isRTL} from "../../../utils";
import RestaurantHistoryCard from "./component/RestaurantHistoryCard";
import OrderHistoryCard from "./component/OrderHistoryCard";
import store from "../../redux/store";
import {setOrderType} from "../../redux/restaurant/restaurant-actions";
import { getSaloonAppointmentHistory } from "../../api/saloons";
import SaloonHistoryCard from "./component/SaloonHistoryCard";


export const historyConfig = {
  clinics: {
    query: getClinicsHistoryList,
    Card: DoctorCard,
    getCardProps: (item) => ({
      item: {
        doctor: isRTL() ? item.doctor_ar : item.doctor,
        clinic: isRTL() ? item.clinic_ar : item.clinic,
        specialty: isRTL() ? item.specialty_ar : item.specialty,
        status: item.state,
        date: item.date,
        doctor_photo: item.doctor_photo,
        reference: item.booking_reference,
        booking_reference: item.booking_reference
      }
    }),
    onPress: (booking_reference) => {
      navigate('bookings-clinics-appointment-info', { booking_reference })
    }
  },
  restaurants: {
    query: getRestaurantsHistoryList,
    Card: RestaurantHistoryCard,
    getCardProps: (item) => ({
      logo: item.restaurant_image || '',
      guests: item.guests,
      name: isRTL() ? item.restaurant_name_ar : item.restaurant_name,
      booking_reference: item.booking_reference,
      date: item.datetime,
      status: item.status,
    }),
    onPress: (booking_reference) => {
      store.dispatch(setOrderType('reservation'));
      navigate('booking-restaurant-appointment-info',{booking_reference})
      navigate('booking-restaurant-appointment-info', { booking_reference })
    }
  },
  saloons: {
    query: getSaloonAppointmentHistory,
    Card: SaloonHistoryCard,
    getCardProps: (item) => ({
      name: isRTL() ? item.salon_ar || item.salon : item.salon,
      services: isRTL() ? item.services_ar : item.services,
      staff: isRTL() ? item.staff_ar : item.staff,
      status: item.status,
      date: item.date,
      total_estimated_price: item.total_estimated_price,
      currency: item.currency,
      booking_reference: item.booking_reference
    }),
    onPress: (booking_reference, item) => {
      navigate('booking-saloon-appointment-info', {
        booking_reference,
        appointment_id: item.appointment_id
      });
    }
  },
  orders: {
    query: getOrdersHistory,
    Card: OrderHistoryCard,
    getCardProps: (item) => ({
      reference: item.reference,
      logo: item.restaurant_image || '',
      totalAmount: item.total_amount,
      itemsCount: item.items_count,
      name: isRTL() ? item.restaurant_name_ar: item.restaurant_name,
      date: item.datetime,
      status: item.status,
      type: item.type,
    }),
    onPress: (reference, type, status) => {
      navigate('booking-restaurant-order-info',{reference, type, status})
    }
  },
};

const MyBookings = ({ navigation }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('restaurants');

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header label={t('MyBookings.title')} btns={['back']} additionalBtnsProps={{
          back: {
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }]
              });
            }
          }
        }}
        />
      }
      headerHeight={50}
      contentStyle={styles.contentStyle}
    >
      <HeaderTabs setActiveTab={setActiveTab} activeTab={activeTab} />

      <HistoryList type={activeTab} />


    </MainLayout>
  )
};

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    paddingHorizontal: 20
  },
  tabsWrapper: {
    marginHorizontal: 20,
    marginTop: 30
  },
  banners: {
    alignSelf: 'center'
  },
  card: {
    marginBottom: 16
  }
});

export default MyBookings;