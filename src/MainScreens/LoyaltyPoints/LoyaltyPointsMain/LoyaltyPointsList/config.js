import i18next from 'i18next';
import {navigate} from '../../../../Navigation/RootNavigation';

export const getQuickActionsData = (isDark) => {
return [
    {
        title: i18next.t('LoyaltyMain.redeemNow'),
        description: i18next.t('LoyaltyMain.usePoints'),
        icon: isDark ? require('../../../../assets/loyaltyPoints/categories/redeem.png'): require('../../../../assets/loyaltyPoints/categories/redeem_light.png'),
        onPress: () => navigate('loyaltyPoints-categories')
    },
      {
        title: i18next.t('LoyaltyMain.transactions'),
        description: i18next.t('LoyaltyMain.transactionsInfo'),
        icon: isDark ? require('../../../../assets/loyaltyPoints/categories/transactions.png'): require('../../../../assets/loyaltyPoints/categories/transactions_light.png'),
        onPress: () => navigate('loyaltyPoints-transactions')       
    },
    {
        title: i18next.t('LoyaltyMain.shop'),
        description: i18next.t('LoyaltyMain.shop'),
        icon: isDark ? require('../../../../assets/loyaltyPoints/categories/shops.png'): require('../../../../assets/loyaltyPoints/categories/shops_light.png'),
        onPress: () => navigate('loyaltyPoints-transactions') 
    },
]
}
