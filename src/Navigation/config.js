export const linking = {
  prefixes: ["golalita://"],
  config: {
    screens: {
      Home: {
        screens: {
          TabsBar: {
            screens: {
              myVouchers: {
                screens: {
                  ["myVouchers-list"]: "giftcards",
                },
              },
            },
          },
        },
      },
    },
  },
};
