import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { TypographyText } from '../../../components/Typography';
import { BALOO_MEDIUM } from '../../../redux/types';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import FilterIcon from '../../../assets/filter.svg';
import { sized } from '../../../Svg';

const FilterButton = ({ onPress, activeFiltersCount = 0 }) => {
  const { isDark } = useTheme();
  const { filters } = useSelector(state => state.globalTix);
  
  const FilterIconSvg = sized(
    FilterIcon,
    20,
    20,
    isDark ? colors.white : colors.darkBlue
  );

  const hasActiveFilters = filters.categoryIds || filters.cityIds || filters.countryCode;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: hasActiveFilters 
            ? (isDark ? colors.orange : colors.orange) 
            : (isDark ? colors.mainDarkModeText : colors.white),
          borderColor: isDark ? colors.darkGrey : colors.lightGrey,
        }
      ]}
      onPress={onPress}
    >
      <FilterIconSvg />
      {hasActiveFilters && (
        <View style={styles.badge}>
          <TypographyText
            title={activeFiltersCount.toString()}
            size={10}
            font={BALOO_MEDIUM}
            textColor={colors.white}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FilterButton;
