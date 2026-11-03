import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyBookings from ".";
import ClinicsBookAppointment from "../LoyaltyPoints/Clinics/ClinicsBookAppointment";
import ClinicAppointmentDetails from "../LoyaltyPoints/Clinics/ClinicAppointmentDetails";
import RestaurantBookTable from "../LoyaltyPoints/Restaurants/RestaurantBookTable";
import RestaurantBookTableDetails from "../LoyaltyPoints/Restaurants/RestaurantBookTableDetails";
import RestaurantOrderInfo from "../LoyaltyPoints/Restaurants/RestaurantOrderInfo";
import RestaurantDeliveryAddress from "../LoyaltyPoints/Restaurants/RestaurantDeliveryAddress";
import RestaurantReservationFoodList from "../LoyaltyPoints/Restaurants/RestaurantReservationFoodList";
import SaloonsBookAppointment from "../LoyaltyPoints/Saloons/SaloonsBookAppointment";
import SaloonAppointmentDetails from "../LoyaltyPoints/Saloons/SaloonAppointmentDetails";
import RestaurantSkipcache from "../LoyaltyPoints/Restaurants/RestaurantSkipcache";

const Stack = createStackNavigator();

const MyBookingsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: "back",
        headerShown: false,
      }}
    >
      <Stack.Screen name="bookings-list" component={MyBookings} />

      <Stack.Screen name="bookings-clinics-appointment" component={ClinicsBookAppointment} />
      <Stack.Screen name="bookings-clinics-appointment-info" component={ClinicAppointmentDetails} />

      <Stack.Screen name="booking-restaurant-appointment" component={RestaurantBookTable} />
      <Stack.Screen name="booking-restaurant-appointment-info" component={RestaurantBookTableDetails} />
      <Stack.Screen name="booking-restaurant-appointment-food-list" component={RestaurantReservationFoodList} />

      <Stack.Screen name="booking-restaurant-order-edit" component={RestaurantDeliveryAddress} />
      <Stack.Screen name="booking-restaurant-order-info" component={RestaurantOrderInfo} />

      <Stack.Screen name="booking-payment" component={RestaurantSkipcache} />
      
      <Stack.Screen name="booking-saloon-appointment-info" component={SaloonAppointmentDetails} />
      <Stack.Screen name="saloons-appointment" component={SaloonsBookAppointment} />
      
    </Stack.Navigator>
  );
};

export default MyBookingsNavigator;

