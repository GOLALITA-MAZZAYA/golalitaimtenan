import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import Tabs from "../../../components/Tabs";
import {useTranslation} from "react-i18next";
import ListTab from "./ListTab";
import HistoryTab from "./HistoryTab";
import PercentageSvg from '../../../assets/loyaltyPoints/products/percentage.svg';
import TimeSvg from '../../../assets/loyaltyPoints/products/time.svg';

const LoyaltyProductsList = () => {
    const {t} = useTranslation();

    return (
         <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyOffers.title')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        
      <Tabs defaultActiveTab="products-list" style={styles.tabsWrapper}>
 
        <Tabs.TabWithIcon name="products-list" title={t('LoyaltyOffers.offers')} icon={<PercentageSvg/>}/>
        <Tabs.TabWithIcon
          name="products-history"
          title={t('LoyaltyOffers.history')}
          style={{ marginLeft: 10 }}
          icon={<TimeSvg />}
        />


      <Tabs.Content name="products-list">
        <ListTab />
      </Tabs.Content>

      <Tabs.Content name="products-history">
        <HistoryTab />
      </Tabs.Content>


      </Tabs>
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
    },
    tabsWrapper: {
      marginHorizontal: 20,
      marginTop: 30
    },
    banners: {
      alignSelf: 'center'
    }
});

export default LoyaltyProductsList;