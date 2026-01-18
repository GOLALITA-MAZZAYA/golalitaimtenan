export const findCategoryById = (categories, categoryId) => {
  return categories.find((item) => item.merchant_category_id === categoryId);
};
