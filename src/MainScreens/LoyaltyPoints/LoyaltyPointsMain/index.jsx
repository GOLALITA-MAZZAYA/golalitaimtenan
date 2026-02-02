import { ScrollView, StyleSheet } from "react-native";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import LoyaltyPointsUserInfo from "./LoyaltyPointsUserInfo";
import LoyaltyPointsList from "./LoyaltyPointsList";
import FeaturedRewardsList from "./FeaturedRewardsList";
import {SCREEN_HEIGHT} from "@gorhom/bottom-sheet";

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
        <ScrollView 
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >

        <LoyaltyPointsUserInfo />

        <LoyaltyPointsList />

        <FeaturedRewardsList />

        </ScrollView>
        
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
    contentContainerStyle: {
      flexGrow: 1,
      paddingBottom: 180
    }
});

export default LoyaltyPointsMain;