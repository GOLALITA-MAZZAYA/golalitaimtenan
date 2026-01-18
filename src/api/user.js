import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../redux/instance';

export async function getRoadDistance(lat, long, lat2, long2) {
  const token = await AsyncStorage.getItem('token');

  const body = {
    params: {
      token,
      user_location: {
        lat,
        long,
      },
      merchants: [
        {
          id: Date.now(),
          lat: lat2,
          long: long2,
        },
      ],
    },
  };

  const res = await instance.post('/user/distance/calculate', body);

  if (!res.data?.result) {
    throw new Error();
  }

  return res.data.result?.distances?.[0]?.distance_text;
}
