import i18next from "i18next";
import { Linking, PermissionsAndroid, Platform } from "react-native";
import Geocoder from "react-native-geocoding";
import Geolocation from "react-native-geolocation-service";

export const requestLocationPermission = async () => {
  let status;

  if (Platform.OS === "android") {
    status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Geolocation Permission",
        message: "Can we access your location?",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
  }

  if (Platform.OS === "ios") {
    status = await Geolocation.requestAuthorization("whenInUse");
  }

  return status;
};

export const getCurrentLocation = () => {
  return new Promise((res, rej) => {
    Geolocation.getCurrentPosition(
      (position) => {
        res(position);
      },
      (error) => {
        rej(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

const transformAddressComponents = (json) => {
  const adressComponents = json?.results?.[0]?.address_components;

  if (!adressComponents?.length) {
    return null;
  }

  const getNameByFieldType = (type) => {
    return adressComponents.find((item) => item.types.includes(type))
      ?.long_name;
  };

  return {
    city: getNameByFieldType("locality"),
    region: getNameByFieldType("administrative_area_level_1"),
    country: getNameByFieldType("country"),
    postalCode: getNameByFieldType("postal_code"),
    streetNumber: getNameByFieldType("street_number"),
    street: getNameByFieldType("route"),
    formatted_address: json?.results?.[0]?.formatted_address,
    latitude: json?.results?.[0]?.geometry?.location?.lat,
    longitude: json?.results?.[0]?.geometry?.location?.lng,
  };
};

export const getAddresFromCoordinates = async (lat, lng) => {
  const json = await Geocoder.from({
    lat,
    lng,
  });

  return transformAddressComponents(json);
};

export const transformLocationDataFromBackend = (locations) => {
  return locations.map((item) => ({
    city: item.location_name,
    region: item.zone,
    streetNumber: item.street_number,
    street: "",
    formatted_address: `${item.location_name}, ${item.street_number}, ${item.building_number}, ${item.apartment_number}`,
    latitude: item.latitude,
    longitude: item.longitude,
    country: "",
    pastalCode: "",
    apartment_number: item.apartment_number,
    building_number: item.building_number,
    floor: item.floor,
    customer: item.customer,
    customer_id: item.customer_id,
    id: item.location_id,
  }));
};

export const getAddressFromName = async (name) => {
  const json = await Geocoder.from(name);

  return transformAddressComponents(json);
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const r = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = r * c; // Distance in kilometers

  return d;
};

export const getTranslationForOfferType = (offerType) => {
  switch (offerType) {
    case "b1g1":
      return i18next.t("AllOffers.b1g1Type");
    case "promocode":
      return i18next.t("AllOffers.promocodeType");
    case "discount":
      return i18next.t("AllOffers.discountType");
    case "giftcard":
      return i18next.t("AllOffers.giftcardType");
    default:
      return "";
  }
};

export const toEnglishNumber = (strNum) => {
  var ar = "٠١٢٣٤٥٦٧٨٩".split("");
  var en = "0123456789".split("");
  strNum = strNum.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (x) => en[ar.indexOf(x)]);
  strNum = strNum.replace(/[^\d]/g, "");
  return strNum;
};


const getUserLocation = async () => {
    const status = await requestLocationPermission();

    if (status !== 'granted') {

      Alert.alert('', i18next.t('MapPage.openSettings'), [
        {
          text: i18next.t('Drawer.cancel'),
          style: 'cancel',
        },
        {
          text: i18next.t('MapPage.settings'),
          onPress: () => Linking.openSettings(),
        },
      ]);

      return {
        location: null,
        status
      };
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async position => {

          resolve({
            location: position.coords,
            status
          });
        },
        error => {
          reject({
            location: null,
            status
          });

          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
};

export default getUserLocation;

