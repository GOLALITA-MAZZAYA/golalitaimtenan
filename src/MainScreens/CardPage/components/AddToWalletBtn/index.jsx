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
import { APP_ORGANIZATION_ID } from '../../../../api/wallet';

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
      const { name, x_user_expiry, barcode, x_moi_last_name, phone } =
        selectedCardItem;

      let lastName =
        x_moi_last_name && x_moi_last_name !== 'false' ? x_moi_last_name : '';
      let fullName = lastName ? `${name} ${lastName}`.trim() : (name || '').trim();

      const defaultOrgName = 'Imtenan';

      const data = {
        name: fullName,
        contact: phone || user?.phone || undefined,
        x_user_expiry,
        organisation: user?.organisation || defaultOrgName,
        organisationAndroid: user?.organisation || defaultOrgName,
        organizationId:
          user?.wallet_organization_id ||
          user?.organizationId ||
          APP_ORGANIZATION_ID,
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

      // Android returns { opened: true }
      if (result && result.opened) {
        showMessage({
          type: 'success',
          message: t('CardPage.addCardSuccessMsg'),
        });
      } else if (result === false) {
        // iOS returns false if pass already present
        showMessage({
          type: 'warning',
          message: t('CardPage.addedCardMsg'),
        });
      } else if (result) {
        // iOS returns true on success
        showMessage({
          type: 'success',
          message: t('CardPage.addCardSuccessMsg'),
        });
      }
    } catch (err) {
      console.log('AddToWalletBtn error:', err?.message || err);
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
