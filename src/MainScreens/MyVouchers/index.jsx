import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GiftCard from './GiftCard';
import MyVouchers from './MyVouchers';
import Voucher from './Voucher';
import CardmolaGiftCard from './CardmolaGiftCard';

const Stack = createStackNavigator();

const MyVouchersNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: 'back',
        headerShown: false,
      }}
    >
      <Stack.Screen name="myVouchers-list" component={MyVouchers} />
      <Stack.Screen name="myVouchers-giftCard" component={GiftCard} />
      <Stack.Screen name="myVouchers-cardmolaGiftCard" component={CardmolaGiftCard} />
      <Stack.Screen name="myVouchers-voucher" component={Voucher} />
    </Stack.Navigator>
  );
};

export default MyVouchersNavigator;
