import {  Linking, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { colors } from '../../../../../components/colors';
import InfoWithTitleBlock from '../../../../../components/InfoWithTitleBlock';
import MapViewBtn from '../../../../PremiumPartner/MerchantInfo/InfoTab/MapViewBtn';
import DescriptionSvg from '../../../../../assets/loyaltyPoints/description.svg';
import {isRTL} from '../../../../../../utils';
import CustomBtnWithIcon from '../../../../../components/Btns/CustomBtnWithIcon';
import PhoneSvg from '../../../../../assets/call.svg';
import PlanetSvg from '../../../../../assets/planet.svg';
import TimeSvg from '../../../../../assets/loyaltyPoints/time.svg';
import WorkingHours from '../components/WorkingHours';
import {useTranslation} from 'react-i18next';
import trackActivity from '../../../../../api/activityTracker';

const InfoTab = ({ clinic }) => {
  const isRtl = isRTL();
  const {t} = useTranslation();

  const handleCallPress = () => {
    if(clinic.phone){
      Linking.openURL(`tel:${clinic.phone}`)
    }
  };

  const handleWebsitePress = () => {
    if(clinic.website){
      trackActivity('page_visit', {
        merchant_id: clinic.merchant_id,
        page_name: 'merchant_website',
        metadata: { link_type: 'website', link_value: clinic.website, source: 'clinic_info_tab' },
      });
      Linking.openURL(clinic.website);
    }
  }

  console.log(clinic,'clinic')


  return (
    <View style={styles.wrapper}>

        <InfoWithTitleBlock
            title={t('Clinics.aboutClinic')}
            description={isRtl? clinic.description_ar : clinic.description}
            icon={<DescriptionSvg color={colors.loyaltyPrimary} height={15} width={15}/>}
            style={styles.aboutBlock}

        />

        <View style={[styles.rowWrapper,{flexDirection: isRtl? 'row-reverse': 'row'}]}>
            <CustomBtnWithIcon title={t('Clinics.call')} style={styles.btn} icon={<PhoneSvg height={13} />} onPress={handleCallPress}/>
            <CustomBtnWithIcon title={t('Clinics.website')} style={styles.btn} icon={<PlanetSvg height={13}/>} onPress={handleWebsitePress}/>
        </View>

        <MapViewBtn
          style={styles.mapBlock}
          merchantLatitude={clinic.latitude}
          merchantLongitude={clinic.longitude}
        />

        <WorkingHours 
            title={t('Clinics.workingHours')}
            weekdays={clinic?.working_hours?.weekdays}
            weekends={clinic?.working_hours?.weekends}
            icon={<TimeSvg color={colors.loyaltyPrimary} height={15} width={15}/>}
            style={styles.mapBlock}
        />

    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexGrow: 1,
  },
  controllBtns: {
    flexDirection: 'row',
  },
  infoItem: {
    marginTop: 40,
  },
  infoItemTitleWrapper: {
    width: '100%',
  },
  infoItemTitle: {
    borderRadius: 10,
  },
  infoItemValue: {
    marginTop: 3,
  },
  smallDescriptionBlocks: {
    flex: 1,
    marginTop: 16
  },
  mapBlock: {
    marginTop: 20
  },
  columnWrapper: {
    justifyContent: 'space-between', 
    marginBottom: 4,     
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
