import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { TypographyText } from '../../../../components/Typography';
import FilterSvg from '../../../../assets/filter.svg';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../components/colors';
import { sized } from '../../../../Svg';
import { mainStyles } from '../../../../styles/mainStyles';

const FilterIcon = sized(FilterSvg, 21, 21, '#686868');

const FiltersBtn = ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} style={styles.geoButton}>
      <View style={styles.wrapper}>
        <FilterIcon />
        <TypographyText
          textColor={'#686868'}
          size={10}
          title={t('MapPage.filters')}
          style={styles.text}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  geoButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 350,
    right: 6,
    zIndex: 100,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default FiltersBtn;
