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
import { GOLALITA_COMPANY_ORGANIZATION_ID } from '../../../../org/config';

const AddToWalletBtn = ({ selectedCardItem }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { addCardToWallet } = useWalletCard();
  const user = useSelector(state => state.authReducer.user);
  const userId = useSelector(state => state.authReducer.userId);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!selectedCardItem) return;
    try {
      const { name, x_user_expiry, barcode, x_moi_last_name, photo, phone } =
        selectedCardItem;

      let fullName = name;

      if (x_moi_last_name) {
        fullName = fullName + ' ' + x_moi_last_name;
      }

      const data = {
        name: fullName,
        contact: phone,
        x_user_expiry,
        organisation: user.organisation || 'Golalita',
        organisationAndroid: user.organisation || 'Golalita',
        // GoLalita Company dashboard org id (admin panel Organizations).
        organizationId:
          user.wallet_organization_id ||
          user.organizationId ||
          GOLALITA_COMPANY_ORGANIZATION_ID,
        appUserId: userId || user?.partner_id || user?.id || null,
        userEmail: user?.email || null,
        barcode,
        device_type: Platform.OS,
        available_points:
          selectedCardItem.available_points || selectedCardItem.points || 0,
        photo: undefined,
        organisation_logo: undefined,
      };


      setLoading(true);

      const result = await addCardToWallet(data);

      // Android: { opened: true } after Google Wallet save sheet.
      // iOS: WalletPasses.addPass returns false when the pass was already present.
      if (result && result.opened) {
        showMessage({
          type: 'success',
          message: t('CardPage.addCardSuccessMsg'),
        });
      } else if (result === false) {
        showMessage({
          type: 'warning',
          message: t('CardPage.addedCardMsg'),
        });
      } else if (result) {
        showMessage({
          type: 'success',
          message: t('CardPage.addCardSuccessMsg'),
        });
      }
    } catch (err) {
      console.log('AddToWalletBtn error message:', err.message);
      console.log('AddToWalletBtn error response data:', JSON.stringify(err.response?.data));
      console.log('AddToWalletBtn error response status:', err.response?.status);
      console.log('AddToWalletBtn full error:', err);
      const detail =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        t('General.error');
      showMessage({
        type: 'danger',
        message: String(detail).slice(0, 160),
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
