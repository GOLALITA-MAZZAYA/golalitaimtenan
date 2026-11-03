import { useEffect } from 'react';
import { StyleSheet, Modal, Image } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SCREEN_HEIGHT, WINDOW_WIDTH } from '../../styles/mainStyles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { splash } from '../../org/assets';

const SplashScreenModal = ({ isVisible }) => {
  useEffect(() => {
    BootSplash.hide();
  }, []);

  const logo = splash;

  return (
    <Modal animationType="none" transparent={false} visible={isVisible}>
          <Image source={logo} style={styles.image} resizeMode="stretch" />
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  image: {
    width: WINDOW_WIDTH,
    height: SCREEN_HEIGHT
  },
});

export default SplashScreenModal;
