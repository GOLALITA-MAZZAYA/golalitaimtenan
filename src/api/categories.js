import instance from '../redux/instance';
import { merchantApi } from '../redux/merchant/merchant-api';
import { ORG_ID } from '../constants';
import { getAuthToken } from '../utils/tokenStorage';

export const getChildCategoriesById = async (parent_id, type) => {
  const token = await getAuthToken();

  const res = await instance.post('/child/category/v2', {
    params: {
      token,
      parent_id,
      org_id: ORG_ID,
      type,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

const getSubCategoriesFunc = async (parentCategories, type, country) => {
  const newCategories = [];

  const token = await getAuthToken();

  const getSubCategories = async id => {
    return new Promise(async resolve => {
      const res = await merchantApi.getParentCategoriesById({
        params: {
          token,
          parent_id: id,
          type,
          //country,
          org_id: ORG_ID,
        },
      });

      resolve(res.data.result);
    });
  };

  let i = 0;

  for (let item of parentCategories) {
    if (item.id) {
      const subCategories = await getSubCategories(item.id);

      newCategories.push(...subCategories);
    }

    i++;
  }

  return newCategories;
};

export const getAllCategories = async type => {
  const token = await getAuthToken();

  const params = {
    token,
    fields:
      "['id','name','parent_id', 'x_name_arabic', 'x_image_url_2', 'image_url', 'x_image_url_3', 'x_image_url_4', 'x_gif_image']",
    type,
    //country,
    org_id: ORG_ID,
  };

  const res = await merchantApi.getParentCategories({
    params,
  });

  const parentCategories = res.data.result;
  return parentCategories || [];
  //  const newCategories = await getSubCategoriesFunc(parentCategories, type);

  //return [...parentCategories, ...newCategories] || [];
};
