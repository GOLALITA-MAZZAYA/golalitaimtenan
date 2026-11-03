import {StyleSheet, View} from "react-native"
import {isRTL} from "../../../../../utils";
import {colors} from "../../../../components/colors";
import TimeSvg from '../../../../assets/loyaltyPoints/time.svg';
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {useTranslation} from "react-i18next";

const ExpireDateBlock = ({value, title, style}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();
    
    const titleText = title || t('LoyaltyOffers.expiryDate');
    
    return (
        <View style={[
            style,
            styles.wrapper,
            {backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder, flexDirection: isRtl? 'row-reverse': 'row'}]}
        >
            <View style={[styles.iconBlock,{backgroundColor: colors.loyaltyPrimaryIconBackground}]}>
               <TimeSvg color={colors.loyaltyPrimary}/>
            </View>

            <View style={styles.descriptionBlock}>
                <TypographyText 
                  font={BALOO_2}
                  title={titleText}
                  textColor={colors.loyaltyTextMainTitle}
                  size={16}
                />

                <TypographyText 
                  font={BALOO_2}
                  title={value}
                  textColor={colors.loyaltySecondary}
                  size={14}
                />
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
   wrapper: {
     borderWidth: 1,
     height: 79,
     borderRadius: 38,
     paddingVertical: 18,
     paddingHorizontal: 26,
     justifyContent: 'center'
   },
   iconBlock: {
     width: 37,
     height: 37,
     borderRadius: 13,
     justifyContent: 'center',
     alignItems: 'center'
   },
   descriptionBlock: {
     marginHorizontal: 11,
     flex: 1,
     justifyContent: 'center'
   }
});

export default ExpireDateBlock;