import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";
import axios from "axios";

export const getAllCountries = async () => {
  const token = await getToken();

  const res = await instance.post("/res.country/search", {
    params: {
      token,
      fields: "['id','name', 'code', 'image_url', 'x_arabic_name' ]",
    },
  });

  if (!res.data?.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getAllLocations = async () => {
  const token = await getToken();

  const res = await instance.post("/user/get/locations", {
    params: {
      token,
    },
  });
  if (!res.data?.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getQatarLocationDetails = async (latitude, longitude) => {
  try {
    const delta = 0.01;

    const res = await axios.get(
      'https://services.gisqatar.org.qa/server/rest/services/Vector/QARS/MapServer/identify',
      {
        params: {
          f: 'json',
          geometry: `${longitude},${latitude}`,
          geometryType: 'esriGeometryPoint',
          sr: 4326,
          layers: 'all',
          tolerance: 3,
          mapExtent: `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`,
          imageDisplay: '400,400,96',
          returnGeometry: false,
        },
      }
    );

    const result = res?.data?.results?.[0]?.attributes || {};

    return {
      unit_number: result.UNIT_NO || '',
      building_number: result.BUILDING_NO || '',
      zone_number: result.ZONE_NO || '',
      street_number: result.STREET_NO || '',
      latitude,
      longitude,
    };
  } catch (e) {
    console.log('Location error:', e);

    return {
      unit_number: '',
      building_number: '',
      zone_number: '',
      street_number: '',
      latitude,
      longitude,
    };
  }
};

export const getLocation = async (zone, street, building) => {
    const res = await instance.post('/get/location',{params: {zone, street, building}});

    return res?.data?.result
}
