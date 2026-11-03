import React, {
    useEffect,
    useState,
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import FullScreenLoader from '../../../../components/Loaders/FullScreenLoader';
import { Tabs } from 'react-native-collapsible-tab-view';
import InfoTab from './InfoTab';
import HeaderTabs from './components/HeaderTabs';
import ServicesTab from './ServicesTab';
import Header from './components/Header';
import useSaloonDetails from '../hooks/useSaloonDetails';
import {useDispatch} from 'react-redux';
import {getMerchantDiscount} from '../../../../redux/loyalty/loyalty-thunks';

export const CONSTANTS = {
    SERVICES: "SERVICES",
    INFO: 'INFO',
};


const SaloonInfo = ({
    route
}) => {
    const saloonId = route.params.saloonId;
    const [activeTab, setActiveTab] = useState(CONSTANTS.SERVICES);
    const dispatch = useDispatch();

    const { saloon, loading, error } = useSaloonDetails(saloonId);

    useEffect(() => {
      if(saloon?.merchant_id){
       dispatch(getMerchantDiscount(saloon?.merchant_id))
      }
    },[saloon?.merchant_id])

    if (error) {
        console.log("Error in SaloonsInfo queries:", error);
    }

    if (loading || !saloon) return <FullScreenLoader />;

    return (
        <SafeAreaView style={styles.container}>
            <Tabs.Container
                renderHeader={() => (
                    <Header
                        saloon={saloon}
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
                            {activeTab === CONSTANTS.SERVICES && (
                                <ServicesTab saloonId={saloonId} feeAmount={saloon?.appointment_fee_amount}/>
                            )}
                            {activeTab === CONSTANTS.INFO && (
                                <InfoTab saloon={saloon} />
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

export default SaloonInfo;
