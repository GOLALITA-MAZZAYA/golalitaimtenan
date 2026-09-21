import instance from '../redux/instance';
import { merchantApi } from '../redux/merchant/merchant-api';
import { ORG_ID } from '../constants';
import { getAuthToken } from '../utils/tokenStorage';

const normalizeCategoryList = payload => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload?.error) {
    throw new Error(
      typeof payload.error === 'string'
        ? payload.error
        : payload.error?.message || 'Category request failed',
    );
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.categories)) {
    return payload.categories;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const getChildCategoriesById = async (parent_id, type, country) => {
  const token = await getAuthToken();

  const res = await instance.post('/child/category/v2', {
    params: {
      token,
      parent_id,
      org_id: ORG_ID,
      type,
      country,
    },
  });

  return normalizeCategoryList(res.data?.result ?? res.data);
};

export const getSubCategoriesByParentId = async parent_category_id => {
  const token = await getAuthToken();

  const res = await instance.post('/sub/category/v2', {
    params: {
      token,
      parent_category_id,
    },
  });

  return normalizeCategoryList(res.data?.result ?? res.data);
};

/** Own sub-cats + each child's sub-cats (used by filter SubCategoriesTags). */
export const getMergedSubCategoriesForCategory = async (
  categoryId,
  categoriesType,
) => {
  const [ownSubCategories, children] = await Promise.all([
    getSubCategoriesByParentId(categoryId).catch(() => []),
    getChildCategoriesById(categoryId, categoriesType).catch(() => []),
  ]);

  const childSubCategoryLists = await Promise.all(
    (children || [])
      .filter(child => child?.id)
      .map(child => getSubCategoriesByParentId(child.id).catch(() => [])),
  );

  const merged = [...ownSubCategories, ...childSubCategoryLists.flat()];

  return {
    subCategories: Array.from(
      new Map(
        merged.filter(item => item?.id).map(item => [item.id, item]),
      ).values(),
    ),
    children: Array.isArray(children) ? children : [],
  };
};

export const getAllCategories = async type => {
  const token = await getAuthToken();

  const params = {
    token,
    fields:
      "['id','name','parent_id', 'x_name_arabic', 'x_image_url_2', 'image_url', 'x_image_url_3', 'x_image_url_4', 'x_gif_image']",
    type,
    org_id: ORG_ID,
  };

  const res = await merchantApi.getParentCategories({
    params,
  });

  return normalizeCategoryList(res.data?.result ?? res.data);
};
