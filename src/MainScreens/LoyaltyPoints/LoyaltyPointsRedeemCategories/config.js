import i18next from 'i18next';
import { navigate } from '../../../Navigation/RootNavigation';

export const getCategories = (isDark) => {

    return [
        {
            categoryKey: 'Increase Discount',
            title: i18next.t('LoyaltyMain.increaseDiscount'),
            icon: isDark ? require('../../../assets/loyaltyPoints/categories/redeem.png') : require('../../../assets/loyaltyPoints/categories/redeem_light.png'),
            onPress: () => navigate('loyaltyPoints-products-list')
        },
        {
            categoryKey: 'Partners',
            title: i18next.t('LoyaltyInfo.partners'),
            icon: !isDark ? require('../../../assets/loyaltyPoints/categories/partner.png') : require('../../../assets/loyaltyPoints/categories/partner_light.png'),
            onPress: () => navigate('loyaltyPoints-partners-list'),
        },
        {
            categoryKey: 'Shop',
            title: i18next.t('LoyaltyMain.shop'),
            icon: isDark ? require('../../../assets/loyaltyPoints/categories/goods.png') : require('../../../assets/loyaltyPoints/categories/goods_light.png'),
            onPress: () => navigate('loyaltyPoints-goods-list')
        },
        {
            categoryKey: 'Travel',
            title: i18next.t('LoyaltyMain.travel'),
            icon: isDark ? require('../../../assets/loyaltyPoints/categories/travel.png') : require('../../../assets/loyaltyPoints/categories/travel_light.png'),
            onPress: () => navigate('loyaltyPoints-travel-list')
        },
        {
            categoryKey: 'Gift Cards',
            title: i18next.t('LoyaltyInfo.giftCards'),
            icon: isDark ? require('../../../assets/loyaltyPoints/categories/gift.png') : require('../../../assets/loyaltyPoints/categories/gift_light.png'),
            onPress: () => navigate("loyaltyPoints-giftCards-list"),
        },
        {
            categoryKey: 'Vouchers',
            title: i18next.t('LoyaltyInfo.vouchers'),
            icon: !isDark ? require('../../../assets/loyaltyPoints/categories/voucher.png') : require('../../../assets/loyaltyPoints/categories/voucher_light.png'),
            onPress: () => navigate('loyaltyPoints-vouchers-list'),
        },
        {
            categoryKey: 'Merchants with Points',
            title: i18next.t('LoyaltyGoPointMerchants.title'),
            icon: !isDark ? require('../../../assets/loyaltyPoints/categories/goPointMerchantsLight.png') : require('../../../assets/loyaltyPoints/categories/goPointMerchantsDark.png'),
            onPress: () => navigate('loyaltyPoints-go-merchants-list'),
        },
        {
            categoryKey: 'Clinics',
            title: i18next.t('Clinics.title'),
            icon: !isDark ? require('../../../assets/loyaltyPoints/categories/clinic-light.png') : require('../../../assets/loyaltyPoints/categories/clinic-dark.png'),
            onPress: () => navigate('clinics-list'),
        },
        {
            categoryKey: 'Restaurants',
            title: i18next.t('Restaurants.title'),
            icon: !isDark ? require('../../../assets/loyaltyPoints/categories/restaurant-light.png') : require('../../../assets/loyaltyPoints/categories/restaurant-dark.png'),
            onPress: () => navigate('restaurant-list'),
        },
        {
            categoryKey: 'Saloon Appointment',
            title: i18next.t('Saloons.title'),
            icon: isDark ? require('../../../assets/loyaltyPoints/saalons/salon_dark.png') : require('../../../assets/loyaltyPoints/saalons/salon_light.png'),
            onPress: () => navigate('saloons-list'),
        },
    ]
}

const normalizeCategory = value => String(value || '').toLowerCase().trim();

export const isLoyaltyCategoryVisible = (categoryKey, categories = []) => {
    if (!categoryKey || !categories.length) {
        return true;
    }

    const normalizedCategories = categories.map(normalizeCategory);

    return normalizedCategories.includes(normalizeCategory(categoryKey));
};
