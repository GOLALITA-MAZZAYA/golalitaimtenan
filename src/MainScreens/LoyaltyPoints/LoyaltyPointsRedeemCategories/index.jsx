import { FlatList, StyleSheet } from "react-native";
import { useMemo } from "react";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import { getCategories } from "./config";
import { useTranslation } from "react-i18next";
import RedeemGridCard from "../common/RedeemGridCard";
import { useTheme } from "../../../components/ThemeProvider";
import useLoyaltyCategoriesVisibility from "../../../hooks/useLoyaltyCategoriesVisibility";

const LoyaltyPointsRedeemCategories = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isCategoryVisible } = useLoyaltyCategoriesVisibility();

  const data = useMemo(
    () => getCategories(isDark).filter(item => isCategoryVisible(item.categoryKey)),
    [isDark, isCategoryVisible],
  );

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header label={t('LoyaltyMain.redeem')} btns={['back']} />
      }
      headerHeight={50}
      contentStyle={styles.contentStyle}
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.categoryKey}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapperStyle}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <RedeemGridCard {...item} isDark={isDark} />
        )}
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    flexGrow: 1,
    paddingHorizontal: 12,
  },
  columnWrapperStyle: {
    justifyContent: 'flex-start',
  },
  contentContainerStyle: {
    paddingTop: 16,
    paddingBottom: 150,
  },
});

export default LoyaltyPointsRedeemCategories;