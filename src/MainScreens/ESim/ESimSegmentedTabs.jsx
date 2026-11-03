import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { isRTL } from '../../../utils';

const ESimSegmentedTabs = ({ tabs, value, onChange }) => {
  const { isDark } = useTheme();
  const accent = isDark ? colors.mainDarkMode : colors.darkBlue;
  const rtl = isRTL();

  return (
    <View
      style={[
        styles.tabs,
        {
          backgroundColor: isDark ? '#1C1C1E' : '#E5E7EB',
          flexDirection: rtl ? 'row-reverse' : 'row',
        },
      ]}
    >
      {tabs.map(item => {
        const active = value === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.tab, active && { backgroundColor: accent }]}
            onPress={() => onChange(item.value)}
          >
            <TypographyText
              title={item.label}
              size={13}
              font={LUSAIL_REGULAR}
              textColor={
                active
                  ? isDark
                    ? colors.black
                    : colors.white
                  : isDark
                  ? '#8E8E93'
                  : '#6B7280'
              }
              style={[
                { textAlign: 'center' },
                active ? { fontWeight: '700' } : undefined,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    alignSelf: 'stretch',
    borderRadius: 20,
    padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 17,
    alignItems: 'center',
  },
});

export default ESimSegmentedTabs;
