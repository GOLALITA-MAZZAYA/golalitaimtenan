import { getToken } from '../utils/secureStorage';
import instance from '../redux/instance';
import { merchantApi } from '../redux/merchant/merchant-api';
import { org } from '../org/config';

export const getChildCategoriesById = async (parent_id, type) => {
  const token = await getToken();
  console.log("getChildCategoriesById params:", {
    token,
    parent_id,
    org_id: org.id,
    type,
  })
  const res = await instance.post('/child/category/v2', {
    params: {
      token,
      parent_id,
      org_id: org.id,
      type,
    },
  });

  console.log("getChildCategoriesById res:", res.data)
  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

const getSubCategoriesFunc = async (parentCategories, type, country) => {
  const token = await getToken();

  const getSubCategories = async id => {
    const res = await merchantApi.getParentCategoriesById({
      params: {
        token,
        parent_id: id,
        type,
        //country,
        org_id: org.id,
      },
    });

    return res.data.result;
  };

  const results = await Promise.all(
    parentCategories.filter(item => item.id).map(item => getSubCategories(item.id))
  );

  return results.flat();
};

export const getSubCategoriesByParentId = async parent_category_id => {
  const token = await getToken();

  console.log("getSubCategoriesByParentId params:", {
    params: {
      token,
      parent_category_id,
    },
  })
  const res = await instance.post('/sub/category/v2', {
    params: {
      token,
      parent_category_id,
    },
  });
  console.log("getSubCategoriesByParentId res:", res.data)
  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getAllCategories = async type => {
  const token = await getToken();

  const params = {
    token,
    fields:
      "['id','name','parent_id', 'x_name_arabic', 'x_image_url_2', 'image_url', 'x_image_url_3', 'x_image_url_4', 'x_gif_image', 'x_country_code', 'x_if_have_child_cat']",
    type,
    //country,
    org_id: org.id,
  };

  const res = await merchantApi.getParentCategories({
    params,
  });

  const parentCategories = Array.isArray(res.data?.result) ? res.data.result : [];

  const newCategories = await getSubCategoriesFunc(parentCategories, type);

  return [...parentCategories, ...newCategories];
};

// Offer filters for a category (go_filters_on_off module). A parent category
// returns filters per child under child_categories; a leaf category returns
// available_filters directly. Errors arrive with HTTP 200 inside result.
export const getCategoryAvailableFilters = async category_id => {
  const token = await getToken();

  const res = await merchantApi.getCategoryAvailableFilters({
    params: {
      token,
      category_id,
    },
  });

  const result = res.data?.result;

  if (!result || result.status !== 'success') {
    throw new Error(result?.error || 'Failed to load offer filters');
  }

  return result;
};

// The children whose filters apply: the selected sub-categories, or every
// child when none is selected.
const getScopedChildren = (result, childCategoryIds) => {
  const children = Array.isArray(result?.child_categories)
    ? result.child_categories
    : [];

  if (!childCategoryIds?.length) {
    return children;
  }

  const selected = childCategoryIds.map(String);
  return children.filter(child =>
    selected.includes(String(child.child_category_id)),
  );
};

// Whether offer filters should be offered at all for the current scope.
export const isOffersEnabled = (result, childCategoryIds) => {
  if (!result || result.show_offers === false) {
    return false;
  }

  if (!result.is_parent) {
    return true;
  }

  return getScopedChildren(result, childCategoryIds).some(
    child => child.show_offers !== false,
  );
};

// One de-duplicated, sequence-ordered list of filters for the current scope.
export const getScopedAvailableFilters = (result, childCategoryIds) => {
  if (!isOffersEnabled(result, childCategoryIds)) {
    return [];
  }

  const rows = result.is_parent
    ? getScopedChildren(result, childCategoryIds)
        .filter(child => child.show_offers !== false)
        .flatMap(child => child.available_filters || [])
    : result.available_filters || [];

  const byId = new Map();
  rows.forEach(row => {
    if (row?.id != null && !byId.has(row.id)) {
      byId.set(row.id, row);
    }
  });

  return [...byId.values()].sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
  );
};
