import {useTranslation} from "react-i18next";
import ModalSelect from "../../../../components/Form/ModalSelect";
import CategoriesBtn from "./CategoriesBtn";
import {getGiftCardCategories} from "../../../../api/giftCard";

const transformCategories = (items) => {
  return items.map((option) => ({
    value: option.category_id,
    label: option.name,
    label_arabic: option.x_arabic_name || option.name,
    image: option.x_flag_image,
  }));
};

const getCategories = async () => {
  const categories = await getGiftCardCategories();

  const uniquecountries = await categories.reduce((acc, current) => {

    if (!acc.find((item) => item.category_id === current.category_id)) {
      acc.push(current);
    }
    return acc;
  }, []);

  const options = transformCategories(uniquecountries);
  return options;
};


const CateogiresSelect = ({ onSubmit }) => {
    const {t} = useTranslation();

    return (
        <ModalSelect
           modalKeyName={'gift-cards-categories'}
           onSubmit={onSubmit}
           fetchData={getCategories}
           renderSelect={CategoriesBtn}
           modalText={{
             mainTitle: t('LoyaltyGiftCards.categories'),
             searchPlaceholder: t('LoyaltyGiftCards.categoriesSearchPlaceholder'),
             submitText:  t('LoyaltyGiftCards.applyFilters')
           }}
        />
    )
};

export default CateogiresSelect;