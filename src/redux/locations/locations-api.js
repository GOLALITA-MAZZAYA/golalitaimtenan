import instance from "../instance";

export const locationsApi = {
  getLocations: ({ token, customer_id }) =>
    instance.post("/user/location/list", {
      params: {
        token,
        customer_id,
      },
    }),
  createLocation: (body) =>
    instance.post("/user/location/create", {
      params: {
        token: body.token,
        customer_id: body.customer_id,
        location_name: body.location_name,
        location_landmark: "",
        zone: body.zone,
        building_number: body.building_number,
        street_number: body.street_number,
        apartment_number: body.apartment_number,
        floor: body.floor,
        lat: body.lat,
        long: body.long,
      },
    }),
};
