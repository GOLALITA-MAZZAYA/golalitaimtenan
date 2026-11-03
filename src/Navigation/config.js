import { org } from '../org/config';

export const linking = {
  prefixes: [org.urlScheme],
  config: {
    screens: {
      // "Main" wraps DrawerNavigator as a screen of the persistent root
      // Stack (see Root.jsx) — Home is now one level deeper than before.
      Main: {
        screens: {
          Home: {
            screens: {
              TabsBar: {
                screens: {
                  Charities: "charities",
                  Main: "home",
                  loyaltyPoints: {
                      screens: {
                         "restaurant-skipcache-payment-status": "restaurant-payment-result",
                         "clinics-appointment-payment-status": "clinic-payment-result",
                         "saloons-appointment-payment-status": "saloon-payment-result"
                      }
                  }
                },
              },
            },
          },
        },
      },
    },
  },
};

