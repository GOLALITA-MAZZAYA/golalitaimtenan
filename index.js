import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { firebaseBackgroundMessage } from './src/pushNotifications/pushNotificationBootStrap';
import { startInitialNotificationCapture } from './src/pushNotifications/pendingPushNotification';

if (!__DEV__) {
  console.log = () => {};
}

// Capture killed-state notification tap BEFORE React mounts. On debug builds
// Metro's loading bar delays JS; getInitialNotification is one-shot and easy
// to miss if we only read it later inside useEffect.
startInitialNotificationCapture();

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => firebaseBackgroundMessage,
);

AppRegistry.registerComponent(appName, () => App);
