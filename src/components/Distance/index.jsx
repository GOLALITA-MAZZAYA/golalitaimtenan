import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import useUserLocation from "../../hooks/useUserLocation";
import { getRoadDistance } from "../../api/user";
import { TypographyText } from "../Typography";

const Distance = ({ latitude, longitude, textStyle }) => {
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
          longitude
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
        <ActivityIndicator color={textStyle?.color} style={textStyle} />
      )}
      {!loading && (
        <TypographyText title={distance || ""} size={14} style={textStyle} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Distance;
