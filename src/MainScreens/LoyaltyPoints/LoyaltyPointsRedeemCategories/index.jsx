import {FlatList, StyleSheet} from "react-native";
import MainLayout from "../../../components/MainLayout"
import Header from "../../../components/Header";
import CardsList from "../common/CardsList";
import {CATEGORIES, getCategories} from "./config";
import {useTranslation} from "react-i18next";
import ListCard from "../common/ListCard";
import {useTheme} from "../../../components/ThemeProvider";

const LoyaltyPointsRedeemCategories = () => {
  const {t} = useTranslation();
  const {isDark} = useTheme();

  const data = getCategories(isDark);


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
         renderItem={({item}) => (
             <ListCard {...item} isDark={isDark} style={styles.card}/>
         )}
       />
      </MainLayout>
  )
};

const styles = StyleSheet.create({
contentStyle: {
  flexGrow: 1,
  paddingHorizontal: 20
},
banners: {
  alignSelf: 'center',
  marginBottom: 20
},
card: {
  marginTop: 12
}
});

export default LoyaltyPointsRedeemCategories;