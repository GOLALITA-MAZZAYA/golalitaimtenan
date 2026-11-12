import { StyleSheet, Platform } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { colors } from '../colors';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/auth/auth-thunks';
import { useTranslation } from 'react-i18next';
import CommonButton from '../CommonButton/CommonButton';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { org } from '../../org/config';
import logger from '../../utils/logger';

const FALLBACK_GUEST_PASSWORD = 'abc123123';

// Visibility is gated by a backend feature flag for this org. The same
// response may also carry the org's guest credentials, which win over the
// fallback in org.guestEmail.
const ContinueAsGuestBtn = ({ label }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const color = isDark ? colors.mainDarkMode : colors.grey;
  const [isVisible, setIsVisible] = useState(false);
  const [guestCredentials, setGuestCredentials] = useState(null);

  useEffect(() => {
    axios
      .post(`https://${org.baseUrl}/api/go/get_test_value/${org.code}`, {
        params: { token: '' },
      })
      .then(res => {
        const result = res.data?.result?.[0];
        const testGolalita = result?.testGolalita;

        if (typeof testGolalita === 'boolean' && testGolalita !== isVisible) {
          setIsVisible(testGolalita);
        }

        if (result?.guest_login && result?.guest_password) {
          setGuestCredentials({
            login: result.guest_login,
            password: result.guest_password,
          });
        }
      })
      .catch(() => {
        // Stay hidden if the flag can't be loaded.
        logger.warn('Failed to load guest login visibility');
      });
  }, []);

  const handleContinueLikeGuestPress = () => {
    const credentials =
      guestCredentials?.login && guestCredentials?.password
        ? guestCredentials
        : { login: org.guestEmail, password: FALLBACK_GUEST_PASSWORD };

    // The thunk flags the session as guest only after the login succeeds.
    dispatch(
      login(
        {
          login: credentials.login,
          password: credentials.password,
          device_type: Platform.OS,
        },
        undefined,
        { asGuest: true },
      ),
    );
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
