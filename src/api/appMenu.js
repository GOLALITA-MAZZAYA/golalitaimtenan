import instance from '../redux/instance';
import { ORG_CODE } from '../constants';

export const getAppMenuCategories = async () => {
  const res = await instance.post('/public/app/menu_categories', {
    params: {
      app: ORG_CODE,
    },
  });
  console.log('getAppMenuCategories ress', res.data);
  if (!res.data?.result?.success) {
    throw new Error('Failed to fetch app menu categories');
  }

  return res.data.result.categories || [];
};
