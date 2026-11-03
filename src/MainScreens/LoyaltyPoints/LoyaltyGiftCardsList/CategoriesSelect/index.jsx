import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../../components/Form/ModalSelect/Modal";
import ModalTitle from "../../../../components/Form/ModalSelect/ModalTitle";
import ModalSearch from "../../../../components/Form/ModalSelect/ModalSearch";
import SubmitBtn from "../../../../components/Form/ModalSelect/SubmitBtn";
import FilterIconBtn from "../../common/FilterIconBtn";
import CategoryGridItem from "../../common/CategoryGridItem";
import CountriesRow from "./CountriesRow";
import { getGiftCardCategories, getGiftCardCountries } from "../../../../api/giftCard";

const CATEGORIES_COLUMNS = 3;

const transformCategories = (items) => {
  return items.map((option) => {
    const rawIcon = option.icon || option.image;
    let imageUrl;
    if (rawIcon) {
      imageUrl = rawIcon.startsWith('http') || rawIcon.startsWith('data:')
        ? rawIcon
        : `data:image/png;base64,${rawIcon}`;
    }

    return {
      value: option.category_id,
      label: option.name,
      label_arabic: option.x_arabic_name || option.name,
      imageUrl,
      icon: option.x_flag_image,
    };
  });
};

const transformCountries = (countries) => {
  return countries?.map((item) => ({
    value: item.code,
    label: item.name,
    label_arabic: item.x_arabic_name || item.name,
    icon: item.x_flag_image,
  }));
};

const getCategories = async () => {
  const categories = await getGiftCardCategories();

  const uniqueCategories = categories.reduce((acc, current) => {
    if (!acc.find((item) => item.category_id === current.category_id)) {
      acc.push(current);
    }
    return acc;
  }, []);

  return transformCategories(uniqueCategories);
};

const CateogiresSelect = ({ onSubmit, autoOpen, defaultCountry, dismissable, onDismiss }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(defaultCountry);

  useEffect(() => {
    getCategories().then(setCategories);
    getGiftCardCountries().then((res) => setCountries(transformCountries(res)));
  }, []);

  useEffect(() => {
    setCountry(defaultCountry);
  }, [defaultCountry]);

  const handleSubmit = (categoryId, item, meta) => {
    if (meta?.cleared) {
      setCountry(undefined);
      onSubmit({ categoryId: undefined, country: undefined });
      return;
    }

    onSubmit({ categoryId, country });
  };

  return (
    <Modal
      modalKeyName={'gift-cards-categories'}
      renderTitle={(props) => <ModalTitle {...props} title={t('LoyaltyGiftCards.filtersTitle')} />}
      renderSubHeader={() => (
        <CountriesRow countries={countries} value={country} onChange={setCountry} />
      )}
      renderHeader={(props) => (
        <ModalSearch {...props} placeholder={t('LoyaltyGiftCards.categoriesSearchPlaceholder')} />
      )}
      renderItem={CategoryGridItem}
      renderSelect={FilterIconBtn}
      renderFooter={(props) => <SubmitBtn {...props} title={t('LoyaltyGiftCards.applyFilters')} />}
      options={categories}
      onSubmit={handleSubmit}
      single
      numColumns={CATEGORIES_COLUMNS}
      autoOpen={autoOpen}
      dismissable={dismissable}
      onDismiss={onDismiss}
    />
  );
};

export default CateogiresSelect;
