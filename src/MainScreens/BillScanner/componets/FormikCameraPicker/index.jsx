import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Image from "../../../../components/AppImage";
import { colors } from '../../../../components/colors';
import { useTheme } from '../../../../components/ThemeProvider';
import Portal from '../../../../components/Portal';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { TypographyText } from '../../../../components/Typography';
import { Field } from 'formik';
import { BALOO_2 } from '../../../../redux/types';
import ScanSvg from '../../../../assets/loyaltyPoints/home/scan.svg';
import RightArrowSvg from '../../../../assets/loyaltyPoints/arrowRightBig.svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { isRTL } from '../../../../../utils';
import CameraSvg from '../../../../assets/loyaltyPoints/camera.svg';
import GallerySvg from '../../../../assets/loyaltyPoints/gallery.svg';
import Button from '../../../../components/Button';
import {requestCameraPermission} from '../../../../helpers';



const FormikCameraPicker = () => {
  const { isDark } = useTheme();
  const bottomSheetModalRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState('');
  const { t } = useTranslation();

  const snapPoints = [700];

  const showModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const hideModal = () => {
    bottomSheetModalRef.current?.close();
  };


  const name = 'bill_image';
  const isRtl = isRTL();

  return (
    <View style={styles.wrapper}>
      <Field name={name}>
        {({ field: { value }, form: { setFieldValue, errors } }) => {
          return (
            //@ts-ignore
            <>
              <TouchableOpacity
                onPress={showModal}
                style={[
                  styles.select,
                  {backgroundColor: colors.loyaltyCardBackground, flexDirection: isRtl ? 'row-reverse': 'row', borderColor: colors.loyaltyMainBorder},
                ]}
              >

                <View style={[styles.scanIconBlock,{backgroundColor: colors.loyaltyPrimaryIconBackground}]} >
                {!selectedImage && <ScanSvg color={colors.loyaltyPrimary} height={24} width={24}/>}

                {selectedImage && (
                  <View
                  >
                    <Image
                      source={{ uri: `data:image/png;base64,${selectedImage}` }}
                      style={[
                        styles.selectedImage,
                        {
                          borderColor: isDark
                            ? colors.darkGrey
                            : colors.lightGrey,
                        },
                      ]}
                      contentFit="contain"
                    />

                    <TouchableOpacity
                      onPress={() => {
                        setSelectedImage('');
                        setFieldValue(name, '');
                      }}
                      style={styles.removeText}
                    >
                      <TypographyText
                        textColor={'#FF406E'}
                        size={14}
                        title={t('BillScanner.remove')}
                        numberOfLines={1}
                        style={styles.removeImageText}
                        font={BALOO_2}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                </View>

                <View style={styles.textBlock}>
                  <TypographyText
                    textColor={colors.loyaltyTextMain}
                    size={20}
                    font={BALOO_2}
                    title={t('BillScanner.scanReceipt')}
                  />
                  <TypographyText
                    textColor={colors.loyaltyTextSecondary}
                    size={12}
                    font={BALOO_2}
                    title={t('BillScanner.extract')}
                  />
                </View>

                 <View style={[
                   styles.rightIconBlock,
                   { transform: [
                        { rotate: isRtl ? "180deg": '0deg' }]}
                  ]}>   
                   <RightArrowSvg color={colors.loyaltyPrimary}/>
                </View>

    
              </TouchableOpacity>
              <Portal name="camera-type-select">
                <BottomSheetModalProvider key="camera-type-select">
                  <View style={styles.container}>
                    <BottomSheetModal
                      key="camera-type-select"
                      ref={bottomSheetModalRef}
                      snapPoints={snapPoints}
                      backgroundStyle={{
                        backgroundColor: colors.loyaltyCameraModalBackground,
                        borderRadius: 52,
                      }}
                      enableHandlePanningGesture={true}
                      enableContentPanningGesture={true}
                    >
                      <BottomSheetView style={[styles.buttonWrapper,{backgroundColor: colors.loyaltyCameraModalBackground}]}>
                        <View
                          style={[
                            styles.cameraButtonWrapper,
                            {
                              backgroundColor: colors.loyaltyCameraModalBackground,
                              borderRadius: 52
                            },
                          ]}
                        >
                          <TypographyText
                                title={t('BillScanner.uploadReceipt')}
                                style={styles.title}
                                font={BALOO_2}
                                textColor={colors.loyaltyTextMainTitle}
                                size={23}
                          />
                          <View style={styles.rowContainer}>
                            <TouchableOpacity
                              onPress={async () => {
                                try {
                                const granted = await requestCameraPermission();
                                if (!granted) return;
                                console.log('here')
                                const result = await launchCamera({
                                  saveToPhotos: true,
                                  mediaType: 'photo',
                                  includeBase64: true,
                                });

                                const base64Image = result?.assets?.[0]?.base64;

                                if (!base64Image) {
                                  return;
                                }
                                setSelectedImage(base64Image);

                              }catch(err){
                                console.log(err,'launch camera error')
                              }
                              }}
                              style={styles.btnWrapper}
                            >
                              <View style={[styles.button,{backgroundColor: colors.loyaltyCameraIconBackground}]}>
                                <CameraSvg color={colors.loyaltyPrimary} />
                              </View>

                              <TypographyText
                                title={t('BillScanner.camera')}
                                style={styles.btnText}
                                font={BALOO_2}
                                textColor={colors.loyaltyTextMainTitle}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={async () => {
                                const result = await launchImageLibrary({
                                  selectionLimit: 1,
                                  mediaType: 'photo',
                                  includeBase64: true,
                                });

                                const base64Image = result?.assets?.[0]?.base64;

                                if (!base64Image) {
                                  return;
                                }

                                setSelectedImage(base64Image);
                              }}
                              style={styles.btnWrapper}
                            >
                              <View style={[styles.button,{backgroundColor: colors.loyaltyCameraIconBackground}]}>
                                <GallerySvg color={colors.loyaltyPrimary}/>
                              </View>

                              <TypographyText
                                title={t('BillScanner.gallery')}
                                style={styles.btnText}
                                font={BALOO_2}
                                textColor={colors.loyaltyTextMainTitle}
                              />
                            </TouchableOpacity>
                          </View>


                          <Button primary text={t('BillScanner.upload')} style={styles.submitBtn} onPress={() => {
                            setFieldValue(name, selectedImage);
                            hideModal();
                          }}
                          />
                        </View>
                      </BottomSheetView>
                    </BottomSheetModal>
                  </View>
                </BottomSheetModalProvider>
              </Portal>
              {errors?.['bill_image'] && (
                <TypographyText
                  title={errors?.['bill_image']}
                  textColor={'#FF406E'}
                  size={14}
                  style={{ fontWeight: '700', marginTop: 3 }}
                />
              )}
            </>
          );
        }}
      </Field>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { 
    fontWeight: '700',
    marginTop: 33
  },
  submitBtn: {
    alignSelf: 'stretch',
    marginTop: 37
  },
  scanIconBlock: {
     height: 56,
     width: 56,
     borderRadius: 13,
     justifyContent: 'center',
     alignItems: 'center'
  },
  textBlock: {
    flex: 1,
    paddingHorizontal: 15
  },
  select: {
    height: 100,
    borderRadius: 39,
    paddingVertical: 22,
    paddingHorizontal: 27,
    borderWidth: 1,
    alignItems: 'center'
  },
  wrapper: {
    marginBottom: 15,
    marginTop: 20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 23
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.white,
  },
  cameraButtonWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 33,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopRightRadius: 52,
    borderTopLeftRadius: 52,
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderTopRightRadius: 52,
    borderTopLeftRadius: 52,
  },
  backContainer: {
    position: 'absolute',
    right: 15,
    top: 15,
    borderWidth: 1,
    borderRadius: 20,
    padding: 4,
  },
  closeIcon: {
    tintColor: colors.white,
    height: 20,
    width: 20,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 36
  },
  btnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    marginTop: 10,
    fontWeight: '500'
  },
  slectedImageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 16,
  },
  selectedImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
  },
  removeImageText: {
    marginLeft: 10,
    fontWeight: '700',
  },
  removeText: {
    position: 'absolute',
    bottom: 0,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FormikCameraPicker;
