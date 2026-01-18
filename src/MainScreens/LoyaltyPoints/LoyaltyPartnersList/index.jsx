import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import Tabs from "../../../components/Tabs";
import TransferTab from "./TransferTab";
import ListTab from "./ListTab";
import MP4Slider from "../../../components/MP4Slider";

const BANNERS = [require('../../../assets/loyaltyPoints/partners/partners.mp4')];

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
      <MP4Slider
         data={BANNERS}
         style={styles.banners}
      />
    <Tabs defaultActiveTab="partners-list" style={styles.tabsWrapper}>
 
        <Tabs.Tab name="partners-list" title={t('LoyaltyPartners.partners')} />
        <Tabs.Tab
          name="products-transfer"
          title={t('LoyaltyPartners.transfer')}
          style={{ marginLeft: 10 }}
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
  }
});

export default LoyaltyPartnersList;
