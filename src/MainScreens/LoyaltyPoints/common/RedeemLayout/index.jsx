import {useTranslation} from "react-i18next";
import {StyleSheet, View} from "react-native";
import {colors} from "../../../../components/colors";
import useUserLoyaltyPoints from "../../../../hooks/useUserLoyaltyPoints";
import {TypographyText} from "../../../../components/Typography";
import GiftSvg from '../../../../assets/loyaltyPoints/gift.svg';
import {BALOO_2} from "../../../../redux/types";
import {useNavigation} from "@react-navigation/native";
import Button from "../../../../components/Button";

const RedeemLayout = ({title, subTitle, price, loading, onRedeemPress}) => {
    const {points} = useUserLoyaltyPoints();
    const {t} = useTranslation();
    const navigation = useNavigation();

    return (
       <View style={styles.wrapper}>

            <View style={[styles.giftIcon,{backgroundColor: colors.loyaltyPrimaryIconBackground}]}>
               <GiftSvg color={colors.loyaltyPrimary}/>
            </View>

            <TypographyText
                title={subTitle}
                textColor={colors.loyaltyTextMainTitle}
                size={30}  
                style={styles.title}  
                font={BALOO_2}            
            />

            <TypographyText
                title={title}
                textColor={colors.loyaltyPrimary}
                size={14}   
                style={styles.subTitle}
                font={BALOO_2}             
            />

     <View style={styles.priceWrapper}>

            <View style={styles.block}>
            <TypographyText
                title={points}
                textColor={colors.loyaltyTextMainTitle}
                size={42}   
                style={styles.valueTextBold}
                font={BALOO_2}             
            />
             <TypographyText
                title={t('LoyaltyMain.availablePoints')}
                textColor={colors.loyaltySecondary}
                size={14} 
                style={styles.valueDescription}
                font={BALOO_2}               
            />
            </View>

            <View style={styles.block}>
            <TypographyText
                title={price}
                textColor={colors.loyaltyPrimary}
                size={42} 
                style={styles.valueTextBold}
                font={BALOO_2}                
            />
                 <TypographyText
                title={t('LoyaltyMain.pointsNeeded')}
                textColor={colors.loyaltyPrimary}
                size={14} 
                style={styles.valueDescription}
                font={BALOO_2}                
            />
            </View>
            </View>


            <Button
                loading={loading}
                text={t('LoyaltyMain.confirmRedemption')}
                style={
                  styles.redeemBtn
                }
                onPress={onRedeemPress}
            />

            <Button
                text={t('LoyaltyMain.cancel')}
                style={styles.cancelBtn}
                onPress={navigation.goBack}
                primary={false}
            />
 
       </View>
    )
};

const styles = StyleSheet.create({
   wrapper: {
     flex: 1,
     alignItems: 'center',
     marginBottom: 80,
     paddingTop: 30
   },
   title: {
     marginTop: 20,
     textAlign: 'center',
     fontWeight: '700'
   },
   subTitle: {
      marginTop: 20,
      textAlign: 'center'
   },
   redeemBtn: {
    alignSelf: 'stretch',
    marginTop: 60
   },
   block: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 40
   },
   priceWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 40
   },
   valueTextBold: {
     fontWeight: '700'
   },
   valueDescription: {

   },
   giftIcon: {
     width: 100,
     height: 100,
     borderRadius: 30,
     justifyContent: 'center',
     alignItems: 'center'
   },
   cancelBtn: {
    marginTop: 5
   }
});

export default RedeemLayout;