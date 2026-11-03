import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../../../components/Form/ModalSelect/Modal";
import ModalTitle from "../../../../../components/Form/ModalSelect/ModalTitle";
import ModalSearch from "../../../../../components/Form/ModalSelect/ModalSearch";
import SubmitBtn from "../../../../../components/Form/ModalSelect/SubmitBtn";
import FilterIconBtn from "../../../common/FilterIconBtn";
import CategoryGridItem from "../../../common/CategoryGridItem";
import { getVoucherCategoriesList } from "../../../../../api/vouchers";
import { org } from "../../../../../org/config";

const CATEGORIES_COLUMNS = 3;

const transformCategories = (items) => {
  return items.map((option) => {
    const rawIcon = option.imageUrl || option.image_url || option.icon || option.image;
    let imageUrl;
    if (rawIcon) {
      imageUrl = rawIcon.startsWith('http') || rawIcon.startsWith('data:')
        ? rawIcon
        : `data:image/png;base64,${rawIcon}`;
    }

    return {
      value: option.id,
      label: option.name,
      label_arabic: option.arabic_name || option.name,
      imageUrl,
    };
  });
};

const getCategories = async () => {
  const categories = await getVoucherCategoriesList(undefined, org.code);
  return transformCategories(categories || []);
};

const CategoriesSelect = ({ onSubmit, autoOpen }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = (categoryId) => {
    onSubmit(categoryId);
  };

  return (
    <Modal
      modalKeyName={'vouchers-categories'}
      renderTitle={(props) => <ModalTitle {...props} title={t('LoyaltyVouchers.categories')} />}
      renderHeader={(props) => (
        <ModalSearch {...props} placeholder={t('LoyaltyVouchers.categoriesSearchPlaceholder')} />
      )}
      renderItem={CategoryGridItem}
      renderSelect={FilterIconBtn}
      renderFooter={(props) => <SubmitBtn {...props} title={t('LoyaltyVouchers.applyFilters')} />}
      options={categories}
      onSubmit={handleSubmit}
      single
      numColumns={CATEGORIES_COLUMNS}
      autoOpen={autoOpen}
    />
  );
};

export default CategoriesSelect;
