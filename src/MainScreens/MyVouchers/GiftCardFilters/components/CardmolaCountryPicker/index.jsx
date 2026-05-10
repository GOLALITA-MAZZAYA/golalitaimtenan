import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { BALOO_MEDIUM } from '../../../../../redux/types';
import { setCardmoolaGiftCardsCountry } from '../../../../../redux/giftCards/giftcards-actions';
import { TypographyText } from '../../../../../components/Typography';
import { useTheme } from '../../../../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../../../components/colors';
import BottomSheetComponent from '../../../../../components/Form/BottomSheetComponent';
import { getCardmolaCountries } from '../../../../../api/giftCard';
import { isRTL } from '../../../../../../utils';
import { useSelector, useDispatch } from 'react-redux';

const CardmolaCountryPicker = (props) => {
  const { onChange, loading } = props;
  const [countries, setCountries] = useState([]);
  const { cardmolaToken } = useSelector((state) => state.giftcardsReducer);
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  useEffect(() => {
    if (cardmolaToken) {
      getCardmolaCountries()
        .then((res) => setCountries(res))
        .catch((err) => console.log(err, 'erere'));
    }
  }, [cardmolaToken]);

  const transformCounntries = (items) => {
    return items?.map((option) => {
      const arabicName = option.translations.find((item) =>
        item.cultureCode.startsWith('ar'),
      )?.name;

      return {
        value: option.shortName,
        label: language === 'ar' ? arabicName : option.name,
        emoji: option.emoji,
      };
    });
  };

  const options = useMemo(
    () => transformCounntries(countries),
    [countries?.length],
  );

  return (
    <BottomSheetComponent
      shouldCloseModal={loading}
      loading={loading}
      name="cardmole-giftcard-countries"
      renderSelect={() => (
        <View
          style={{
            flexDirection: isRTL() ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
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
              title={t('Vouchers.countries')}
              numberOfLines={1}
            />
          </View>
        </View>
      )}
      options={options}
      onChange={(shortName) => {
        const countryFullData = countries.find(
          (item) => item.shortName === shortName,
        );
        const transformedShortName = `${countryFullData?.languages[0].toLowerCase()}-${shortName}`;
        dispatch(setCardmoolaGiftCardsCountry(transformedShortName));
        onChange(transformedShortName, countryFullData);
      }}
      onClearPress={() => {
        dispatch(setCardmoolaGiftCardsCountry(null));
        onChange(undefined);
      }}
      single
      modalTitle={t('Vouchers.countries')}
    />
  );
};

export default CardmolaCountryPicker;
