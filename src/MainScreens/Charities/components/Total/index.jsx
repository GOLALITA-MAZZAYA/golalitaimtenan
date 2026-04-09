import {StyleSheet, View} from "react-native"
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {isRTL} from "../../../../../utils";
import {useTranslation} from "react-i18next";

const Total = ({value, style}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();

    return (
        <View style={[styles.wrapper,style,{flexDirection: isRtl ?'row-reverse': 'row', backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
           <TypographyText 
              font={BALOO_2}
              title={t('Charities.total')}
              textColor={colors.loyaltyTextMainTitle}
              style={styles.title}
              size={16}
           />
           
           <View style={[styles.priceBlock,{flexDirection: isRtl ?'row-reverse': 'row'}]}>
             <TypographyText 
              font={BALOO_2}
              size={16}
              style={styles.priceText}
              textColor={colors.loyaltyPrimary}
              title={value}
             />
             <TypographyText 
              font={BALOO_2}
              title={t('Charities.qar')}
              size={12}
              textColor={colors.loyaltyPrimary}
              style={styles.priveSignText}
             />
           </View>
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      padding: 20,
      borderRadius: 20,
      borderWidth: 1
    },
    priceBlock: {
       justifyContent: 'space-between',
       alignItems: 'flex-end'
    },
    title: {
        fontWeight: '700',
        flex: 1
    },
    priceText: {
        fontWeight: '700'
    },
    priveSignText: {
        marginLeft: 5,
        marginBottom: 2
    }
});

export default Total;