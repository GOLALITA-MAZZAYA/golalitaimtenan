export const linking = {
  prefixes: ['golalitaimtenanrewards://'],
  config: {
    screens: {
      // Drawer → MainStack (TabsBar shell removed)
      Home: {
        screens: {
          Main: 'home',
          Charities: 'charities',
          myVouchers: {
            path: 'vouchers',
            screens: {
              'myVouchers-list': 'list',
            },
          },
          AllOffers: {
            path: 'offers',
            screens: {
              'offers-list': '',
              'offer-info': 'info',
            },
          },
          merchant: {
            path: 'merchant',
            screens: {
              'merchant-info': 'info',
            },
          },
          ARMap: {
            path: 'ar',
            screens: {
              ARHowToUse: 'howto',
              ARMerchants: 'merchants',
            },
          },
          MapPage: 'map',
          Notifications: 'notifications',
          card: 'card',
          Profile: 'profile',
        },
      },
    },
  },
};
