import i18next from "i18next";
import store from "../../redux/store";
import { getLocalizedValue } from "../../../utils";

export const getCategoryNameByIdAndLang = (categoryId) => {
  const categories = store.getState().merchantReducer.parentCategories;

  if (!categories) {
    return "";
  }

  let category = "";

  for (let i = 0; i < categories.length; i++) {
    const parentCategory = categories[i];

    if (parentCategory.id === categoryId) {
      category = parentCategory;
      break;
    }

    if (parentCategory.children) {
      const categoryData = parentCategory.children.find(
        (category) => category.id === categoryId
      );

      if (categoryData) {
        category = categoryData;
        break;
      }
    }
  }

  if (!category) {
    return "";
  }

  return getLocalizedValue(category.x_name_arabic, category.name);
};
