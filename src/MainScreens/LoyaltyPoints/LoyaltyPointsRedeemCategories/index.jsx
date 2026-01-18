import {StyleSheet} from "react-native";
import MainLayout from "../../../components/MainLayout"
import Header from "../../../components/Header";
import CardsList from "../common/CardsList";
import {CATEGORIES} from "./config";
import {useTranslation} from "react-i18next";

const LoyaltyPointsRedeemCategories = () => {
  const {t} = useTranslation();

  return (
        <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyMain.categories')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >

       <CardsList data={CATEGORIES} hasBanners/>
      </MainLayout>
  )
};

const styles = StyleSheet.create({
contentStyle: {
  flexGrow: 1
},
banners: {
  alignSelf: 'center',
  marginBottom: 20
}
});

export default LoyaltyPointsRedeemCategories;