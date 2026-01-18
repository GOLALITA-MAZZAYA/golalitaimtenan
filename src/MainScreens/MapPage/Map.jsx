// src\MainScreens\MapPage\Map.jsx
import React, { memo } from "react";
import styles from "./styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const Map = ({
  merchants,
  mapRef,
  initialRegion = {},
  style,
  onMarkerPress,
}) => {
  return (
    <MapView
      ref={mapRef}
      style={[styles.map, style]}
      provider={PROVIDER_GOOGLE}
      tracksViewChanges={false}
      initialRegion={{
        latitude: initialRegion?.latitude || 25.283239397109238,
        longitude: initialRegion?.longitude || 51.48449758393703,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
      spiderLineColor="transparent"
      spiralEnabled={false}
      minPoints={5}
      showsMyLocationButton={false}
    >
      {merchants?.map((item) => (
        <Marker
          tracksViewChanges={false}
          key={item.merchant_id}
          identifier={`${item.merchant_id}`}
          coordinate={{
            latitude: item.partner_latitude,
            longitude: item.partner_longitude,
          }}
          title={item.merchant_name}
          icon={require("../../assets/marker.png")}
          onPress={onMarkerPress}
        />
      ))}
    </MapView>
  );
};

export default memo(
  Map,
  (prevProps, nextProps) =>
    prevProps.merchants?.length === nextProps.merchants?.length &&
    prevProps.merchants?.[0]?.id === nextProps.merchants?.[0]?.id
);
