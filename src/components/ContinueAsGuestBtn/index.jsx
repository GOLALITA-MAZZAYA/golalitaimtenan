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

const ContinueAsGuestBtn = ({ label }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const color = isDark ? colors.mainDarkMode : colors.grey;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    axios
      .post(`https://${BASE_URL}/api/go/get_test_value/qcb`, {
        params: { token: '' },
      })
      .then(res => {
        console.log(res.data, 'ContinueAsGuestBtn res');
        const testGolalita = res.data?.result?.[0]?.testGolalita;

        if (typeof testGolalita === 'boolean' && testGolalita !== isVisible) {
          setIsVisible(testGolalita);
        }
      })
      .catch(err => {
        console.log(err, 'err');
      });
  }, []);

  const handleContinueLikeGuestPress = () => {
    dispatch(
      login({
        login: 'guest@qcb.com',
        password: 'abc123123',
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
