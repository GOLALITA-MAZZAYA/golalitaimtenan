import {useTranslation} from "react-i18next";
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import RightArrowSvg from '../../../../assets/loyaltyPoints/rightArrow.svg';
import {TypographyText} from "../../../../components/Typography";
import {colors} from "../../../../components/colors";
import i18next from "i18next";
import {isRTL} from "../../../../../utils";


const TravelWithPoints = () => {
    const {t} = useTranslation();
    const isRtl = isRTL();

    const data = [
    {
        source: require('../../../../assets/loyaltyPoints/info/travel1.png'),
        title: i18next.t('LoyaltyInfo.travelItemTitle'),
        description: i18next.t('LoyaltyInfo.travelItemDescription'),
    },
    {
        source: require('../../../../assets/loyaltyPoints/info/travel2.png'),
        title: i18next.t('LoyaltyInfo.travelItemTitle2'),
        description: i18next.t('LoyaltyInfo.travelItemDescription2'),
    },
];

    return (

        <View style={styles.wrapper}>
        
        <View style={styles.titleWrapper}>
        <TypographyText
            title={t('LoyaltyInfo.travelWithPoints')}
            style={styles.title}
            textColor={colors.loyaltyTextPrimary}
        />
         <TypographyText
            title={t('LoyaltyInfo.travelWithPointsDescription')}
            style={styles.description}
            textColor={colors.loyaltyTextSecondary}
        />
        </View>

        <FlatList
          style={styles.flatList}
          horizontal
          data={data}
          renderItem={({item}) => (
            <ImageBackground source={item.source} style={styles.backgroundImage}>
            <TouchableOpacity style={[
                styles.card,
                {flexDirection: isRtl ? 'row-reverse': 'row'}
            ]}>
            
            <View style={styles.descriptionBlock}>
            <TypographyText
              title={item.title}
              style={styles.title}
              textColor={'#fff'}
              numberOfLines={1}
            />
            <TypographyText
              title={item.description}
              style={styles.description}
              textColor={'#fff'}
              numberOfLines={3}
              
            />
            </View>

            <View style={[
                styles.arrowBlock,
                {paddingLeft: isRtl ? 0:  10, paddingRight: isRtl ? 10: 0},
                {transform: [
                { rotate: isRTL() ? "180deg": '0deg' },
                ]}
                ]}>
                <RightArrowSvg />
            </View>

            </TouchableOpacity>
            </ImageBackground>
          )}
        
        />

        </View>

    )
};

const styles = StyleSheet.create({
   wrapper: {
    marginTop: 48
   },
   card: {
     flexDirection: 'row',
     width: 263,
     height: 103,
     borderRadius: 20,
     padding: 20
   },
   descriptionBlock: {
     flex: 1
   },
   backgroundImage: {
     width: 263,
     height: 103,
     borderRadius: 20,
     marginRight: 12
   },
   title: {
    fontSize: 17,
    fontWeight: '700'
   },
   description: {
    fontSize: 14,
    marginTop: 4
   },
   flatList: {
    marginTop: 10
   },
   arrowBlock: {
     justifyContent: 'center',
     alignItems: 'center'
   }
});

export default TravelWithPoints;