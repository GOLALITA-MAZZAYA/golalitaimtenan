import {FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import RightArrowSvg from '../../../../assets/loyaltyPoints/rightArrowPrimary.svg'
import RightArrowLightSvg from '../../../../assets/loyaltyPoints/right-arrow-light.svg';
import FeaturedRewardslistItem from "./FeaturedRewardsListItem";
import BagSvg from '../../../../assets/loyaltyPoints/home/bag.svg';
import {TypographyText} from "../../../../components/Typography";
import {useTranslation} from "react-i18next";
import {colors} from "../../../../components/colors";
import i18next from "i18next";
import {isRTL} from "../../../../../utils";
import {useTheme} from "../../../../components/ThemeProvider";
import {navigate} from "../../../../Navigation/RootNavigation";

const getFeaturedRewardsList = (isDark) => {
   return [
  {
    title: i18next.t('LoyaltyMain.travel'),
    description: i18next.t('LoyaltyMain.useYourPoints'),
    btnText: i18next.t('LoyaltyTravel.select'),
    onPress: () => navigate('loyaltyPoints-travel-list'),
    source: isDark ? require('../../../../assets/loyaltyPoints/categories/travelx2.png'): require('../../../../assets/loyaltyPoints/categories/travel_lightx2.png'),
  },
  {
    image: <BagSvg />,
    title: i18next.t('LoyaltyMain.shopTheGoods'),
    description: i18next.t('LoyaltyMain.exploreTheStore'),
    btnText: i18next.t('LoyaltyMain.explore'),
    onPress: () => navigate('loyaltyPoints-goods-list'),
  },
]
};


const FeaturedRewardsList = () => {
    const {t} = useTranslation();
    const {isDark} = useTheme();


    const handleSeeAllPress = () => {
      navigate('loyaltyPoints-categories')
    }

    const data = getFeaturedRewardsList(isDark);

    return (
      <View style={styles.wrapper}>
        <View style={[styles.headerWrapper,{flexDirection: isRTL() ? 'row-reverse': 'row'}]}>
        <TypographyText
            title={t('LoyaltyMain.featuredRewards')}
            textColor={colors.loyaltyTextMain}
            size={17}
            style={styles.title}
        />

        <TouchableOpacity style={[styles.seeAllWrapper,{flexDirection: isRTL() ? 'row-reverse': 'row'}]} onPress={handleSeeAllPress}>
        <TypographyText
            title={t('LoyaltyMain.seeAll')}
            textColor={colors.loyaltyTextPrimary}
            size={14}
            style={styles.actionText}
        /> 
          <View style={{
            transform: [
              { rotate: isRTL() ? "180deg": '0deg' },
             ]
          }}>
           {isDark ? <RightArrowSvg />: <RightArrowLightSvg />}
          </View>
        </TouchableOpacity>
        </View>


        <FlatList 
           style={styles.list}
           data={data}
           horizontal
           showsHorizontalScrollIndicator={false}
           renderItem={({item}) => (
              <FeaturedRewardslistItem {...item}/>
           )}
        />

      </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      marginTop: 34
    },
    title: {

    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    seeAllWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionText: {
        marginRight: 18,
        marginLeft: 18
    },
    list: {
        marginTop: 9,
        marginLeft: 20
    }

});

export default FeaturedRewardsList;