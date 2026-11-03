import React, {useState, useCallback, useEffect} from "react";
import {View, StyleSheet} from "react-native";
import MapView, {Marker} from "react-native-maps";
import {TypographyText} from "../../../../../components/Typography";
import {BALOO_2} from "../../../../../redux/types";
import {colors} from "../../../../../components/colors";
import {useFormikContext} from "formik";
import {useDispatch} from "react-redux";
import {setRestaurantLoading} from "../../../../../redux/restaurant/restaurant-actions";
import {getQatarLocationDetails} from "../../../../../api/global";

const DeliveryAddressMap = ({ initialRegion, style, label}) => {
  const [marker, setMarker] = useState(null);
  const dispatch = useDispatch();

    const { setValues } = useFormikContext();

    const getLocationInfo  = async () => {
      try{
          
          dispatch(setRestaurantLoading(true));

          const res = await getQatarLocationDetails(marker.latitude, marker.longitude);
          console.log(res,'location res')
          
          if(!!res && Object.values(res).length){
            console.log(res,'resssss')
            setValues(res)
          }
  
      }catch(err){
        console.log(err,'get location on marker press error')
      }finally{
        dispatch(setRestaurantLoading(false));
      }
    }

  const handlePress = useCallback(
    (event) => {
      const {latitude, longitude} = event.nativeEvent.coordinate;

      const coords = {latitude, longitude};

      setMarker(coords);
    },
    []
  );



  useEffect(() => {
     if(marker){
        getLocationInfo()
     }

  },[marker])

  return (
    <View style={style}>
        {label && <TypographyText 
            title={label}
            style={styles.label}
            font={BALOO_2}
            textColor={colors.loyaltyTextSecondary}
        />}
    
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={
          initialRegion || {
            latitude: 25.2854,
            longitude: 51.5310,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        }
        onPress={handlePress}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
   label: {
     marginHorizontal: 9
   },
});

export default DeliveryAddressMap;