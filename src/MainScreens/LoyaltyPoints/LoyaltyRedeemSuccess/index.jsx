import {StyleSheet} from "react-native";
import MainLayout from "../../../components/MainLayout"
import {useTranslation} from "react-i18next";
import CommonButton from "../../../components/CommonButton/CommonButton";
import {useTheme} from "../../../components/ThemeProvider";
import {colors} from "../../../components/colors";
import {TypographyText} from "../../../components/Typography";
import Header from "../../../components/Header";

const LoyaltyRedeemSuccess = ({route, navigation}) => {
    const {t} = useTranslation();
    const {isDark} = useTheme();
    const {name, description} = route.params;

    const handleGoBackPress = () => {
       navigation.navigate('loyaltyPoints',{
        screen: 'loyaltyPoints-main'
       })
    };

    const textColor = isDark ?  colors.white : colors.darkBlue;

    return (
       <MainLayout
        outsideScroll={true}
        headerHeight={50}
        headerChildren={<Header label={t('General.success')} btns={['back']}/>}
        contentStyle={styles.contentStyle}
      >
                   <TypographyText
                        textColor={textColor}
                        size={20}
                        title={name}
                        style={styles.name}
                    />

                    <TypographyText
                        textColor={textColor}
                        size={20}
                        title={description}
                        style={styles.description}
                    />

                    <TypographyText
                        textColor={textColor}
                        size={18}
                        title={t('LoyaltyOffers.redeemSuccess')}
                        style={styles.success}
                    />

             <CommonButton
                label={t('LoyaltyOffers.goBack')}
                style={
                  styles.redeemBtn
                }
                onPress={handleGoBackPress}
              />
        

      </MainLayout>
    )
};

const styles = StyleSheet.create({
    contentStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 150
    },
    name: {

    },
    description: {
        marginTop: 30,
    },
    success: {
      marginTop: 50
    },
    redeemBtn: {
      marginTop: 20
    }
})


export default LoyaltyRedeemSuccess;