import { useCallback, useEffect, useState } from 'react';
import { getAppMenuCategories } from '../api/appMenu';
import { isDrawerScreenVisible } from '../components/CustomDrawer/drawerConfig';

const useDrawerMenuVisibility = () => {
  const [menuCategories, setMenuCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const menu = await getAppMenuCategories();

        if (!isMounted) {
          return;
        }

        setMenuCategories(menu);
      } catch (error) {
        console.error('Failed to fetch drawer menu categories:', error);

        if (isMounted) {
          setMenuCategories(null);
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

  const isScreenVisible = useCallback(
    screenName => {
      if (menuCategories === null) {
        return true;
      }

      return isDrawerScreenVisible(screenName, menuCategories);
    },
    [menuCategories],
  );

  return {
    loading,
    menuCategories,
    isScreenVisible,
  };
};

export default useDrawerMenuVisibility;
