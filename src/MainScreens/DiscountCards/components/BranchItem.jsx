import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { TypographyText } from '../../../components/Typography';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../../redux/types';
import { isRTL } from '../../../../utils';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

const PhoneIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4741 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.4019C21.1468 21.5901 20.9046 21.733 20.6407 21.8215C20.3767 21.91 20.0969 21.9421 19.819 21.915C16.7429 21.5801 13.787 20.5283 11.19 18.845C8.77382 17.2931 6.72533 15.2446 5.173 12.828C3.48364 10.2205 2.43135 7.25197 2.103 4.16499C2.07604 3.88769 2.10777 3.60851 2.19614 3.34509C2.28451 3.08168 2.42751 2.83989 2.61517 2.63503C2.80283 2.43018 3.03102 2.26678 3.28514 2.15535C3.53926 2.04391 3.81368 1.98687 4.091 1.98799H7.091C7.57398 1.98328 8.04192 2.1542 8.40698 2.46849C8.77204 2.78278 9.00938 3.21989 9.074 3.69799C9.19429 4.60093 9.41499 5.48834 9.731 6.34199C9.89433 6.77793 9.91427 7.25208 9.78828 7.70119C9.66228 8.1503 9.39575 8.5546 9.024 8.86099L7.753 10.132C9.18342 12.6475 11.2635 14.7276 13.779 16.158L15.05 14.887C15.3564 14.5152 15.7607 14.2487 16.2098 14.1227C16.6589 13.9967 17.1331 14.0167 17.569 14.18C18.4227 14.496 19.3101 14.7167 20.213 14.837C20.6961 14.9022 21.1373 15.1436 21.4526 15.5146C21.7679 15.8856 21.936 16.3608 21.926 16.848L22 16.92Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const NavigationIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 11L22 2L13 21L11 13L3 11Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BranchItem = ({ branch }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const rtl = isRTL();

  const branchName = rtl
    ? branch.name_arabic || branch.name
    : branch.name || branch.name_arabic;

  const handleCall = () => {
    const rawPhone = String(branch.phone || '').trim();
    // Strip spaces/dashes/brackets the backend may include; keep a leading "+".
    const number = rawPhone.replace(/[^\d+]/g, '');
    if (!number) {
      Alert.alert(branchName || t('DiscountCards.call', 'Call'), rawPhone || t('DiscountCards.noPhone', 'Phone number not available'));
      return;
    }
    // Always confirm first: gives visible feedback even where tel: silently no-ops (iOS Simulator,
    // tablets without a dialer), and shows the number so the user can dial it manually.
    Alert.alert(branchName || t('DiscountCards.call', 'Call'), rawPhone, [
      { text: t('General.cancel', 'Cancel'), style: 'cancel' },
      {
        text: t('DiscountCards.call', 'Call'),
        onPress: () =>
          Linking.openURL(`tel:${number}`).catch(() =>
            Alert.alert(t('DiscountCards.callUnavailable', 'Calling is not supported on this device'), rawPhone)
          ),
      },
    ]);
  };

  const handleDirections = () => {
    const lat = branch.latitude;
    const lng = branch.longitude;
    if (lat && lng) {
      const scheme = Platform.select({
        ios: `maps:0,0?q=${lat},${lng}`,
        android: `geo:0,0?q=${lat},${lng}`,
      });
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      Linking.canOpenURL(scheme)
        .then((supported) => {
          if (supported) {
            Linking.openURL(scheme);
          } else {
            Linking.openURL(webUrl);
          }
        })
        .catch(() => Linking.openURL(webUrl));
    }
  };

  const activeColor = colors.main || '#C29F54';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.textContainer}>
        <TypographyText
          title={branchName || 'Branch'}
          size={14}
          font={LUSAIL_BOLD}
          textColor={isDark ? colors.white : colors.black}
        />
        {Boolean(branch.address) && (
          <TypographyText
            title={branch.address}
            size={12}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#9CA3AF' : '#6B7280'}
            style={styles.addressText}
          />
        )}
      </View>

      <View style={styles.actionButtons}>
        {Boolean(branch.phone) && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB' }]}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <PhoneIcon size={14} color={isDark ? colors.white : colors.black} />
          </TouchableOpacity>
        )}

        {Boolean(branch.latitude && branch.longitude) && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: activeColor }]}
            onPress={handleDirections}
            activeOpacity={0.7}
          >
            <NavigationIcon size={14} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  addressText: {
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BranchItem;
