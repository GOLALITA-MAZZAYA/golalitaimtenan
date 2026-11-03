import { StyleSheet } from "react-native";
import { useState } from "react";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import { useTranslation } from "react-i18next";
import ListTab from "./ListTab";
import CategoriesSelect from "./ListTab/CategoriesSelect";

const LoyaltyVouchersHistory = () => {
  const { t } = useTranslation();
  const [categoryId, setCategoryId] = useState(undefined);

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header
          label={t('LoyaltyVouchers.title')}
          btns={['back']}
          rightChildren={
            <CategoriesSelect onSubmit={setCategoryId} autoOpen={true} />
          }
        />
      }
      headerHeight={50}
      contentStyle={styles.contentStyle}
    >
      <ListTab categoryId={categoryId} />
    </MainLayout>
  )
};

const styles = StyleSheet.create({
  contentStyle: {
    height: SCREEN_HEIGHT,
    flexGrow: 1,
    paddingHorizontal: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  banners: {
    alignSelf: 'center'
  }
});

export default LoyaltyVouchersHistory;