import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from '../helpers';
import { Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

const LOCATION_STATUSES = {
  NOT_REQUESTED: 'NOT_REQUESTED',
  GRANTED: 'GRANTED',
  REJECTED: 'REJECTED',
  ERROR: 'ERROR',
};

const useUserLocation = () => {
  const { t } = useTranslation();

  const requestLocation = async () => {
    console.log('1111');
    const status = await requestLocationPermission();

    console.log(status, 'status');

    if (status !== 'granted') {
      console.log('Can not get user locationn');

      Alert.alert('', t('MapPage.openSettings'), [
        {
          text: t('Drawer.cancel'),
          style: 'cancel',
        },
        {
          text: t('MapPage.settings'),
          onPress: () => Linking.openSettings(),
        },
      ]);

      return {
        location: null,
        status: LOCATION_STATUSES.REJECTED,
      };
    }

    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        async position => {
          resolve({
            location: position.coords,
            status: LOCATION_STATUSES.GRANTED,
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);

          resolve({
            location: null,
            status: LOCATION_STATUSES.ERROR,
          });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  };

  return { requestLocation };
};

export default useUserLocation;
