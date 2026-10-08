import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../components/ThemeProvider';
import { colors } from '../../components/colors';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/auth/auth-thunks';
import { setIsGuest } from '../../redux/auth/auth-actions';
import { useTranslation } from 'react-i18next';
import CommonButton from '../../components/CommonButton/CommonButton';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import logger from '../../utils/logger';

const FALLBACK_GUEST_LOGIN = 'guest@qcb.com';
const FALLBACK_GUEST_PASSWORD = 'abc123123';

const ContinueAsGuestBtn = ({ label }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const color = isDark ? colors.mainDarkMode : colors.grey;
  const [isVisible, setIsVisible] = useState(false);
  const [guestCredentials, setGuestCredentials] = useState(null);

  useEffect(() => {
    axios
      .post(`https://${BASE_URL}/api/go/get_test_value/qcb`, {
        params: { token: '' },
      })
      .then(res => {
        const result = res.data?.result?.[0];
        const testGolalita = result?.testGolalita;

        if (typeof testGolalita === 'boolean' && testGolalita !== isVisible) {
          setIsVisible(testGolalita);
        }

        // Prefer backend-provided guest credentials when available.
        if (result?.guest_login && result?.guest_password) {
          setGuestCredentials({
            login: result.guest_login,
            password: result.guest_password,
          });
        }
      })
      .catch(() => {
        logger.warn('Failed to load guest login visibility');
      });
  }, []);

  const handleContinueLikeGuestPress = () => {
    const credentials =
      guestCredentials?.login && guestCredentials?.password
        ? guestCredentials
        : {
            login: FALLBACK_GUEST_LOGIN,
            password: FALLBACK_GUEST_PASSWORD,
          };

    dispatch(
      login({
        login: credentials.login,
        password: credentials.password,
        device_type: Platform.OS,
      }),
    );
    dispatch(setIsGuest(true));
  };

  if (!isVisible) {
    return null;
  }

  return (
    <CommonButton
      style={{ ...styles.btn, borderColor: color, elevation: 0 }}
      textColor={color}
      onPress={handleContinueLikeGuestPress}
      label={label || t('Login.continueAsGuest')}
    />
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'transparent',
    marginTop: 10,
    borderWidth: 1,
  },
});

export default ContinueAsGuestBtn;
