import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import {useTranslation} from "react-i18next";
import ListTab from "./ListTab";

const LoyaltyGoPointsMerchantsList = () => {
    const {t} = useTranslation();

    return (
         <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyInfo.merchantsWithPointsTitle')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        
         <ListTab />
      </MainLayout>
    )
};

const styles = StyleSheet.create({
    contentStyle: {
      height: SCREEN_HEIGHT,
      flexGrow: 1,
      paddingHorizontal: 0,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0 ,   
      paddingHorizontal: 20, 

    },
    tabsWrapper: {
      marginHorizontal: 20,
      marginTop: 30
    },
    banners: {
      alignSelf: 'center'
    }
});

export default LoyaltyGoPointsMerchantsList;