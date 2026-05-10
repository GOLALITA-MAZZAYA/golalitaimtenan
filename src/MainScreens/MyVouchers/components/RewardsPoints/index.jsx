import { StyleSheet, View, Switch } from 'react-native';
import { TypographyText } from '../../../../components/Typography';
import { useTheme } from '../../../../components/ThemeProvider';
import { colors } from '../../../../components/colors';
import { BALOO_BOLD, BALOO_REGULAR } from '../../../../redux/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL } from '../../../../../utils';

const RewardsPoints = ({ style }) => {
  const { isDark } = useTheme();
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useTranslation();
  const toggleSwitch = () => setIsChecked(!isChecked);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        <Switch
          trackColor={{ false: '#767577', true: '#129B82' }}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isChecked}
        />
      </View>
      <View
        style={{
          flexDirection: isRTL() ? 'row-reverse' : 'row',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <TypographyText
          title={t('Vouchers.useRewardPoints')}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={16}
          font={BALOO_BOLD}
          style={styles.text}
        />
        <TypographyText
          title={`0 ${t('Vouchers.rewardPointsAvailable')}`}
          textColor={isDark ? colors.white : colors.darkBlue}
          size={14}
          font={BALOO_REGULAR}
          style={styles.text}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {},
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
});

export default RewardsPoints;
