import {navigate} from '../../../Navigation/RootNavigation';

export const CATEGORIES = [
    {
        source: require('../../../assets/loyaltyPoints/categories/products.png'),
        onPress: () => navigate('loyaltyPoints-products-list')
    },
    {
        source: require('../../../assets/loyaltyPoints/categories/vouchers.png'),
        onPress: () => navigate('loyaltyPoints-vouchers-list')
    },
    {
        source: require('../../../assets/loyaltyPoints/categories/giftcards.png'),
        onPress:  () => navigate("loyaltyPoints-giftCards-list"),
    },
    {
        source: require('../../../assets/loyaltyPoints/categories/partners.png'),
        onPress: () => navigate('loyaltyPoints-partners-list')
    },
    {
        source: require('../../../assets/loyaltyPoints/categories/travelWithPoints.png'),
        onPress: () => navigate('loyaltyPoints-travel-list')
    },
    {
        source: require('../../../assets/loyaltyPoints/categories/shopTheGoods.png'),
        onPress: () => navigate('loyaltyPoints-goods-list')
    },
]