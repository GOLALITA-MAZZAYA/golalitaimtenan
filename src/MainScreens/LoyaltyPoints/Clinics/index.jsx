import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ClinicsList from "./ClinicsList";
import ClinicInfo from "./ClinicsInfo";
import ClinicsBookAppointment from "./ClinicsBookAppointment";
import ClinicsBookAppointmentConfirmation from "./ClinicsBookAppointmentConfirmation";
import ClinicAppointmentDetails from "./ClinicAppointmentDetails";
import ClinicPaymentStatus from "./ClinicPaymentStatus";
import RestaurantSkipcache from "../Restaurants/RestaurantSkipcache";

const Stack = createStackNavigator();

const ClinicsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: "back",
        headerShown: false,
      }}
    >
      <Stack.Screen name="clinics-list" component={ClinicsList} />
      <Stack.Screen name="clinics-info" component={ClinicInfo} />
      <Stack.Screen name="clinics-appointment" component={ClinicsBookAppointment} />
      <Stack.Screen name="clinics-appointment-confirmation" component={ClinicsBookAppointmentConfirmation} />
      <Stack.Screen name="clinics-appointment-details" component={ClinicAppointmentDetails} />
      <Stack.Screen name="clinics-appointment-payment-status" component={ClinicPaymentStatus} />
      <Stack.Screen name="clinics-appointment-skipcache" component={RestaurantSkipcache} />
      
      
    </Stack.Navigator>
  );
};

export default ClinicsNavigator;
