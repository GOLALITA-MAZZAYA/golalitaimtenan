import {useTranslation} from "react-i18next";
import {getGiftCardCountries} from "../../../../api/giftCard";
import ModalSelect from "../../../../components/Form/ModalSelect";
import CountriesBtn from "./CountriesBtn";

const getCountries = async () => {
  const countries = await getGiftCardCountries();
  const options = transformContries(countries);
  return options;
};

const transformContries = (countries) => {
  return countries?.map((item) => ({
    value: item.code,
    label: item.name,
    label_arabic: item.x_arabic_name,
    icon: item.x_flag_image,
  }));
};


const CountriesSelect = ({onSubmit, style}) => {
    const {t} = useTranslation();

    return (
        <ModalSelect
           style={style}
           modalKeyName={'gift-cards-countries'}
           onSubmit={onSubmit}
           fetchData={getCountries}
           renderSelect={CountriesBtn}
           modalText={{
             mainTitle: t('LoyaltyGiftCards.countries'),
             searchPlaceholder: t('LoyaltyGiftCards.countriesSearchPlaceholder'),
             submitText:  t('LoyaltyGiftCards.applyFilters')
           }}
        />
    )
};

export default CountriesSelect;