import {Image, StyleSheet, View} from "react-native";
import {useTheme} from "../../../../components/ThemeProvider";
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";
import OkSvg from '../../../../assets/loyaltyPoints/ok.svg'
import {isRTL} from "../../../../../utils";
import {BALOO_REGULAR, BALOO_SEMIBOLD} from "../../../../redux/types";


const HistoryCard = ({title, description, value, index}) => {
    const {isDark} = useTheme();
    
    const isGift = value > 0;
    const valueString =  `${isGift ? '-' :' +'}${value}`;

   
    const isRtl = isRTL();

    return (
      <View style={[styles.wrapper,
         {marginTop: index ? 25: 0},
         {backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder }
         ]}>

        <View style={styles.logoWrapper}>
             <OkSvg />
        </View>

        <View style={styles.descriptionWraper}>

              <TypographyText
                title={title}
                textColor={
                 colors.loyaltyTextMainTitle
                }
                style={styles.title}
                numberOfLines={2}
                font={BALOO_SEMIBOLD}
              />
              <TypographyText
                title={description}
                textColor={
                 colors.loyaltyTextSecondary
                }
                fontSize={12}
                font={BALOO_REGULAR}
                
              />

        </View>
        
        <View style={styles.rightBlock}>
        <View style={styles.valueWrapper}>
              <TypographyText
                title={valueString}
                textColor={
                 colors.loyaltyTextPrimary
                }
                style={styles.value}
              />
              <TypographyText
                title={'Points'}
                textColor={
                 colors.loyaltyTextPrimary
                }
                style={styles.valueText}
              />
        </View>
              <TypographyText
                title={'Confirmed'}
                textColor={
                 colors.loyaltyTextPrimary
                }
                style={styles.confirmText}
              />
        </View>
         
      </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      height: 96,
      borderRadius: 34,
      padding: 20,
      borderWidth: 1,
      alignItems: 'center'
    },
    logoWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 48,
      height: 48,
      backgroundColor: '#1E2B21',
      borderRadius: 13
    },
    descriptionWraper: {
      flex: 1,
      justifyContent: 'space-between',
      marginLeft: 12
    },
    valueWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: 77
    },
    title: {
        fontSize: 14,
        fontWeight: '500'
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 2,
        textAlign: 'right'
    },
    valueText: {
      fontSize: 14,
      marginLeft: 2,
      textAlign: 'right'
    },
    confirmText: {
      fontSize: 12,
      color: '#53C361',
      textAlign: 'right'
    },
    rightBlock: {
      marginLeft: 12
    }

});


export default HistoryCard;