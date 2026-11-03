export const convertCategoriesToOptions = (categories, language) => {
  return categories?.map((item) => ({
    label: language === "ar" ? item.x_name_arabic : item.name,
    value: item.id,
  }));
};

export const getAllCategories = (parentCategories) => {
  const allCategoires = [];

  parentCategories.forEach((item) => {
    allCategoires.push(item);

    if (item.children) {
      allCategoires.push(...item.children);
    }
  });

  return allCategoires;
};
