import {navigate} from '../../../../Navigation/RootNavigation';

export const LOYALTY_POINTS_LIST = [
    {
        source: require('../../../../assets/loyaltyPoints/home/info.jpg'),
        onPress: () => navigate('loyaltyPoints-info')
    },
      {
        source: require('../../../../assets/loyaltyPoints/home/redeem.jpg'),
        onPress: () => navigate('loyaltyPoints-categories')       
    },
    {
        source: require('../../../../assets/loyaltyPoints/home/transactions.jpg'),
        onPress: () => navigate('loyaltyPoints-transactions') 
    },
]
