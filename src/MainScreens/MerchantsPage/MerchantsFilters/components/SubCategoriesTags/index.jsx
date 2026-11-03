import React, { useEffect, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FormikTags from "../../../../../components/Formik/FormikTags";
import {
  getChildCategoriesById,
  getSubCategoriesByParentId,
} from "../../../../../api/categories";
import { convertCategoriesToOptions } from "../../utils";
import { getFlexDirection } from "../../../../../../utils";

const fetchSubCategoriesForCategory = async (id, categoriesType) => {
  const [ownSubCategories, children] = await Promise.all([
    getSubCategoriesByParentId(id).catch(() => []),
    getChildCategoriesById(id, categoriesType).catch(() => []),
  ]);

  // This picker (../../utils's getAllCategories) only ever offers
  // parent-level categories — /parent/category/v2 never returns a
  // `children` field, so its "if (item.children)" branch never fires.
  // Sub-categories can live on the selected category itself or on any of
  // its children, so look up both and merge.
  const childSubCategoryLists = await Promise.all(
    (children || [])
      .filter((child) => child.id)
      .map((child) => getSubCategoriesByParentId(child.id).catch(() => []))
  );

  return [...ownSubCategories, ...childSubCategoryLists.flat()];
};

const SubCategoriesTags = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { values, setFieldValue } = useFormikContext();
  const categoriesType = useSelector(
    (state) => state.merchantReducer.categoriesType
  );

  const categoryIds = Array.isArray(values.category_id)
    ? values.category_id
    : [];
  const categoryIdsKey = categoryIds.join(",");

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (!categoryIds.length) {
      setSubCategories([]);
      setFieldValue("sub_category_id", []);
      return;
    }

    let isCancelled = false;

    Promise.all(
      categoryIds.map((id) => fetchSubCategoriesForCategory(id, categoriesType))
    ).then((results) => {
      if (isCancelled) return;

      const fetched = Array.from(
        new Map(results.flat().map((item) => [item.id, item])).values()
      );
      setSubCategories(fetched);

      // Prune against the freshly fetched list, not the (still empty)
      // `options` memo — pruning off that instead would wipe a sub-category
      // selection carried in from a previously applied filter on every
      // mount, before this fetch has even had a chance to resolve.
      const validIds = new Set(fetched.map((item) => item.id));
      const selected = Array.isArray(values.sub_category_id)
        ? values.sub_category_id
        : [];
      const filtered = selected.filter((id) => validIds.has(id));

      if (filtered.length !== selected.length) {
        setFieldValue("sub_category_id", filtered);
      }
    });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdsKey, categoriesType]);

  const options = useMemo(
    () => convertCategoriesToOptions(subCategories, language),
    [subCategories, language]
  );

  if (!options.length) return null;

  return (
    <FormikTags
      data={options}
      name="sub_category_id"
      addLabel={t("Merchants.addSubCategory")}
      wrapperStyle={{
        flex: 1,
        ...getFlexDirection(),
        marginTop: 10,
      }}
    />
  );
};

export default SubCategoriesTags;
