import React, {
  useState,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import FullScreenLoader from '../../../../components/Loaders/FullScreenLoader';
import { Tabs } from 'react-native-collapsible-tab-view';
import InfoTab from './InfoTab';
import { isRTL } from '../../../../../utils';
import HeaderTabs from './components/HeaderTabs';
import DoctorsTab from './DoctorsTab';
import Header from './components/Header';
import useClinicDetails from '../hooks/useClinicDetails';

export const CONSTANTS = {
  DOCTORS: "DOCTORS",
  INFO: 'INFO',
};


const ClinicInfo = ({
  route
}) => {
  const clinicId = route.params.clinicId;
  const [activeTab, setActiveTab] = useState(CONSTANTS.DOCTORS);

  const { data: clinic, loading } = useClinicDetails(clinicId);


  if (loading || !clinic) return <FullScreenLoader />;

  console.log(clinic, 'data')


  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container
        renderHeader={() => (
          <Header
            clinic={clinic}
          />
        )}
        renderTabBar={() => <HeaderTabs setActiveTab={setActiveTab} activeTab={activeTab} />}
      >
        <Tabs.Tab name="oneTab">
          <Tabs.ScrollView
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <>
              {activeTab === CONSTANTS.DOCTORS && (
                <DoctorsTab clinicId={clinicId} />
              )}
              {activeTab === CONSTANTS.INFO && (
                <InfoTab clinic={clinic} />
              )}
            </>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainerStyle: {
    paddingBottom: 30,
    paddingHorizontal: 20
  }
});

export default ClinicInfo;

