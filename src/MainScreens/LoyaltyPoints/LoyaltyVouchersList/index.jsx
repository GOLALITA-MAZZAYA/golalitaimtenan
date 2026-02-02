import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import Tabs from "../../../components/Tabs";
import {useTranslation} from "react-i18next";
import ListTab from "./ListTab";
import HistoryTab from "./HistoryTab";
import VouchersSvg from '../../../assets/loyaltyPoints/vouchers/vouchers.svg';
import TimeSvg from '../../../assets/loyaltyPoints/products/time.svg';

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
        
        <Tabs defaultActiveTab="vouchers-list" style={styles.tabsWrapper}>
 
        <Tabs.TabWithIcon name="vouchers-list" title={t('LoyaltyVouchers.products')} icon={<VouchersSvg/>}/>
        <Tabs.TabWithIcon
          name="vouchers-history"
          title={t('LoyaltyVouchers.history')}
          style={{ marginLeft: 10 }}
          icon={<TimeSvg />}
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
      marginHorizontal: 20,
      marginTop: 30
    },
    banners: {
      alignSelf: 'center'
    }
});

export default LoyaltyVouchersHistory;