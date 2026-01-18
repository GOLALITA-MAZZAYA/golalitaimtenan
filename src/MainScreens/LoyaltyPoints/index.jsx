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
      <Stack.Screen name="loyaltyPoints-products-redeem-success" component={LoyaltyRedeemSuccess} />
      
      
      <Stack.Screen name="loyaltyPoints-vouchers-list" component={LoyaltyVouchersList} />
      <Stack.Screen name="loyaltyPoints-vouchers-info" component={LoyaltyVoucherInfo} />
      <Stack.Screen name="loyaltyPoints-vouchers-skipcache" component={LoyaltyVoucherSkipcache} />
      <Stack.Screen name="loyaltyPoints-voucher-redeem" component={LoyaltyVoucherRedeem} />
      <Stack.Screen name="loyaltyPoints-vouchers-redeem-success" component={LoyaltyRedeemSuccess} />

      <Stack.Screen name="loyaltyPoints-giftCards-list" component={LoyaltyGiftCardsList} />
      <Stack.Screen name="loyaltyPoints-giftCards-info" component={LoyaltyGiftCardInfo} />
      <Stack.Screen name="loyaltyPoints-giftCard-redeem" component={LoyaltyGiftCardRedeem} />
      <Stack.Screen name="loyaltyPoints-giftCard-redeem-success" component={LoyaltyRedeemSuccess} />

      
      <Stack.Screen name="loyaltyPoints-partners-list" component={LoyaltyPartnersList} />
      <Stack.Screen name="loyaltyPoints-partners-info" component={LoyaltyPartnerInfo} />
      <Stack.Screen name="loyaltyPoints-partners-transfer" component={LoyaltyPartnersTransfer} />

      <Stack.Screen name="loyaltyPoints-travel-list" component={LoyaltyTravelList} />

      <Stack.Screen name="loyaltyPoints-goods-list" component={LoyaltyGoodsList} />
      <Stack.Screen name="loyaltyPoints-goods-info" component={LoyaltyGoodsInfo} /> 

    </Stack.Navigator>
  );
};

export default LoyaltyPointsNavigator;
