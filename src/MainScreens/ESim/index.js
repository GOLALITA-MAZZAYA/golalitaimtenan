import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ESimLanding from './ESimLanding';
import ESimCountries from './ESimCountries';
import ESimPlans from './ESimPlans';
import ESimPayment from './ESimPayment';
import ESimReady from './ESimReady';
import ESimInstall from './ESimInstall';
import ESimActivation from './ESimActivation';
import ESimOrderStatus from './ESimOrderStatus';
import ESimHelp from './ESimHelp';
import ESimHelpTopic from './ESimHelpTopic';
import ESimHelpArticle from './ESimHelpArticle';
import ESimHelpDevices from './ESimHelpDevices';
import ESimOrders from './ESimOrders';
import ESimTopups from './ESimTopups';

const Stack = createStackNavigator();

const ESimNavigator = () => (
  <Stack.Navigator
    initialRouteName="ESimLanding"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="ESimLanding" component={ESimLanding} />
    <Stack.Screen name="ESimCountries" component={ESimCountries} />
    <Stack.Screen name="ESimPlans" component={ESimPlans} />
    <Stack.Screen name="ESimPayment" component={ESimPayment} />
    <Stack.Screen name="ESimReady" component={ESimReady} />
    <Stack.Screen name="ESimInstall" component={ESimInstall} />
    <Stack.Screen name="ESimActivation" component={ESimActivation} />
    <Stack.Screen name="ESimOrderStatus" component={ESimOrderStatus} />
    <Stack.Screen name="ESimHelp" component={ESimHelp} />
    <Stack.Screen name="ESimHelpTopic" component={ESimHelpTopic} />
    <Stack.Screen name="ESimHelpArticle" component={ESimHelpArticle} />
    <Stack.Screen name="ESimHelpDevices" component={ESimHelpDevices} />
    <Stack.Screen name="ESimOrders" component={ESimOrders} />
    <Stack.Screen name="ESimTopups" component={ESimTopups} />
  </Stack.Navigator>
);

export default ESimNavigator;
