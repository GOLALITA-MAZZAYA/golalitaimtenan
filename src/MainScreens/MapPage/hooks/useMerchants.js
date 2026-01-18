import { useQuery } from "react-query";
import { getNearbyMerchants } from "../../../api/merchants";
import { useEffect, useState } from "react";
import useUserLocation from "../../../hooks/useUserLocation";

const getLatitudeAndLongitude = (locationFromSelect, userLocation) => {
  const defaultLocation = {
    latitude: 25.283239397109238,
    longitude: 51.48449758393703,
  };

  if (
    (locationFromSelect?.latitude === defaultLocation.latitude &&
      locationFromSelect?.longitude === defaultLocation.longitude &&
      userLocation) ||
    (!locationFromSelect?.latitude && userLocation)
  ) {
    return userLocation;
  }

  return locationFromSelect;
};

const useMerchants = (
  latitude = 25.283239397109238,
  longitude = 51.48449758393703,
  askPermission = false
) => {
  const { requestLocation } = useUserLocation();
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const getUserLocation = async () => {
    try {
      setLocationLoading(true);

      const data = await requestLocation();

      const latitude = data?.location?.latitude;
      const longitude = data?.location?.longitude;

      if (latitude & longitude) {
        setLocation({ latitude, longitude });
      }
    } catch (err) {
      setLocationLoading(false);
      console.log(err);
    } finally {
      setLocationLoading(false);
    }
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      "nearby-merchants",
      latitude,
      longitude,
      location?.latitude,
      location?.longitude,
    ],
    queryFn: () =>
      getNearbyMerchants(
        getLatitudeAndLongitude({ latitude, longitude }, location)
      ),
    enabled: !locationLoading,
  });

  useEffect(() => {
    if (!location && askPermission) {
      getUserLocation();
    }

    if (!askPermission) {
      setLocationLoading(false);
    }
  }, [askPermission]);

  return {
    isLoading,
    isError,
    data,
    error,
  };
};

export default useMerchants;
