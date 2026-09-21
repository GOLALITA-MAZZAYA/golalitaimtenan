import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { sized } from '../../Svg';
import ArrowSvg from '../../assets/loyaltyPoints/rightArrow.svg';
import { isRTL } from '../../../utils';

const ESimHelpRow = ({ title, onPress, isDark }) => {
  const rtl = isRTL();
  const Chevron = sized(
    ArrowSvg,
    14,
    14,
    isDark ? colors.mainDarkMode : colors.darkBlue,
  );

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          borderBottomColor: isDark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.06)',
          flexDirection: rtl ? 'row-reverse' : 'row',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TypographyText
        title={title}
        size={16}
        font={LUSAIL_REGULAR}
        textColor={isDark ? colors.white : colors.black}
        style={styles.title}
      />
      <View style={rtl ? styles.chevronRtl : styles.chevron}>
        <Chevron />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 8,
  },
  chevronRtl: {
    transform: [{ scaleX: -1 }],
    marginRight: 8,
  },
});

export default ESimHelpRow;
