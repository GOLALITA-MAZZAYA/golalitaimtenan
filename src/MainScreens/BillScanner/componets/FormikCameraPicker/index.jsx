import React, { useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Icons } from './assets';
import { moderateScale } from './metrics';
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
import { BALOO_MEDIUM, BALOO_REGULAR } from '../../../../redux/types';
import ScanSvg from '../../../../assets/scan.svg';
import { sized } from '../../../../Svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { isRTL } from '../../../../../utils';
import { mainStyles } from '../../../../styles/mainStyles';

const { height } = Dimensions.get('window');
const snapPoint = ((180 / height) * 100).toFixed(0);

const FormikCameraPicker = () => {
  const { isDark } = useTheme();
  const bottomSheetModalRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState('');
  const { t } = useTranslation();

  const snapPoints = [snapPoint];
  const iconColor = isDark ? colors.darkGrey : colors.grey;
  const ScanIcon = sized(ScanSvg, 40, 40, iconColor);

  const showModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const hideModal = () => {
    bottomSheetModalRef.current?.close();
  };

  const name = 'bill_image';

  return (
    <View style={styles.wrapper}>
      <Field name={name}>
        {({ field: { value }, form: { setFieldValue, errors } }) => {
          return (
            //@ts-ignore
            <>
              <TouchableOpacity onPress={showModal}>
                <TypographyText
                  textColor={isDark ? colors.darkGrey : colors.darkBlue}
                  size={16}
                  font={BALOO_MEDIUM}
                  title={t('BillScanner.scanBill')}
                  numberOfLines={1}
                  style={{ fontWeight: '700' }}
                />

                <ScanIcon
                  style={{
                    left: isRTL() ? 5 : -5,
                    alignSelf: isRTL() ? 'flex-end' : 'flex-start',
                  }}
                />
                {selectedImage && (
                  <View
                    style={[
                      styles.slectedImageWrapper,
                      {
                        alignSelf: isRTL() ? 'flex-end' : 'flex-start',
                      },
                    ]}
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
                      resizeMode="contain"
                    />

                    <TouchableOpacity
                      onPress={() => {
                        setSelectedImage('');
                        setFieldValue(name, '');
                      }}
                    >
                      <TypographyText
                        textColor={'#FF406E'}
                        size={14}
                        title={t('BillScanner.remove')}
                        numberOfLines={1}
                        style={styles.removeImageText}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
              <Portal name="camera-type-select">
                <BottomSheetModalProvider key="camera-type-select">
                  <View style={styles.container}>
                    <BottomSheetModal
                      key="camera-type-select"
                      ref={bottomSheetModalRef}
                      snapPoints={snapPoints}
                      backgroundStyle={{
                        backgroundColor: isDark
                          ? colors.navyBlue
                          : colors.darkBlue,
                      }}
                      enableHandlePanningGesture={true}
                      enableContentPanningGesture={true}
                    >
                      <BottomSheetView style={styles.buttonWrapper}>
                        <View
                          style={[
                            styles.cameraButtonWrapper,
                            {
                              backgroundColor: isDark
                                ? colors.mainDarkMode
                                : colors.darkBlue,
                            },
                          ]}
                        >
                          <TouchableOpacity
                            style={[
                              styles.backContainer,
                              {
                                borderColor: colors.white,
                              },
                            ]}
                            onPress={hideModal}
                          >
                            <Image
                              source={Icons.close}
                              style={styles.closeIcon}
                            />
                          </TouchableOpacity>
                          <View style={styles.rowContainer}>
                            <TouchableOpacity
                              onPress={async () => {
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

                                setFieldValue(name, base64Image);
                                hideModal();
                              }}
                              style={styles.btnWrapper}
                            >
                              <View style={styles.button}>
                                <Image
                                  source={Icons.camera}
                                  style={styles.icon}
                                />
                              </View>

                              <TypographyText
                                title={t('BillScanner.camera')}
                                style={styles.btnText}
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
                                setFieldValue(name, base64Image);
                                hideModal();
                              }}
                              style={styles.btnWrapper}
                            >
                              <View style={styles.button}>
                                <Image
                                  source={Icons.gallery}
                                  style={styles.icon}
                                />
                              </View>

                              <TypographyText
                                title={t('BillScanner.gallery')}
                                style={styles.btnText}
                              />
                            </TouchableOpacity>
                          </View>
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
  wrapper: {
    marginBottom: 15,
  },
  button: {
    borderWidth: moderateScale(2),
    borderColor: colors.white,
    borderRadius: moderateScale(30),
    padding: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(50),
    height: moderateScale(50),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.white,
  },
  cameraButtonWrapper: {
    padding: moderateScale(50),
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopRightRadius: moderateScale(25),
    borderTopLeftRadius: moderateScale(25),
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    marginTop: 10,
    color: colors.white,
  },
  slectedImageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 16,
  },
  selectedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,

    ...mainStyles.lightShadow,
  },
  removeImageText: {
    marginLeft: 10,
    fontWeight: '700',
  },
});

export default FormikCameraPicker;
