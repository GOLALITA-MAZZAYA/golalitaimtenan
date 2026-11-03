import {ImageBackground, Linking, StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../../../../components/Typography";
import {colors} from "../../../../../components/colors";
import {BALOO_2} from "../../../../../redux/types";
import {getCurrentLocation, requestLocationPermission} from "../../../../../helpers";
import {useTranslation} from "react-i18next";
import {useTheme} from "../../../../../components/ThemeProvider";

const MapViewBtn = ({style, merchantLatitude, merchantLongitude, onPress}) => {
    const {t} = useTranslation();
    const {isDark} = useTheme();

    const handleMarkerPress = async () => {
      if(onPress){
         onPress();
         
         return;
      }

      try {
        const status = await requestLocationPermission();
  
        if (status === 'granted') {
          const location = await getCurrentLocation();
  
          const userLatitude = location.coords.latitude;
          const userLongitude = location.coords.longitude;
  
          if (userLatitude && userLongitude) {
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&origin=${userLatitude},${userLongitude}&destination=${merchantLatitude},${merchantLongitude}&travelmode=driving`,
            );
  
            return;
          }
        }
  
        Linking.openURL(
          `https://www.google.com/maps/dir/Current+Location/${merchantLatitude},${merchantLongitude}`,
        );
      } catch (err) {
        console.log(err, 'err');
      }
    };
    return (
        <ImageBackground 
           source={require('../../../../../assets/map-view.jpg')}
           style={[
             styles.mapBackground,
             {
               borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
             },
             style
           ]}
        > 
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleMarkerPress}
            style={[
              styles.btn,
              {
                backgroundColor: isDark ? colors.mainDarkMode : colors.darkBlue,
              }
            ]}
          >
            <TypographyText 
               title={t('Merchants.viewMap')} 
               textColor={isDark ? '#000000' : '#FFFFFF'}
               font={BALOO_2}
               size={14}
               style={{ fontWeight: '700' }}
            />
          </TouchableOpacity>
 
          <View style={styles.blackLayer}/> 
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
   mapBackground: {
     height: 120,
     width: '100%',
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 16,
     overflow: 'hidden',
     position: 'relative',
     borderWidth: 1,
   },
   blackLayer: {
    position: 'absolute',
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 2,
   },
   btn: {
    zIndex: 3,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
   },
});

export default MapViewBtn;