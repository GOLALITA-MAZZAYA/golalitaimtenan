import { useQuery } from "react-query";
import { getAllLocations } from "../../../api/global";

const useLocations = () => {
  const { isLoading, isError, data, error } = useQuery(["locations"], () =>
    getAllLocations()
  );

  return { isLoading, isError, data, error };
};

export default useLocations;
