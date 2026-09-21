import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { isRTL } from '../../../utils';

const ESimSegmentedTabs = ({ tabs, value, onChange }) => {
  const { isDark } = useTheme();
  const rtl = isRTL();

  return (
    <View
      style={[
        styles.tabs,
        { flexDirection: rtl ? 'row-reverse' : 'row' },
      ]}
    >
      {tabs.map(item => {
        const active = value === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.tab,
              active && (isDark ? styles.tabActiveDark : styles.tabActiveLight),
            ]}
            onPress={() => onChange(item.value)}
          >
            <TypographyText
              title={item.label}
              size={13}
              font={LUSAIL_REGULAR}
              textColor={
                active
                  ? isDark
                    ? colors.mainDarkModeText
                    : colors.white
                  : isDark
                  ? colors.white
                  : colors.darkBlue
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
    alignItems: 'center',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tabActiveLight: {
    backgroundColor: colors.darkBlue,
  },
  tabActiveDark: {
    backgroundColor: colors.mainDarkMode,
  },
});

export default ESimSegmentedTabs;
