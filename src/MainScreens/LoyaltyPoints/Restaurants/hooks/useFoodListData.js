import { useQuery } from 'react-query';
import { getRestaurantMenu } from '../../../../api/restaurants';

const useFoodListData = (restaurant_id) => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['restaurantMenu', restaurant_id],
    queryFn: () => getRestaurantMenu(restaurant_id),
    enabled: !!restaurant_id, 
  });

  return {
    data,
    loading: isLoading,
    error: isError ? error : null,
  };
};

export default useFoodListData;