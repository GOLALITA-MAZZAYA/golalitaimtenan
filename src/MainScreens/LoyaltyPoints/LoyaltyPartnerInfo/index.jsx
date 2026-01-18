import {Image, Linking, ScrollView, StyleSheet} from "react-native";
import Header from "../../../components/Header"
import MainLayout from "../../../components/MainLayout"
import {useTranslation} from "react-i18next";
import {useTheme} from "../../../components/ThemeProvider";
import {colors} from "../../../components/colors";
import {TypographyText} from "../../../components/Typography";
import CommonButton from "../../../components/CommonButton/CommonButton";


const getHowToRedeemList = (t) => (
    [
        `- ${t('LoyaltyPartners.instruction1')}`,
        `- ${t('LoyaltyPartners.instruction3')}`,
        `- ${t('LoyaltyPartners.instruction4')}`,
        `- ${t('LoyaltyPartners.instruction5')}`,
    ]
)


const LoyaltyPartnerInfo = ({route}) => {
    const {t} = useTranslation();
    const {isDark} = useTheme();
    const {partnerName, partnerLogo, website, howToRedeem} = route.params;

    const textColor = isDark ? colors.white: colors.mainDarkModeText;
    const btnTextColor = isDark ? colors.mainDarkModeText: colors.white;
    const howToRedeemList = getHowToRedeemList(t);

    const handleBookNowPress = () => {
       Linking.openURL(website)
    };

    

    return (
        <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={partnerName} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>

        <Image source={{uri: partnerLogo}} style={styles.logo} resizeMode="cover"/>

        <TypographyText
            textColor={textColor}
             size={22}
             title={t('LoyaltyPartners.instrunction6',{partnerName,interpolation: { escapeValue: false }})}
             style={styles.redeemTitle}
        />

        <TypographyText
            textColor={textColor}
             size={18}
             title={`${t('LoyaltyPartners.howToRedeem')}:`}
             style={styles.howToRedeem}
        />


            <TypographyText
            textColor={textColor}
             size={15}
             title={howToRedeem}
             style={styles.redeemText}
        />
 

        <CommonButton
                label={t('LoyaltyPartners.bookNow')}
                style={styles.bookNowBtn}
                onPress={handleBookNowPress}
                textColor={btnTextColor}
        />
        </ScrollView>

      </MainLayout>
    )
};

const styles = StyleSheet.create({
    contentStyle: {
        flex: 1,
        paddingHorizontal: 20
    },
    logo: {
        width: '100%',
        height: 220,
        marginTop: 20,
        borderRadius: 12

    },
    redeemTitle: {
      marginTop: 30,
      fontWeight: '600'
    },
    howToRedeem: {
        marginTop: 30,
        fontWeight: '600'

    },
    redeemText: {
        marginTop: 10

    },
    bookNowBtn: {
       width: 220,
       marginTop: 40,
       alignSelf: 'center'
    },
    contentContainerStyle: {
        paddingBottom: 120
    }

});

export default LoyaltyPartnerInfo;