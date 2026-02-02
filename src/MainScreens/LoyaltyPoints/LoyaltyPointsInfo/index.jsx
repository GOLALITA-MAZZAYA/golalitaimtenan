import {FlatList, StyleSheet} from "react-native";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import {navigate} from "../../../Navigation/RootNavigation";
import {TypographyText} from "../../../components/Typography";
import {useTranslation} from "react-i18next";
import {useTheme} from "../../../components/ThemeProvider";
import {colors} from "../../../components/colors";
import ListCard from "../common/ListCard";
import i18next from "i18next";
import TravelWithPoints from "./TravelWithPoints";


export const getQuickActionsData = (isDark) => {
return [
    {
        title: i18next.t('LoyaltyInfo.redeem'),
        description: i18next.t('LoyaltyInfo.redeemDescription'),
        icon: isDark ? require('../../../assets/loyaltyPoints/categories/redeem.png'): require('../../../assets/loyaltyPoints/categories/redeem_light.png'),
        onPress: () => navigate('loyaltyPoints-categories'),
    },
    {
        title: i18next.t('LoyaltyInfo.scan'),
        description: i18next.t('LoyaltyInfo.scanDescription'),
        icon: isDark ? require('../../../assets/loyaltyPoints/categories/scan.png'): require('../../../assets/loyaltyPoints/categories/scan_light.png'),
        onPress: () => navigate('loyaltyPoints-transactions'),       
    },
   {
        title: i18next.t('LoyaltyInfo.transactions'),
        description: i18next.t('LoyaltyInfo.transactionsDescription'),
        icon: isDark ? require('../../../assets/loyaltyPoints/categories/transactions.png'): require('../../../assets/loyaltyPoints/categories/transactions_light.png'),
        onPress: () => navigate('loyaltyPoints-transactions'),       
    },
    {
        title: i18next.t('LoyaltyInfo.giftCards'),
        description: i18next.t('LoyaltyInfo.giftCardsDescription'),
        icon: isDark ? require('../../../assets/loyaltyPoints/categories/gift.png'): require('../../../assets/loyaltyPoints/categories/gift_light.png'),
        onPress: () => navigate("loyaltyPoints-giftCards-list"),
    },
    {
        title: i18next.t('LoyaltyInfo.vouchers'),
        description: i18next.t('LoyaltyInfo.vouchersDescription'),
        icon: !isDark ? require('../../../assets/loyaltyPoints/categories/voucher.png'): require('../../../assets/loyaltyPoints/categories/voucher_light.png'),
        onPress: () => navigate('loyaltyPoints-vouchers-list'),       
    },
    {
        title: i18next.t('LoyaltyInfo.partners'),
        description: i18next.t('LoyaltyInfo.partnersDescription'),
        icon: !isDark ? require('../../../assets/loyaltyPoints/categories/partner.png'): require('../../../assets/loyaltyPoints/categories/partner_light.png'),
        onPress: () => navigate('loyaltyPoints-partners-list'), 
    },
]
}


const LoyaltyPointsInfo = () => {

    const {t} = useTranslation();
    const {isDark} = useTheme();
    
   
    const data = getQuickActionsData(isDark)



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

        <FlatList 
          showsVerticalScrollIndicator={false}
          data={data}
          ListHeaderComponent={() => (
            <>
         <TypographyText
                title={t('LoyaltyInfo.title')}
                style={styles.title}  
                textColor={colors.loyaltyTextPrimary}            
         />
         <TypographyText
                title={t('LoyaltyInfo.subTitle')}
                style={styles.subTitle}
                textColor={titleColor}                
         />
           </>
          )}
          renderItem={({item}) => <ListCard {...item} style={styles.card} isDark={isDark}/>}
          ListFooterComponent={() => <TravelWithPoints />}
        />

      </MainLayout>
    )
};

const styles = StyleSheet.create({
    contentStyle: {
      flexGrow: 1,
      paddingBottom: 180,
      paddingHorizontal: 20
    },
    list: {
      marginTop: 20
    },
    contentContainerStyle: {
       marginHorizontal: 20,
       paddingBottom: 160
    },
    title: {
      fontSize: 25
    },
    subTitle: {
     fontSize: 14,
     color: colors.loyaltyTextSecondary,
     marginTop: 4,
     marginBottom: 10
    },
    card: {
      marginTop: 12
    }

});

export default LoyaltyPointsInfo;