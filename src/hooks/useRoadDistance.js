import { useQuery } from "react-query";
import { getRoadDistance } from "../api/user";

const useRoadDistance = (
  userLatitude,
  userLongitude,
  merchantLatitude,
  merchantLongitude
) => {
  const { data: distance, isLoading: distanceLoading } = useQuery({
    queryKey: [
      "road-distance",
      userLatitude,
      userLongitude,
      merchantLatitude,
      merchantLongitude,
    ],

    queryFn: () =>
      getRoadDistance(
        userLatitude,
        userLongitude,
        merchantLatitude,
        merchantLongitude
      ),

    enabled:
      !!userLatitude &&
      !!userLongitude &&
      !!merchantLatitude &&
      !!merchantLongitude,

    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  return {
    distance: distance || "",
    distanceLoading,
  };
};

export default useRoadDistance;