import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { BALOO_MEDIUM } from '../../../../../redux/types';
import { TypographyText } from '../../../../../components/Typography';
import { useTheme } from '../../../../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../../components/colors';
import BottomSheetComponent from '../../../../../components/Form/BottomSheetComponent';
import { getCardmoolaCategories } from '../../../../../api/giftCard';
import { isRTL } from '../../../../../../utils';
import { useSelector } from 'react-redux';

const CardmolaCategoryPicker = (props) => {
  const { onChange, loading } = props;
  const [categories, setCategories] = useState([]);
  const [country, setCountry] = useState(props.country);
  const { cardmolaToken } = useSelector((state) => state.giftcardsReducer);
  const { isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (cardmolaToken) {
      getCardmoolaCategories(props?.country?.shortName)
        .then((res) => setCategories(res))
        .catch((err) => console.log(err, 'erere'));
    }
  }, [cardmolaToken, country]);

  const transformedCategories = (items) => {
    return items?.map((option) => ({
      value: option.productIds,
      label: option.name,
      emoji: option.emoji,
      productIds: option.productIds,
    }));
  };

  const options = useMemo(
    () => transformedCategories(categories),
    [categories?.length, country, categories],
  );

  return (
    <BottomSheetComponent
      shouldCloseModal={loading}
      loading={loading}
      name="cardmoola-giftcard-categories"
      renderSelect={() => (
        <View
          style={{
            flexDirection: isRTL() ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: isDark ? colors.white : colors.darkBlue,
            }}
          >
            <TypographyText
              textColor={isDark ? colors.white : colors.darkBlue}
              size={16}
              font={BALOO_MEDIUM}
              title={t('Vouchers.categories')}
              numberOfLines={1}
            />
          </View>
        </View>
      )}
      options={options}
      onChange={(i) => onChange(i)}
      onClearPress={() => onChange(undefined)}
      single
      modalTitle={t('Vouchers.categories')}
    />
  );
};

export default CardmolaCategoryPicker;
