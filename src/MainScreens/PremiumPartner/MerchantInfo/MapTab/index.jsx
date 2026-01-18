import { StyleSheet, Linking } from 'react-native';

import {
  getCurrentLocation,
  requestLocationPermission,
} from '../../../../helpers';
import Map from '../../../MapPage/Map';

const MapTab = ({ merchantDetails }) => {
  const handleMarkerPress = async () => {
    try {
      const status = await requestLocationPermission();

      if (status === 'granted') {
        const location = await getCurrentLocation();

        const userLatitude = location.coords.latitude;
        const userLongitude = location.coords.longitude;

        if (userLatitude && userLongitude) {
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${merchantDetails.partner_latitude},${merchantDetails.partner_longitude}&travelmode=driving`,
          );

          return;
        }
      }

      Linking.openURL(
        `https://www.google.com/maps/dir/Current+Location/${merchantDetails.partner_latitude},${merchantDetails.partner_longitude}`,
      );
    } catch (err) {
      console.log(err, 'err');
    }
  };

  return (
    <Map
      isMapTab={true}
      merchants={[merchantDetails]}
      style={styles.map}
      initialRegion={{
        latitude: merchantDetails.partner_latitude,
        longitude: merchantDetails.partner_longitude,
      }}
      onMarkerPress={handleMarkerPress}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDFE4',
    overflow: 'hidden',
    marginTop: 25,
  },
});

export default MapTab;
