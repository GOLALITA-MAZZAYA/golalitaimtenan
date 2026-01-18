import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from "react-native";
import { LocationIcon } from "../../../assets/delivery_assets";
import { StyleSheet } from "react-native";
import { colors } from "../../../components/colors";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../../redux/types";
import { TypographyText } from "../../../components/Typography";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { SizedBox } from "../../Delivery/screens/_shared/componenets/SizedBox";
import useUserLocation from "../../../hooks/useUserLocation";
import { useTranslation } from "react-i18next";
import LocationBtn from "./LocationBtn";
import LocationSearch from "./LocationsSearch";
import { getAddresFromCoordinates } from "../../../helpers";
import { useTheme } from "../../../components/ThemeProvider";

function LocationsMap() {
  const navigation = useNavigation();
  const { location: userLocation } = useUserLocation();
  const mapRef = useRef(null);
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [selectedLocation, selectLocation] = useState(null);
  const route = useRoute();
  const navigatedFrom = route.params?.navigatedFrom;

  useEffect(() => {
    if (userLocation) {
      selectLocation(userLocation);
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [userLocation]);

  const handleUserLocationPress = () => {
    if (userLocation) {
      selectLocation(userLocation);

      mapRef.current?.animateToRegion({
        latitude: userLocation?.latitude - 0.004,
        longitude: userLocation?.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } else if (userLocation === null) {
      Alert.alert("", t("MapPage.openSettings"), [
        {
          text: t("Drawer.cancel"),
          style: "cancel",
        },
        {
          text: t("MapPage.settings"),
          onPress: () => Linking.openSettings(),
        },
      ]);
    }
  };

  const handleSearchItemPress = (location) => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude - 0.004,
      longitude: location.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });

    selectLocation(location);
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const location = await getAddresFromCoordinates(latitude, longitude);
    selectLocation(location);
  };

  const handleConfirmPress = () => {
    if (!selectLocation) {
      alert("Please, select your location");
      return;
    }

    navigation.navigate("locations-form", {
      selectedLocation,
      navigatedFrom,
    });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        flex: 1,
      }}
    >
      <SafeAreaView
        style={[
          styles.wrapper,
          { backgroundColor: isDark ? colors.darkBlue : colors.white },
        ]}
      >
        <LocationSearch
          placeholder={t("Location.searchPlaceholder")}
          onSearchItemPress={handleSearchItemPress}
          onBackPress={handleBackPress}
          isDark={isDark}
        />

        <SizedBox size={20} />

        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          onPress={handleMapPress}
        >
          {selectedLocation?.latitude && selectedLocation?.longitude && (
            <Marker
              key={"1"}
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
            />
          )}
        </MapView>

        <View
          style={[
            styles.locationWrapper,
            { backgroundColor: isDark ? colors.darkBlue : colors.white },
          ]}
        >
          <TypographyText
            title={t("Location.deliveryLocation")}
            textColor={isDark ? colors.white : colors.darkBlue}
            size={18}
            font={BALOO_REGULAR}
          />

          <SizedBox size={8} />

          <View style={{ flexDirection: "row" }}>
            <LocationIcon color={isDark ? colors.white : colors.darkBlue} />
            <SizedBox size={8} />
            <TypographyText
              title={
                !!selectedLocation
                  ? selectedLocation?.formatted_address
                  : t("Location.choose")
              }
              textColor={isDark ? colors.white : colors.darkBlue}
              size={18}
              font={BALOO_MEDIUM}
              numberOfLines={1}
              style={{ flex: 1 }}
            />
          </View>

          <SizedBox size={12} />

          <TouchableOpacity onPress={handleConfirmPress}>
            <View
              style={[
                styles.confirmBtn,
                { backgroundColor: isDark ? "#0B177E" : colors.darkBlue },
              ]}
            >
              <TypographyText
                title={t("Location.confirm")}
                textColor={colors.white}
                size={18}
                font={BALOO_MEDIUM}
              />
            </View>
          </TouchableOpacity>
        </View>

        <LocationBtn
          userLocation={userLocation}
          onPress={handleUserLocationPress}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 20,
  },
  locationWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  confirmBtn: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  map: {
    flex: 1,
  },
});

export default LocationsMap;
