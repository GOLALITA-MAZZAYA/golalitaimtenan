import { ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../../../../../components/ThemeProvider';
import { TypographyText } from '../../../../../../components/Typography';
import useUserLocation from '../../../../../../hooks/useUserLocation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../../../components/colors';
import { View } from 'react-native';
import { getRoadDistance } from '../../../../../../api/user';

const Distance = ({ latitude, longitude }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const { requestLocation } = useUserLocation();
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(0);

  const countDistance = async () => {
    try {
      setLoading(true);
      const data = await requestLocation();

      const userLatitude = data.location.latitude;
      const userLongitude = data.location.longitude;

      if (userLatitude & userLongitude && latitude && longitude) {
        const distance = await getRoadDistance(
          userLatitude,
          userLongitude,
          latitude,
          longitude,
        );

        if (distance) {
          setDistance(distance);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    countDistance();
  }, [latitude, longitude]);

  return (
    <View style={styles.wrapper}>
      {loading && (
        <ActivityIndicator
          color={isDark ? colors.mainDarkMode : colors.darkBlue}
        />
      )}
      {!loading && (
        <TypographyText
          title={distance || ''}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={14}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default Distance;
