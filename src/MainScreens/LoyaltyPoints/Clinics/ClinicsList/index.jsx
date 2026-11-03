import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../../../../styles/mainStyles";
import MainLayout from "../../../../components/MainLayout";
import Header from "../../../../components/Header";
// import Tabs from "../../../components/Tabs";
import {useTranslation} from "react-i18next";
import ListTab from "./ListTab";
// import HistoryTab from "./HistoryTab";
// import DoctorSvg from '../../../assets/clinics/doctor.svg';
// import InfoSvg from '../../../assets/clinics/info.svg';

const ClinicsList = () => {
    const {t} = useTranslation();
    // const defaultActiveTab = route?.params?.activeTab || 'clinics-list';

    return (
    <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('Clinics.title')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >

        <ListTab />
        
      {/* <Tabs defaultActiveTab={defaultActiveTab} style={styles.tabsWrapper}>
 
        <Tabs.TabWithIcon name="clinics-list" title={t('Clinics.listTabTitle')} icon={<DoctorSvg/>}/>
        <Tabs.TabWithIcon
          name="clinics-history"
          title={t('Clinics.historyTabTitle')}
          style={{ marginLeft: 10 }}
          icon={<InfoSvg />}
        />


      <Tabs.Content name="clinics-list">
        <ListTab />
      </Tabs.Content>

      <Tabs.Content name="clinics-history">
        <HistoryTab />
      </Tabs.Content>


      </Tabs> */}
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

export default ClinicsList;