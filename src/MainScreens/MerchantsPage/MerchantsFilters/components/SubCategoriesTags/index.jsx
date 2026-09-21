import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FormikTags from '../../../../../components/Formik/FormikTags';
import { getMergedSubCategoriesForCategory } from '../../../../../api/categories';
import { convertCategoriesToOptions } from '../../utils';
import { getFlexDirection } from '../../../../../../utils';
import { colors } from '../../../../../components/colors';
import { useTheme } from '../../../../../components/ThemeProvider';

const SubCategoriesTags = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { isDark } = useTheme();
  const { values, setFieldValue } = useFormikContext();
  const categoriesType = useSelector(
    state => state.merchantReducer.categoriesType,
  );

  const categoryIds = Array.isArray(values.category_id)
    ? values.category_id
    : typeof values.category_id === 'number'
      ? [values.category_id]
      : [];
  const categoryIdsKey = categoryIds.join(',');

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Changing main category always resets subcategory selection.
    setFieldValue('sub_category_id', []);
    setSubCategories([]);

    if (!categoryIds.length) {
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    Promise.all(
      categoryIds.map(id =>
        getMergedSubCategoriesForCategory(id, categoriesType)
          .then(result => result.subCategories || [])
          .catch(() => []),
      ),
    )
      .then(results => {
        if (isCancelled) {
          return;
        }

        const fetched = Array.from(
          new Map(
            results
              .flat()
              .filter(item => item?.id)
              .map(item => [item.id, item]),
          ).values(),
        );
        setSubCategories(fetched);
      })
      .catch(() => {
        if (!isCancelled) {
          setSubCategories([]);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdsKey, categoriesType]);

  const options = useMemo(
    () => convertCategoriesToOptions(subCategories, language) || [],
    [subCategories, language],
  );

  if (!categoryIds.length) {
    return null;
  }

  if (loading) {
    return (
      <View style={{ marginTop: 16, alignItems: 'flex-start' }}>
        <ActivityIndicator
          color={isDark ? colors.mainDarkMode : colors.darkBlue}
        />
      </View>
    );
  }

  return (
    <FormikTags
      data={options}
      name="sub_category_id"
      addLabel={t('Merchants.addSubCategory')}
      allowEmpty
      wrapperStyle={{
        flex: 1,
        ...getFlexDirection(),
        marginTop: 10,
      }}
    />
  );
};

export default SubCategoriesTags;
