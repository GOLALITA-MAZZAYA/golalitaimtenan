import { StyleSheet } from "react-native";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import LoyaltyPointsBanners from "./LoyaltyPointsBanners";
import LoyaltyPointsUserInfo from "./LoyaltyPointsUserInfo";
import LoyaltyPointsList from "./LoyaltyPointsList";

const LoyaltyPointsMain = () => {
    return (
         <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={''} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        <LoyaltyPointsBanners style={styles.banners}/>

        <LoyaltyPointsUserInfo />

        <LoyaltyPointsList />
        
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
    banners: {
      marginHorizontal: 20
    }
});

export default LoyaltyPointsMain;