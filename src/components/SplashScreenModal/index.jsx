import { useEffect } from 'react';
import { StyleSheet, Modal, Image } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { WINDOW_WIDTH } from '../../styles/mainStyles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const SplashScreenModal = ({ isVisible }) => {
  useEffect(() => {
    BootSplash.hide();
  }, []);

  const logo = require('../../assets/golalita.gif');

  return (
    <Modal animationType="none" transparent={false} visible={isVisible}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.main}>
          <Image source={logo} style={styles.image} resizeMode="stretch" />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  image: {
    width: WINDOW_WIDTH,
    height: '100%',
  },
});

export default SplashScreenModal;
