import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {useTranslation} from "react-i18next";
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";
import CommonButton from "../../../../components/CommonButton/CommonButton";


const PartnerListCard = ({uri, title, isDark, onPress, submitText, howToUse}) => {
    const {t} = useTranslation();

    const titleColor = isDark ? colors.mainDarkMode: colors.darkBlue;
    const textColor = isDark ? colors.white : colors.mainDarkModeText;
    const btnTextColor = isDark ? colors.mainDarkModeText: colors.white;

    return (
       <TouchableOpacity style={styles.wrapper}>
        <View style={styles.block}>
            <View style={styles.logoWrapper}>
              <Image source={{uri}} style={styles.logo} resizeMode="cover"/>
            </View>

            <View style={styles.descriptionBlock}>
                     <TypographyText
                        textColor={titleColor}
                        size={18}
                        title={title}
                        style={styles.title}
                    />

                <View style={{flexGrow: 1}}>
                     <TypographyText
                        textColor={textColor}
                        size={15}
                        title={t('LoyaltyPartners.howToRedeem')}
                        style={styles.redeemTitle}
                        numberOfLines={2}
                    />
         
                    <TypographyText
                        textColor={textColor}
                        size={13}
                        title={howToUse}
                        style={styles.redeemText}
                 
                    />
              
                </View>
            </View>

        </View>

        <CommonButton
                label={submitText}
                style={styles.bookNowBtn}
                onPress={onPress}
                textColor={btnTextColor}
        />

       </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
       paddingBottom: 25,
       marginBottom: 25,
       borderBottomWidth: 1,
       borderBottomColor: colors.categoryGrey,
       flex: 1,
    },
    block: {
     flexDirection: 'row',
     flex: 1
    },
    logoWrapper: {
       justifyContent: 'center',
       alignItems: 'center',
    },
    logo: {
        width: 110,
        height: 110,
        borderRadius: 8
    },
    title: {
      fontWeight: '700',
      flexGrow: 1,
    },
    redeemTitle: {
      marginTop: 10,
      fontWeight: '700',
      marginBottom: 2
    },
    redeemText: {
      marginTop: 2,
      fontWeight: '600',
      flexGrow: 1,
    },
    bookNowBtn: {
      marginTop: 25,
      width: 240,
      borderRadius: 14,
      alignSelf: 'center'
    },
    descriptionBlock: {
        marginLeft: 10,
        flex: 1
    }
});


export default PartnerListCard;