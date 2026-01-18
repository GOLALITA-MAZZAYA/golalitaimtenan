import {Image, StyleSheet, View} from "react-native";
import {useTheme} from "../../../../components/ThemeProvider";
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";

const giftImg = require('../../../../assets/loyaltyPoints/gift.png');
const plusImg = require('../../../../assets/loyaltyPoints/plus.png');


const HistoryCard = ({title, description, value, index}) => {
    const {isDark} = useTheme();
    
    const isGift = value > 0;
    const logoSource = isGift ? giftImg: plusImg ;
    const mainTextColor = isDark ? colors.white : colors.mainDarkModeText;
    const valueString =  `${isGift ? '- ' :' + '}${value}`;
    const valueColor = isGift ?'#C00000' : '#85BB65';
    const borderBottomColor = isDark ? 'white': colors.mainDarkModeText;
   


    return (
      <View style={[styles.wrapper, {marginTop: index ? 25: 0,  borderBottomColor}]}>

        <View style={styles.logoWrapper}>
             <Image source={logoSource} style={styles.logo}/>
        </View>

        <View style={styles.descriptionWraper}>

              <TypographyText
                title={title}
                textColor={
                 mainTextColor
                }
                style={styles.title}
                numberOfLines={2}
              />
              <TypographyText
                title={description}
                textColor={
                 mainTextColor
                }
              />

        </View>

        <View style={styles.valueWrapper}>
              <TypographyText
                title={valueString}
                textColor={
                 valueColor
                 }
                 style={styles.value}
              />
        </View>
         
      </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      width: '100%',
      borderBottomWidth: 1,
      paddingBottom: 15,
      height: 85
    },
    logoWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: '100%'
    },
    logo: {
        width: 60,
        height: 60
    },
    descriptionWraper: {
      flex: 1,
      justifyContent: 'space-between'
    },
    valueWrapper: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
        fontSize: 15,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10
    }

});


export default HistoryCard;