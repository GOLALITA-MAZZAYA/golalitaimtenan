import i18next from 'i18next';
import {navigate} from '../../../Navigation/RootNavigation';

export const getCategories = (isDark) => {
    
return [
    {
        title: i18next.t('LoyaltyMain.redeemNow'),
        icon: isDark ? require('../../../assets/loyaltyPoints/categories/redeem.png'): require('../../../assets/loyaltyPoints/categories/redeem_light.png'),
        onPress: () => navigate('loyaltyPoints-products-list')
    },
    {
        title: i18next.t('LoyaltyInfo.partners'),
        icon: !isDark ? require('../../../assets/loyaltyPoints/categories/partner.png'): require('../../../assets/loyaltyPoints/categories/partner_light.png'),
        onPress: () => navigate('loyaltyPoints-partners-list'),     
    },
    {
        title: i18next.t('LoyaltyMain.goods'),
        icon: isDark ? require('../../../assets/loyaltyPoints/categories/goods.png'): require('../../../assets/loyaltyPoints/categories/goods_light.png'),
        onPress: () => navigate('loyaltyPoints-goods-list') 
    },
    {
        title: i18next.t('LoyaltyMain.travel'),
        icon: isDark ? require('../../../assets/loyaltyPoints/categories/travel.png'): require('../../../assets/loyaltyPoints/categories/travel_light.png'),
        onPress: () => navigate('loyaltyPoints-travel-list') 
    },
    {
        title: i18next.t('LoyaltyInfo.giftCards'),
        icon: isDark ? require('../../../assets/loyaltyPoints/categories/gift.png'): require('../../../assets/loyaltyPoints/categories/gift_light.png'),
        onPress: () => navigate("loyaltyPoints-giftCards-list"),
    },
    {
        title: i18next.t('LoyaltyInfo.vouchers'),
        icon: !isDark ? require('../../../assets/loyaltyPoints/categories/voucher.png'): require('../../../assets/loyaltyPoints/categories/voucher_light.png'),
        onPress: () => navigate('loyaltyPoints-vouchers-list'),       
    },
]
}
