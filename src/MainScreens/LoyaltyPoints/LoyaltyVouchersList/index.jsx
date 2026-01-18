import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import Tabs from "../../../components/Tabs";
import {useTranslation} from "react-i18next";
import ListTab from "./ListTab";
import MP4Slider from "../../../components/MP4Slider";
import HistoryTab from "./HistoryTab";

const BANNERS = [require('../../../assets/loyaltyPoints/vouchers/1.mp4'),require('../../../assets/loyaltyPoints/vouchers/2.mp4')]

const LoyaltyVouchersHistory = () => {
    const {t} = useTranslation();

    return (
         <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyVouchers.title')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >

        <MP4Slider 
         data={BANNERS}
         style={styles.banners}
        />
        
        <Tabs defaultActiveTab="vouchers-list" style={styles.tabsWrapper}>
 
        <Tabs.Tab name="vouchers-list" title={t('LoyaltyVouchers.products')} />
        <Tabs.Tab
          name="vouchers-history"
          title={t('LoyaltyVouchers.history')}
          style={{ marginLeft: 10 }}
        />


      <Tabs.Content name="vouchers-list">
        <ListTab />
      </Tabs.Content>

      <Tabs.Content name="vouchers-history">
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

export default LoyaltyVouchersHistory;