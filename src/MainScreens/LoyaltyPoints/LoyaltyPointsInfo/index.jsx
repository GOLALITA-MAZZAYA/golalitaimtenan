import {FlatList, StyleSheet} from "react-native";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import InfoCard from "./InfoCard";
import {navigate} from "../../../Navigation/RootNavigation";
import {TypographyText} from "../../../components/Typography";
import {useTranslation} from "react-i18next";
import {useTheme} from "../../../components/ThemeProvider";
import {colors} from "../../../components/colors";


const LoyaltyPointsInfo = () => {

    const {t} = useTranslation();
    const {isDark} = useTheme();
    
    const CONFIG = [
    {
       title: t('LoyaltyInfo.redeemTitle'),
       description: t('LoyaltyInfo.redeemDescription'),
       onPress: () => navigate('loyaltyPoints-categories'),
       source: require('../../../assets/loyaltyPoints/info/1.png')
    },
    {
       title: t('LoyaltyInfo.myTransactionTitle'),
       description: t('LoyaltyInfo.myTransactionDescription'),
       onPress: () => navigate('loyaltyPoints-transactions'),
       source: require('../../../assets/loyaltyPoints/info/3.png')
    },
    {
       title: t('LoyaltyInfo.giftCardsTitle'),
       description: t('LoyaltyInfo.giftCardsDescription'),
       onPress: () => navigate("loyaltyPoints-giftCards-list"),
       source: require('../../../assets/loyaltyPoints/info/2.png')
    },
    {
       title: t('LoyaltyInfo.scanTitle'),
       description: t('LoyaltyInfo.scanDescription'),
       onPress: () =>  navigate('BillScannerHoToUse', {
          title: t('Drawer.scanBill'),
      }),
       source: require('../../../assets/loyaltyPoints/info/8.png')
    },
    {
       title: t('LoyaltyInfo.vouchersTitle'),
       description: t('LoyaltyInfo.vouchersDescription'),
       onPress: () => navigate('loyaltyPoints-vouchers-list'),
       source: require('../../../assets/loyaltyPoints/info/7.png')
    },
    {
       title: t('LoyaltyInfo.partnersTitle'),
       description: t('LoyaltyInfo.partnersDescription'),
       onPress: () => navigate('loyaltyPoints-partners-list'),
       source: require('../../../assets/loyaltyPoints/info/4.png')
    },
    {
       title: t('LoyaltyInfo.travelTitle'),
       description: t('LoyaltyInfo.travelDescription'),
       onPress: () => {},
       source: require('../../../assets/loyaltyPoints/info/6.png')
    },
    {
       title: t('LoyaltyInfo.goodsTitle'),
       description: t('LoyaltyInfo.goodsDescription'),
       onPress: () => {},
       source: require('../../../assets/loyaltyPoints/info/5.png')
    },

];

   const titleColor = isDark ? 'white': colors.mainDarkModeText;


    return (
      
    <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={''} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
    >
            <TypographyText
                title={t('LoyaltyInfo.title')}
                style={styles.title}  
                textColor={titleColor}            
            />
            <TypographyText
                title={t('LoyaltyInfo.subTitle')}
                style={styles.subTitle}
                textColor={titleColor}                
            />

        <FlatList 
            data={CONFIG}
            renderItem={({item, index}) => <InfoCard {...item} style={{marginTop: !index? 0 : 20, borderWidth: 1, borderColor: isDark ? 'transparent': colors.mainDarkModeText}} />}
            contentContainerStyle={styles.contentContainerStyle}
            style={styles.list}
        />

      </MainLayout>
    )
};

const styles = StyleSheet.create({
    contentStyle: {
      flexGrow: 1,
    },
    list: {
      marginTop: 20
    },
    contentContainerStyle: {
       marginHorizontal: 20,
       paddingBottom: 160
    },
    title: {
      paddingHorizontal: 40,
      fontSize: 25
    },
    subTitle: {
      paddingHorizontal: 40,
     fontSize: 16
    }

});

export default LoyaltyPointsInfo;