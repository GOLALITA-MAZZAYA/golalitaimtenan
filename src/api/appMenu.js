import instance from '../redux/instance';
import { org } from '../org/config';

export const getAppMenuCategories = async () => {
  const res = await instance.post('/public/app/menu_categories', {
    params: {
      app: org.code,
    },
  });
  console.log('getAppMenuCategories ress', res.data);
  if (!res.data?.result?.success) {
    throw new Error('Failed to fetch app menu categories');
  }

  return res.data.result.categories || [];
};
