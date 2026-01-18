import { ActivityIndicator, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { TypographyText } from '../../../../components/Typography';
import GeolocationSvg from '../../../../assets/geolocation.svg';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../components/colors';
import useUserLocation from '../../../../hooks/useUserLocation';
import { sized } from '../../../../Svg';
import { mainStyles } from '../../../../styles/mainStyles';
import { useEffect, useState } from 'react';

const GeolocationIcon = sized(GeolocationSvg, 21);

const MyLocationBtn = ({ moveMapToPosition }) => {
  const { t } = useTranslation();
  const { requestLocation } = useUserLocation();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    try {
      setLoading(true);
      console.log('before request location');
      const data = await requestLocation();

      console.log(data, 'data afetr requesting permission');

      const lalitude = data.location.latitude;
      const longitude = data.location.longitude;

      if (lalitude & longitude) {
        moveMapToPosition(lalitude, longitude);
      }
    } catch (err) {
      console.log(err, 'get user location error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePress();
  }, []);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.geoButton}>
      {loading && <ActivityIndicator color={colors.darkBlue} size={'small'} />}
      {!loading && (
        <View style={styles.wrapper}>
          <GeolocationIcon />
          <TypographyText
            textColor={'#686868'}
            size={8}
            title={t('MapPage.nearMe')}
            style={styles.text}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  geoButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 405,
    right: 6,
    zIndex: 100,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default MyLocationBtn;
