import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import Tabs from "../../../components/Tabs";
import {useTranslation} from "react-i18next";
import ListTab from "./ListTab";
import MP4Slider from "../../../components/MP4Slider";
import HistoryTab from "./HistoryTab";

const BANNERS = [require('../../../assets/loyaltyPoints/products/1.mp4'),require('../../../assets/loyaltyPoints/products/2.mp4')]

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

        <MP4Slider 
         data={BANNERS}
         style={styles.banners}
        />
        
        <Tabs defaultActiveTab="products-list" style={styles.tabsWrapper}>
 
        <Tabs.Tab name="products-list" title={t('LoyaltyOffers.offers')} />
        <Tabs.Tab
          name="products-history"
          title={t('LoyaltyOffers.history')}
          style={{ marginLeft: 10 }}
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
      paddingHorizontal: 20,
      marginTop: 30
    },
    banners: {
      alignSelf: 'center'
    }
});

export default LoyaltyProductsList;