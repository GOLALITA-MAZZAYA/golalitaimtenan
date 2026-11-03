import { Linking, StyleSheet, View } from 'react-native';
import { colors } from "../../../../../components/colors";
import InfoWithTitleBlock from "../../../../../components/InfoWithTitleBlock";
import MapViewBtn from "../../../../PremiumPartner/MerchantInfo/InfoTab/MapViewBtn";
import DescriptionSvg from "../../../../../assets/loyaltyPoints/description.svg";
import { isRTL } from "../../../../../../utils";
import CustomBtnWithIcon from "../../../../../components/Btns/CustomBtnWithIcon";
import PhoneSvg from "../../../../../assets/call.svg";
import PlanetSvg from "../../../../../assets/planet.svg";
import { useTranslation } from 'react-i18next';
import trackActivity from "../../../../../api/activityTracker";

const InfoTab = ({ saloon }) => {
    const isRtl = isRTL();
    const { t } = useTranslation();

    const handleCallPress = () => {
        if (saloon.phone) {
            Linking.openURL(`tel:${saloon.phone}`)
        }
    };

    const handleWebsitePress = () => {
        if (saloon.website) {
            trackActivity('page_visit', {
                merchant_id: saloon.merchant_id,
                page_name: 'merchant_website',
                metadata: { link_type: 'website', link_value: saloon.website, source: 'saloon_info_tab' },
            });
            Linking.openURL(saloon.website);
        }
    }

    return (
        <View style={styles.wrapper}>
            <InfoWithTitleBlock
                title={t('Saloons.aboutSaloon')}
                description={isRtl ? saloon.description_ar : saloon.description}
                icon={<DescriptionSvg color={colors.loyaltyPrimary} height={15} width={15} />}
                style={styles.aboutBlock}
            />

            <View style={[styles.rowWrapper, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <CustomBtnWithIcon title={t('Saloons.call')} style={styles.btn} icon={<PhoneSvg height={13} />} onPress={handleCallPress} />
                <CustomBtnWithIcon title={t('Saloons.website')} style={styles.btn} icon={<PlanetSvg height={13} />} onPress={handleWebsitePress} />
            </View>

            <MapViewBtn
                style={styles.mapBlock}
                merchantLatitude={saloon.latitude || 25.2048}
                merchantLongitude={saloon.longitude || 55.2708}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        flexGrow: 1,
    },
    mapBlock: {
        marginTop: 20
    },
    rowWrapper: {
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 20
    },
    btn: {
        width: '48%'
    },
    aboutBlock: {
        marginTop: 5
    }
});

export default InfoTab;
