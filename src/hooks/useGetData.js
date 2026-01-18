import { useEffect, useState } from "react";
import instance from "../redux/instance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGetData = (apiUrl, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      let data = null;

      if (typeof apiUrl === "string") {
        const res = await instance.post(apiUrl, {
          params: {
            token,
            ...params,
          },
        });

        data = res?.data?.result;
      }

      if (typeof apiUrl === "function") {
        data = await apiUrl();
      }

      if (!data) {
        throw "err";
      }

      setData(data);
    } catch (err) {
      console.log(err, "err");
      setData([]);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return { data, loading, error };
};

export default useGetData;
