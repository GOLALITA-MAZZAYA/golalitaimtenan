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
      "['id','name','parent_id', 'x_name_arabic', 'x_image_url_2', 'image_url', 'x_image_url_3', 'x_image_url_4', 'x_gif_image', 'x_country_code', 'x_if_have_child_cat']",
    type,
    org_id: ORG_ID,
  };

  const res = await merchantApi.getParentCategories({
    params,
  });

  return normalizeCategoryList(res.data?.result ?? res.data);
};

/**
 * Offer filters configured for a partner category (parent or child).
 * Parent responses nest filters under child_categories; child responses
 * expose available_filters on the root result.
 */
export const getCategoryAvailableFilters = async category_id => {
  if (category_id == null || category_id === '') {
    return null;
  }

  const token = await getAuthToken();
  const res = await merchantApi.getCategoryAvailableFilters({
    params: {
      token,
      category_id,
    },
  });

  console.log(res.data.result,'available filters')

  const result = res.data?.result ?? res.data;

  if (!result || result.status === 'error' || result.error) {
    throw new Error(
      typeof result?.error === 'string'
        ? result.error
        : result?.error?.message || 'Failed to load offer filters',
    );
  }

  return result;
};

const collectFilterRows = (filters = []) =>
  (Array.isArray(filters) ? filters : []).filter(item => item?.id != null);

/**
 * Flatten + de-dupe filters for the filter sheet.
 * When childCategoryIds is set, only those children's filters are included
 * (falls back to all children if none of the ids match).
 */
export const flattenAvailableFilters = (
  result,
  { childCategoryIds } = {},
) => {
  if (!result) {
    return [];
  }

  let rows = [];

  if (result.is_parent && Array.isArray(result.child_categories)) {
    const children = result.child_categories;
    const selected = Array.isArray(childCategoryIds)
      ? childCategoryIds.map(id => String(id))
      : [];
    const matched = selected.length
      ? children.filter(child =>
          selected.includes(String(child.child_category_id)),
        )
      : [];
    const source = matched.length ? matched : children;

    for (const child of source) {
      rows.push(...collectFilterRows(child.available_filters));
    }
  } else {
    rows = collectFilterRows(result.available_filters);
  }

  const byId = new Map();
  for (const row of rows) {
    if (!byId.has(row.id)) {
      byId.set(row.id, row);
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
  );
};

export const getAvailableFilterLabel = (filter, useArabic) => {
  if (!filter) {
    return '';
  }

  if (useArabic) {
    const arabic =
      typeof filter.name_arabic === 'string' ? filter.name_arabic.trim() : '';
    if (arabic) {
      return arabic;
    }
  }

  return typeof filter.name === 'string' ? filter.name : '';
};
