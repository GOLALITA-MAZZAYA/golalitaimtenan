import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoyaltyPointsMain from "./LoyaltyPointsMain";
import LoyaltyPointsRedeemCategories from "./LoyaltyPointsRedeemCategories";
import LoyaltyProductsList from "./LoyaltyProductsList";
import LoyaltyVouchersList from "./LoyaltyVouchersList";
import LoyaltyPointsTransactions from "./LoyaltyPointsTransactions";
import LoyaltyPointsInfo from "./LoyaltyPointsInfo";
import LoyaltyVoucherInfo from "./LoyaltyVoucherInfo";
import LoyaltyProductInfo from "./LoyaltyProductInfo";
import LoyaltyPartnersList from "./LoyaltyPartnersList";
import LoyaltyPartnerInfo from "./LoyaltyPartnerInfo";
import LoyaltyVoucherSkipcache from "./LoyaltyVoucherSkipcache";
import LoyaltyGiftCardsList from "./LoyaltyGiftCardsList";
import LoyaltyGiftCardInfo from "./LoyaltyGiftCardInfo";
import LoyaltyRedeemSuccess from "./LoyaltyRedeemSuccess";
import LoayltyProductRedeem from "./LoyaltyProductRedeem";
import LoyaltyVoucherRedeem from "./LoyaltyVoucherRedeem";
import LoyaltyGiftCardRedeem from "./LoyaltyGiftCardRedeem";
import LoyaltyGoodsList from "./LoyaltyGoodsList";
import LoyaltyGoodsInfo from "./LoyaltyGoodsInfo";
import LoyaltyPartnersTransfer from "./LoyaltyPartnersTransfer";
import LoyaltyTravelList from "./LoyaltyTravelList";
import LoyaltyGoPointsMerchantsList from "./LoyaltyGoPointsMerchantsList";
import MerchantNavigator from "../PremiumPartner";
import LoayltyTravelInfo from "./LoayltyTravelInfo";
import LoyaltyPartnerTransferConfirmation from "./LoyaltyPartnerTransferConfirmation";
import ClinicsList from "./Clinics/ClinicsList";
import ClinicInfo from "./Clinics/ClinicsInfo";
import ClinicsBookAppointment from "./Clinics/ClinicsBookAppointment";
import ClinicsBookAppointmentConfirmation from "./Clinics/ClinicsBookAppointmentConfirmation";
import ClinicAppointmentDetails from "./Clinics/ClinicAppointmentDetails";
import RestaurantBookTable from "./Restaurants/RestaurantBookTable";
import RestaurantBookTableSuccess from "./Restaurants/RestaurantBookTableSuccess";
import RestaurantsList from "./Restaurants/RestaurantsList";
import RestaurantInfo from "./Restaurants/RestaurantInfo";
import RestaurantReservationFoodList from "./Restaurants/RestaurantReservationFoodList";
import RestaurantDeliveryAddress from "./Restaurants/RestaurantDeliveryAddress";
import RestaurantOrderSuccess from "./Restaurants/RestaurantOrderSuccess";
import RestaurantSkipcache from "./Restaurants/RestaurantSkipcache";
import RestaurantCheckPaymentStatus from "./Restaurants/RestaurantCheckPaymentStatus";
import SaloonsList from "./Saloons/SaloonsList";
import SaloonInfo from "./Saloons/SaloonsInfo";
import SaloonsBookAppointment from "./Saloons/SaloonsBookAppointment";
import SaloonBookAppointmentSuccess from "./Saloons/SaloonBookAppointmentSuccess";
import ClinicPaymentStatus from "./Clinics/ClinicPaymentStatus";
import SaloonsPaymentStatus from "./Saloons/SaloonsPaymentStatus";

const Stack = createStackNavigator();

const LoyaltyPointsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: "back",
        headerShown: false,
      }}
    >
      <Stack.Screen name="loyaltyPoints-main" component={LoyaltyPointsMain} />
      <Stack.Screen name="loyaltyPoints-info" component={LoyaltyPointsInfo} />
      <Stack.Screen name="loyaltyPoints-transactions" component={LoyaltyPointsTransactions} />
      <Stack.Screen name="loyaltyPoints-categories" component={LoyaltyPointsRedeemCategories} />

      <Stack.Screen name="loyaltyPoints-products-list" component={LoyaltyProductsList} />
      <Stack.Screen name="loyaltyPoints-products-info" component={LoyaltyProductInfo} />
      <Stack.Screen name="loyaltyPoints-products-redeem" component={LoayltyProductRedeem} />


      <Stack.Screen name="loyaltyPoints-vouchers-list" component={LoyaltyVouchersList} />
      <Stack.Screen name="loyaltyPoints-vouchers-info" component={LoyaltyVoucherInfo} />
      <Stack.Screen name="loyaltyPoints-vouchers-skipcache" component={LoyaltyVoucherSkipcache} />
      <Stack.Screen name="loyaltyPoints-voucher-redeem" component={LoyaltyVoucherRedeem} />
      <Stack.Screen name="loyaltyPoints-vouchers-redeem-success" component={LoyaltyRedeemSuccess} />

      <Stack.Screen name="loyaltyPoints-giftCards-list" component={LoyaltyGiftCardsList} />
      <Stack.Screen name="loyaltyPoints-giftCards-info" component={LoyaltyGiftCardInfo} />
      <Stack.Screen name="loyaltyPoints-giftCard-redeem" component={LoyaltyGiftCardRedeem} />


      <Stack.Screen name="loyaltyPoints-partners-list" component={LoyaltyPartnersList} />
      <Stack.Screen name="loyaltyPoints-partners-info" component={LoyaltyPartnerInfo} />
      <Stack.Screen name="loyaltyPoints-partners-transfer" component={LoyaltyPartnersTransfer} />
      <Stack.Screen name="loyaltyPoints-partners-transfer-confirmation" component={LoyaltyPartnerTransferConfirmation} />

      <Stack.Screen name="loyaltyPoints-travel-list" component={LoyaltyTravelList} />
      <Stack.Screen name="loyaltyPoints-travel-info" component={LoayltyTravelInfo} />

      <Stack.Screen name="loyaltyPoints-goods-list" component={LoyaltyGoodsList} />
      <Stack.Screen name="loyaltyPoints-goods-info" component={LoyaltyGoodsInfo} />

      <Stack.Screen name="loyaltyPoints-go-merchants-list" component={LoyaltyGoPointsMerchantsList} />
      <Stack.Screen name="loyaltyPoints-go-merchants-info" component={MerchantNavigator} />

      <Stack.Screen name="clinics-list" component={ClinicsList} />
      <Stack.Screen name="clinics-info" component={ClinicInfo} />

      <Stack.Screen name="clinics-appointment" component={ClinicsBookAppointment} />
      <Stack.Screen name="clinics-appointment-confirmation" component={ClinicsBookAppointmentConfirmation} />
      <Stack.Screen name="clinics-appointment-details" component={ClinicAppointmentDetails} />
      <Stack.Screen name="clinics-appointment-payment-status" component={ClinicPaymentStatus} />
      <Stack.Screen name="clinics-appointment-skipcache" component={RestaurantSkipcache} />


      <Stack.Screen name="restaurant-list" component={RestaurantsList} />
      <Stack.Screen name="restaurant-info" component={RestaurantInfo} />
      <Stack.Screen name="restaurant-book" component={RestaurantBookTable} />
      <Stack.Screen name="restaurant-book-success" component={RestaurantBookTableSuccess} />
      <Stack.Screen name="restaurant-book-food-list" component={RestaurantReservationFoodList} />
      <Stack.Screen name="restaurant-delivery-address-list" component={RestaurantDeliveryAddress} />
      <Stack.Screen name="restaurant-order-success" component={RestaurantOrderSuccess} />
      <Stack.Screen name="restaurant-skipcache" component={RestaurantSkipcache} />
      <Stack.Screen name="restaurant-skipcache-payment-status" component={RestaurantCheckPaymentStatus} />

      <Stack.Screen name="saloons-list" component={SaloonsList} />
      <Stack.Screen name="saloons-info" component={SaloonInfo} />
      <Stack.Screen name="saloons-appointment" component={SaloonsBookAppointment} />
      <Stack.Screen name="saloons-appointment-success" component={SaloonBookAppointmentSuccess} />
      <Stack.Screen name="saloons-appointment-skipcache" component={RestaurantSkipcache} />
      <Stack.Screen name="saloons-appointment-payment-status" component={SaloonsPaymentStatus} />

    </Stack.Navigator>
  );
};

export default LoyaltyPointsNavigator;
