import {StyleSheet, View} from "react-native";
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";

const InfoCard = ({title, value, titleColor=colors.loyaltyTextPrimary}) => {
    return (
        <View style={[styles.wrapper,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>

            <TypographyText 
               title={title}
               size={18}
               font={BALOO_2}
               textColor={titleColor}
               style={styles.title}
            />
            <TypographyText 
               title={value}
               size={14}
               font={BALOO_2}
               textColor={colors.loyaltyTextSecondary}
               style={styles.valueText}
            />

        </View>
    )
};

const styles = StyleSheet.create({
   wrapper: {
     borderWidth: 1,
     width: 100,
     height: 87,
     borderRadius: 18,
     justifyContent: 'center',
     alignItems: 'center'
   },
   title: {
    fontWeight: '700'
   },
   valueText: {
    marginTop: 5
   }
});

export default InfoCard;