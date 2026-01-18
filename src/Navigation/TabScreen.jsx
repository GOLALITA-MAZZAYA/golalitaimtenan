import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import React from "react";
import {ButtonTabBar} from "../components/ButtonTabBar";
import {MainStackScreen} from "./MainStack";

const Tabs = createBottomTabNavigator();
export const TabsScreen= () => {
  return <Tabs.Navigator screenOptions={{
    headerShown: false,
    keyboardHidesTabBar: true,
    tabBarHideOnKeyboard: true,
    keyboardVerticalOffset: -25
  }} tabBar={(props) => <ButtonTabBar {...props} />}>
    <Tabs.Screen name="TabsBar" component={MainStackScreen}/>
  </Tabs.Navigator>
}

