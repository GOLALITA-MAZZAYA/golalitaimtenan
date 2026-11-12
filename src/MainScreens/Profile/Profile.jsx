import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Image from "../../components/AppImage";
import { colors } from '../../components/colors';
import { sized } from '../../Svg';
import styles from './styles';
import CameraSvg from '../../assets/camera.svg';
import { mainStyles } from '../../styles/mainStyles';
import Input from '../../components/Input/Input';
import CommonButton from '../../components/CommonButton/CommonButton';
import CommonButtonSecondary from '../../components/CommonButtonSecondary/CommonButtonSecondary';
import { DialogWindow } from '../../components/DialogWindow/DialogWindow';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useTheme } from '../../components/ThemeProvider';
import { connect, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { updateProfile } from '../../redux/auth/auth-thunks';
import EditSvg from '../../assets/profile_edit.svg';
import { useTranslation } from 'react-i18next';
import { LUSAIL_REGULAR, VERSION } from '../../redux/types';
import { TypographyText } from '../../components/Typography';
import { deleteAccount } from '../../redux/merchant/merchant-thunks';
import TopCircleShadow from '../../components/TopCircleShadow';

import {
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Header from '../../components/Header';
import authApi from '../../redux/auth/auth-api';
import { getUpdatedValues } from './helpers';
import { setProfileLoading } from '../../redux/auth/auth-actions';
import { showMessage } from 'react-native-flash-message';
import { useValidation } from '../../hooks/useValidation';
import useIsMumayz from '../../hooks/useIsMumayz';
import useIsGuest from '../../hooks/useIsGuest';

const CameraIcon = sized(CameraSvg, 36, 32);
const EditIcon = sized(EditSvg, 31);

const waitForModalClose = () =>
  new Promise(resolve => setTimeout(resolve, 400));

const requestCameraPermission = async () => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;

  const status = await request(permission);
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
};

const Profile = ({
  navigation,
  user,
  profileLoading,
  updateProfile,
  deleteAccount,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const [isDialogWindow, setIsDialogWindow] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [image, setImage] = useState(null);
  const ref_to_input1 = useRef(null);
  const ref_to_input2 = useRef(null);
  const ref_to_input3 = useRef(null);
  const isMumayaz = useIsMumayz(user?.email);
  const isGuest = useIsGuest();
  const { getProfileScreenValidationSchema } = useValidation();

  const validation = getProfileScreenValidationSchema();

  // useEffect(() => {
  //   (async () => {
  //     let permissions = [PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE];

  //     if (Platform.OS === 'android') {
  //       if (Platform.Version >= 33) {
  //         permissions.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
  //       } else {
  //         permissions.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  //       }

  //       try {
  //         let statuses = await checkMultiple(permissions);

  //         console.log(statuses, 'status');

  //         let notGrantedPermissions = Object.entries(statuses)
  //           .filter(item => item[1] !== 'granted')
  //           .map(item => item[0]);

  //         if (notGrantedPermissions.length) {
  //           statuses = await requestMultiple(notGrantedPermissions);

  //           notGrantedPermissions = Object.entries(statuses)
  //             .filter(item => item[1] !== 'granted')
  //             .map(item => item[0]);
  //         }

  //         console.log(notGrantedPermissions, 'not granted');

  //         if (notGrantedPermissions.length) {
  //           alert('Sorry, we need camera roll permissions to make this work!');
  //         }
  //       } catch (err) {}
  //     }
  //   })();
  // }, []);

  const pickImage = async () => {
    // Dismiss the action sheet first — iOS cannot present the picker over RN Modal.
    setIsDialogWindow(false);
    setIsClicked(false);
    await waitForModalClose();

    try {
      const data = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      });

      if (data?.didCancel || data?.errorCode) {
        return;
      }

      const base64 = data?.assets?.[0]?.base64;

      if (!base64) {
        return;
      }

      setImage(base64);
      updateProfile({
        image_1920: base64,
      });
    } catch (err) {
      console.log(err, 'pickImage error');
    }
  };

  const launchCameraFunc = async () => {
    // Dismiss the action sheet first — iOS cannot present the camera over RN Modal.
    setIsDialogWindow(false);
    setIsClicked(false);
    await waitForModalClose();

    try {
      const granted = await requestCameraPermission();

      if (!granted) {
        Alert.alert(
          t('General.error'),
          t('Profile.cameraPermissionRequired'),
        );
        return;
      }

      const data = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
      });

      if (data?.didCancel) {
        return;
      }

      if (data?.errorCode) {
        console.log(data.errorCode, data.errorMessage, 'launchCamera');

        if (data.errorCode === 'camera_unavailable') {
          Alert.alert(
            t('General.error'),
            t('Profile.cameraUnavailable', {
              defaultValue:
                'Camera is not available on this device. Use a real iPhone or Android phone to test Take Photo. You can still use Choose Photo on the simulator.',
            }),
          );
          return;
        }

        if (data.errorCode === 'permission') {
          Alert.alert(
            t('General.error'),
            t('Profile.cameraPermissionRequired'),
          );
          return;
        }

        Alert.alert(t('General.error'), data.errorMessage || t('General.error'));
        return;
      }

      const base64 = data?.assets?.[0]?.base64;

      if (!base64) {
        return;
      }

      setImage(base64);
      updateProfile({
        image_1920: base64,
      });
    } catch (err) {
      console.log(err, 'launchCamera error');
      Alert.alert(t('General.error'), String(err?.message || err));
    }
  };

  let items = [
    {
      name: t('Profile.deletePhoto'),
      func: () => {
        updateProfile({
          name: user.name,
          image_1920: '',
        });
        setImage(null);
        setIsDialogWindow(false);
      },
      color: colors.red,
    },
    {
      name: t('Profile.takePhoto'),
      func: launchCameraFunc,
    },
    {
      name: t('Profile.choosePhoto'),
      func: pickImage,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        flex: 1,
      }}
    >
      {isDialogWindow && (
        <DialogWindow
          items={items}
          isClicked={isClicked}
          isVisible={isDialogWindow}
          onCancel={() => setIsDialogWindow(false)}
        />
      )}
      <Formik
        initialValues={{
          name: user.name,
          x_moi_last_name: user.x_moi_last_name,
          email: user.email,
          phone: user.phone,
        }}
        onSubmit={async (values, { setFieldError }) => {
          try {
            const updatedValues = getUpdatedValues(user, values);

            if (Object.keys(updatedValues).length === 0) {
              showMessage({
                message: t('Profile.noFieldsToUpdate'),
                type: 'danger',
              });

              return;
            }

            dispatch(setProfileLoading(true));

            if (updatedValues.phone) {
              const phoneRes = await authApi.checkPhone({
                params: { phone: updatedValues.phone },
              });

              if (phoneRes.data.result?.error) {
                setFieldError('phone', t('Profile.phoneExists'));

                throw 'err';
              }
            }

            if (updatedValues.email) {
              const res = await authApi.checkEmail({
                params: { email: updatedValues.email },
              });

              if (res.data.result?.error) {
                setFieldError('email', t('Profile.emailExists'));

                throw 'err';
              }

              navigation.navigate('ProfileEmailVerification', {
                ...updatedValues,
              });
            } else {
              updateProfile(updatedValues);
            }
          } catch (error) {
            console.log(error, 'update profile error');
          } finally {
            dispatch(setProfileLoading(false));
          }
        }}
        validationSchema={validation}
      >
        {({ values, handleChange, handleSubmit, errors, submitCount }) => {
          errors = submitCount > 0 ? errors : {};
          return (
            <SafeAreaView style={{ flex: 1 }}>
              <TopCircleShadow />
              <Header
                label={t('Profile.myProfile')}
                btns={['back']}
                additionalBtnsProps={{
                  back: {
                    onPress: () => {
                      if (
                        user.name !== values.name ||
                        user.email !== values.email ||
                        user.phone !== values.phone
                      ) {
                        Alert.alert(t('Profile.doYouWantSaveChanges'), '', [
                          {
                            text: t('Profile.yes'),
                            onPress: () => {
                              updateProfile(
                                {
                                  name: values.name,
                                  email: values.email,
                                  phone: values.phone,
                                },
                                undefined,
                                t,
                              );
                              navigation.goBack();
                            },
                          },
                          {
                            text: t('Profile.no'),
                            onPress: () => navigation.goBack(),
                            style: 'cancel',
                          },
                        ]);
                      } else {
                        navigation.goBack();
                      }
                    },
                  },
                }}
              />

              <ScrollView style={{ flex: 1 }}>
                <View style={mainStyles.p20}>
                  <View style={mainStyles.centeredRow}>
                    {image !== null || user.photo ? (
                      <View style={styles.changePhoto}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 50,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                          }}
                          source={{
                            uri: image
                              ? `data:image/png;base64,${image}`
                              : user.photo,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => setIsDialogWindow(true)}
                          style={styles.changePhoto__icon}
                        >
                          <EditIcon color={isDark ? colors.mainDarkMode : colors.darkBlue} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setIsDialogWindow(true)}
                        style={styles.changePhoto}
                      >
                        <CameraIcon />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TypographyText
                    title={`v ${VERSION}`}
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={14}
                    font={LUSAIL_REGULAR}
                    style={{ alignSelf: 'center', fontWeight: '700' }}
                  />
                  <Input
                    innerRef={ref_to_input1}
                    label={t('Profile.firstName')}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    error={errors.name}
                    returnKeyType={'next'}
                    editable={!isMumayaz}
                    onSubmitEditing={() => ref_to_input2.current.focus()}
                  />
                  <Input
                    innerRef={ref_to_input2}
                    label={t('Profile.lastName')}
                    value={values.x_moi_last_name}
                    wrapperStyle={{ marginVertical: 20 }}
                    onChangeText={handleChange('x_moi_last_name')}
                    error={errors.x_moi_last_name}
                    returnKeyType={'next'}
                    editable={!isMumayaz}
                    onSubmitEditing={() => ref_to_input3.current.focus()}
                  />
                  <Input
                    innerRef={ref_to_input3}
                    label={t('ContactUs.email')}
                    wrapperStyle={{ marginBottom: 20 }}
                    value={values.email}
                    onChangeText={e => {
                      handleChange('email')(e.toLowerCase());
                    }}
                    returnKeyType={'next'}
                    onSubmitEditing={Keyboard.dismiss}
                    error={errors.email}
                    style={{ textTransform: 'lowercase' }}
                    autoCorrect={false}
                    keyboardType={
                      Platform.OS === 'ios' ? 'default' : 'visible-password'
                    }
                    // secureTextEntry={true}
                    editable={false}
                    secureTextEntry={false}
                  />
                  {!isMumayaz && (
                    <Input
                      // verified={phoneVerified}
                      label={t('ContactUs.mobileNumber')}
                      initialValue={values.phone}
                      onChangePhoneNumber={e => {
                        handleChange('phone')(e.toLowerCase());
                      }}
                      returnKeyType={'next'}
                      onSubmitEditing={Keyboard.dismiss}
                      error={errors.phone}
                      disableInputRtl
                    // onPressNotVerified={() =>
                    //   verifyHandler(validation, values, "phone")
                    // }
                    />
                  )}

                  {!isMumayaz && !isGuest && (
                    <>
                      <CommonButton
                        onPress={handleSubmit}
                        label={t('Profile.updateProfile')}
                        style={{ marginVertical: 27 }}
                        textColor={
                          isDark ? colors.mainDarkModeText : colors.white
                        }
                        loading={profileLoading}
                      />

                      <CommonButtonSecondary
                        onPress={() => navigation.navigate('ChangePassword')}
                        label={t('Profile.changePassword')}
                        style={{
                          marginBottom: 10,
                          borderColor: isDark
                            ? colors.mainDarkMode
                            : colors.darkBlue,
                        }}
                        textColor={
                          isDark ? colors.mainDarkMode : colors.darkBlue
                        }
                        loading={profileLoading}
                      />
                      <TouchableOpacity
                        disabled={profileLoading}
                        onPress={() => {
                          Alert.alert(
                            t('Profile.deleteAccount'),
                            t('Profile.deleteAccountDescription'),
                            [
                              {
                                text: t('Profile.no'),
                                onPress: () => { },
                                style: 'cancel',
                              },
                              {
                                text: t('Profile.yes'),
                                onPress: deleteAccount,
                              },
                            ],
                          );
                        }}
                        style={{
                          paddingVertical: 13,
                          alignItems: 'center',
                          marginBottom: 140,
                        }}
                      >
                        <TypographyText
                          title={t('Profile.deleteAccount')}
                          textColor={colors.red}
                          size={18}
                          font={LUSAIL_REGULAR}
                          style={{ marginTop: 5, fontWeight: '700' }}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </ScrollView>
            </SafeAreaView>
          );
        }}
      </Formik>
    </View>
  );
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  profileLoading: state.authReducer.profileLoading,
});

export default connect(mapStateToProps, {
  updateProfile,
  deleteAccount,
})(Profile);
