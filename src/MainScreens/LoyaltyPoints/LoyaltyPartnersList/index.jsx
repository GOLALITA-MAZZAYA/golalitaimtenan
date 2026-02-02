import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import Tabs from "../../../components/Tabs";
import TransferTab from "./TransferTab";
import ListTab from "./ListTab";
import HandBagSvg from '../../../assets/loyaltyPoints/partners/handbag.svg';
import TransferSvg from '../../../assets/loyaltyPoints/partners/transfer.svg';

const LoyaltyPartnersList = () => {
  const { t } = useTranslation();

  return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyPartners.title')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
       <Tabs defaultActiveTab="partners-list" style={styles.tabsWrapper}>
 
        <Tabs.TabWithIcon name="partners-list" title={t('LoyaltyPartners.partners')} icon={<HandBagSvg/>}/>
        <Tabs.TabWithIcon
          name="products-transfer"
          title={t('LoyaltyPartners.transfer')}
          style={{ marginLeft: 10 }}
          icon={<TransferSvg />}
        />


      <Tabs.Content name="partners-list">
        <ListTab />
      </Tabs.Content>

      <Tabs.Content name="products-transfer">
         <TransferTab />
      </Tabs.Content>
      </Tabs>
    </MainLayout>
  );
};


const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    marginTop: 20
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 160
  },
  tabsWrapper: {

  }
});

export default LoyaltyPartnersList;
