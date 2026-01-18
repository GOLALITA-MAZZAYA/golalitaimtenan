import React, {useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import CloseSvg from '../../../../assets/close.svg';
import {useTheme} from '../../../../components/ThemeProvider';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../../components/colors';
import {TypographyText} from '../../../../components/Typography';

const AdwertisementModal = () => {
  
  const [modalVisible, setModalVisible] = useState(false);
  const { isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {

    setTimeout(() => {
      setModalVisible(true)
    },2000)

  },[])

  const handleSubmit = () => {

  };

  const handleClose = () => {
    setModalVisible(false);
  }

  const submitBackground = isDark ? colors.mainDarkMode: colors.darkBlue;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.bodyWrapper}>
          <View style={styles.body}>

            <View style={styles.modalView}>
               <Image source={{uri: 'https://png.pngtree.com/png-vector/20251122/ourlarge/pngtree-january-sale-start-the-new-year-with-savings-png-image_18042925.webp'}} style={styles.image}/>
            <TouchableOpacity style={[styles.submitBtn, {backgroundColor: submitBackground}]} onPress={handleSubmit}>
                <TypographyText
                    title={'Order Now'}
                    textColor={'white'}
                    size={14}
                    style={styles.text}
                />
            </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.close} onPress={handleClose}>
                <CloseSvg color="black"/>
            </TouchableOpacity>

          </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 300,
  },
  modalView: {
    position: 'relative',
    margin: 20,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    padding: 8,
    backgroundColor: 'white'
  },
  text: {

  },
  submitBtn: {
    backgroundColor: colors.darkBlue,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 24,
    position: 'absolute',
    bottom: 40
  }
});

export default AdwertisementModal;