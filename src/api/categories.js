import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../redux/instance';
import { merchantApi } from '../redux/merchant/merchant-api';

export const getChildCategoriesById = async (parent_id, type) => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/child/category/v2', {
    params: {
      token,
      parent_id,
      org_id: 1651,
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

  const token = await AsyncStorage.getItem('token');

  const getSubCategories = async id => {
    return new Promise(async resolve => {
      const res = await merchantApi.getParentCategoriesById({
        params: {
          token,
          parent_id: id,
          type,
          //country,
          org_id: 1651,
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
  const token = await AsyncStorage.getItem('token');

  const params = {
    token,
    fields:
      "['id','name','parent_id', 'x_name_arabic', 'x_image_url_2', 'image_url', 'x_image_url_3', 'x_image_url_4', 'x_gif_image']",
    type,
    //country,
    org_id: 1651,
  };

  const res = await merchantApi.getParentCategories({
    params,
  });

  const parentCategories = res.data.result;

  const newCategories = await getSubCategoriesFunc(parentCategories, type);

  return [...parentCategories, ...newCategories] || [];
};
