import i18next from "i18next";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
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

export const toEnglishNumber = (strNum) => {
  var ar = "٠١٢٣٤٥٦٧٨٩".split("");
  var en = "0123456789".split("");
  strNum = strNum.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (x) => en[ar.indexOf(x)]);
  strNum = strNum.replace(/[^\d]/g, "");
  return strNum;
};

export function daysLeftUntil(dateString) {
  if(!dateString){
    return ''
  }
  const today = new Date();
  const targetDate = new Date(dateString);

  // Normalize both dates to midnight to avoid timezone/time issues
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffInMs = targetDate - today;

  return Math.ceil(diffInMs / msPerDay);
}


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

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const confirmAction = ({
  title = "Confirm",
  message = "Are you sure?",
  cancelText = 'Cancel',
  okText = 'Ok',
  onConfirm,
  onCancel,
}) => {
  Alert.alert(
    title,
    message,
    [
      { text: cancelText, style: "cancel", onPress: onCancel },
      { text: okText, onPress: onConfirm },
    ],
    { cancelable: true }
  );
};

export const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value)
  );
};

export function removeEmptyFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ''
    )
  );
}
