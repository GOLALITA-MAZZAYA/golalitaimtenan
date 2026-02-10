import React, { useState } from 'react';
import { useTheme } from '../../../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import useWalletCard from '../../../../hooks/useWalletCard';
import { useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { colors } from '../../../../components/colors';
import CommonButton from '../../../../components/CommonButton/CommonButton';
import { SCREEN_WIDTH } from '../../../../styles/mainStyles';
import WalletSvg from '../../../../assets/wallet.svg';
import AndroidSvg from '../../../../assets/googleWallet.svg';
import { Platform } from 'react-native';

const AddToWalletBtn = ({ selectedCardItem }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { addCardToWallet } = useWalletCard();
  const user = useSelector(state => state.authReducer.user);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    try {
      const { name, x_user_expiry, barcode, x_moi_last_name, photo, phone } =
        selectedCardItem;

      let fName = name + ' ' + x_moi_last_name;

      const data = {
        name: fName,
        contact: phone,
        organisation: user.organisation,
        organisationAndroid: user.organisation,
        x_user_expiry,
        barcode,
        device_type: Platform.OS
      }

      setLoading(true);

      const isCardAdded = await addCardToWallet(data);

      if (isCardAdded) {
        showMessage({
          type: 'warning',
          message: t('CardPage.addedCardMsg'),
        });
      }
    } catch (err) {
      console.log(err.message, 'err');
      showMessage({
        type: 'danger',
        message: t('General.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  const WalletIcon = Platform.OS === 'android' ? AndroidSvg : WalletSvg;

  return (
    <CommonButton
      label={t('CardPage.golalitaCard')}
      textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
      onPress={handlePress}
      style={{
        width: (SCREEN_WIDTH / 100) * 85,
        alignSelf: 'center',
        marginTop: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0)',
        marginBottom: 40,
        backgroundColor: 'transparent',
        borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
      }}
      loading={loading}
      icon={<WalletIcon height={30} width={30} />}
    />
  );
};

export default AddToWalletBtn;
