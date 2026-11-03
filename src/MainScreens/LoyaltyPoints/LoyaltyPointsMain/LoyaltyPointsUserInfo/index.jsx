import React from "react";
import { StyleSheet, View } from "react-native";
import { TypographyText } from "../../../../components/Typography";
import { useSelector } from "react-redux";
import { userSelector } from "../../../../redux/auth/auth-selectors";
import { colors } from "../../../../components/colors";
import { navigate } from "../../../../Navigation/RootNavigation";
import { useTranslation } from "react-i18next";
import useUserLoyaltyPoints from "../../../../hooks/useUserLoyaltyPoints";
import ButtonWithImage from "../../common/ButtonWithIcon";
import ScanSvg from '../../../../assets/loyaltyPoints/home/scan.svg';
import ScanSvgLight from '../../../../assets/loyaltyPoints/home/scan-light.svg';
import PlayLight from '../../../../assets/loyaltyPoints/home/play-light.svg';
import PlaySvg from '../../../../assets/loyaltyPoints/home/play.svg';
import { isRTL } from "../../../../../utils";
import { useTheme } from "../../../../components/ThemeProvider";
import { BALOO_2, BALOO_BOLD, BALOO_REGULAR } from "../../../../redux/types";

const LoyaltyPointsUserInfo = () => {
  const user = useSelector(userSelector);
  const { t } = useTranslation();
  const { points } = useUserLoyaltyPoints();
  const { isDark } = useTheme();

  const handleScanPress = () => {
    navigate('BillScanner', {
      title: t('Drawer.scanBill'),
    });
  };

  const handleInfoPress = () => {
    navigate('loyaltyPoints-info');
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.pointsCard,
          {
            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        <View style={[styles.topRow, { alignItems: isRTL() ? 'flex-end' : 'flex-start' }]}>
          <TypographyText
            title={`${t('LoyaltyMain.hi')} ${user?.name || ''}`}
            textColor={isDark ? '#A1A1AA' : '#71717A'}
            size={14}
            font={BALOO_REGULAR}
          />
        </View>

        <View
          style={[
            styles.pointsSection,
            { alignItems: isRTL() ? 'flex-end' : 'flex-start' },
          ]}
        >
          <View style={[styles.balanceRow, { flexDirection: isRTL() ? 'row-reverse' : 'row' }]}>
            <TypographyText
              title={points ?? 0}
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              size={40}
              font={BALOO_BOLD}
              style={styles.pointsNumber}
            />
          </View>
          <TypographyText
            title={t('LoyaltyMain.availablePoints')}
            textColor={isDark ? '#71717A' : '#A1A1AA'}
            size={13}
            font={BALOO_REGULAR}
            style={styles.availableLabel}
          />
        </View>

        <View
          style={[
            styles.actionsRow,
            {
              flexDirection: isRTL() ? 'row-reverse' : 'row',
            },
          ]}
        >
          <ButtonWithImage
            text={t('LoyaltyMain.scan')}
            icon={isDark ? <ScanSvg color="#000000" /> : <ScanSvgLight />}
            primary
            style={{
              marginRight: isRTL() ? 0 : 5,
              marginLeft: isRTL() ? 5 : 0,
            }}
            onPress={handleScanPress}
          />

          <ButtonWithImage
            text={t('LoyaltyMain.howItWorks')}
            icon={isDark ? <PlaySvg color={colors.mainDarkMode} /> : <PlayLight />}
            style={{
              marginRight: isRTL() ? 5 : 0,
              marginLeft: isRTL() ? 0 : 5,
            }}
            onPress={handleInfoPress}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  pointsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    marginBottom: 4,
  },
  pointsSection: {
    marginBottom: 18,
  },
  balanceRow: {
    alignItems: 'baseline',
  },
  pointsNumber: {
    fontWeight: '700',
    lineHeight: 46,
  },
  availableLabel: {
    marginTop: -2,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default LoyaltyPointsUserInfo;