import {useTranslation} from "react-i18next";
import {StyleSheet, View} from "react-native";
import {useTheme} from "../../../../components/ThemeProvider";
import {colors} from "../../../../components/colors";
import CommonButton from "../../../../components/CommonButton/CommonButton";
import useUserLoyaltyPoints from "../../../../hooks/useUserLoyaltyPoints";
import {TypographyText} from "../../../../components/Typography";

const RedeemLayout = ({title, subTitle, price, loading, onRedeemPress}) => {
    const {points} = useUserLoyaltyPoints();
    const {t} = useTranslation();
    const {isDark} = useTheme();

    const textColor = isDark ? colors.white: 'black'

    return (
       <View style={styles.wrapper}>

            <TypographyText
                title={title}
                textColor={textColor}
                size={22}  
                style={styles.title}              
            />

            <TypographyText
                title={subTitle}
                textColor={textColor}
                size={16}   
                style={styles.subTitle}             
            />

     <View style={styles.priceWrapper}>
            <View style={styles.block}>


            <TypographyText
                title={points}
                textColor={textColor}
                size={24}   
                style={styles.valueText}             
            />
             <TypographyText
                title={t('LoyaltyMain.availablePoints')}
                textColor={textColor}
                size={16} 
                style={styles.valueDescription}               
            />
            </View>

            <View>
            <TypographyText
                title={price}
                textColor={textColor}
                size={24} 
                style={styles.valueText}                
            />
                 <TypographyText
                title={t('LoyaltyMain.pointsNeeded')}
                textColor={textColor}
                size={16} 
                style={styles.valueDescription}                
            />
            </View>
            </View>


            <CommonButton
                loading={loading}
                label={t('LoyaltyMain.redeem')}
                style={
                  styles.redeemBtn
                }
                onPress={onRedeemPress}
            />
 
       </View>
    )
};

const styles = StyleSheet.create({
   wrapper: {
     flex: 1,
     justifyContent: 'center',
     marginBottom: 80
   },
   title: {
     marginTop: 20,
     textAlign: 'center'
   },
   subTitle: {
      marginTop: 20,
      textAlign: 'center'
   },
   redeemBtn: {
    marginTop: 40
   },
   block: {
  
   },
   priceWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 80
   },
   valueText: {
     fontWeight: '700'
   },
   valueDescription: {

   }
});

export default RedeemLayout;