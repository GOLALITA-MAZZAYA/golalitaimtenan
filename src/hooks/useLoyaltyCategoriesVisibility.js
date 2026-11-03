import { useCallback, useEffect, useState } from 'react';
import { getLoyaltyCategories } from '../api/loyalty';
import { isLoyaltyCategoryVisible } from '../MainScreens/LoyaltyPoints/LoyaltyPointsRedeemCategories/config';

const useLoyaltyCategoriesVisibility = () => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const result = await getLoyaltyCategories();
        console.log(result, 'loyalty categories')
        if (!isMounted) {
          return;
        }

        setCategories(result);
      } catch (error) {
        console.error('Failed to fetch loyalty categories:', error);

        if (isMounted) {
          setCategories(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const isCategoryVisible = useCallback(
    categoryKey => {
      if (categories === null) {
        return true;
      }

      return isLoyaltyCategoryVisible(categoryKey, categories);
    },
    [categories],
  );

  return {
    loading,
    isCategoryVisible,
  };
};

export default useLoyaltyCategoriesVisibility;
