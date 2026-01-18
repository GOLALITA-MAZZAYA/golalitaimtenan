import * as Yup from "yup";
import i18next from "i18next";

export const getLocationSchema = () =>
  Yup.object({
    location_name: Yup.string().required(i18next.t("LocationForm.required")),
    zone: Yup.string().required(i18next.t("LocationForm.required")),
    street_number: Yup.string().required(i18next.t("LocationForm.required")),
    building_number: Yup.string().required(i18next.t("LocationForm.required")),
    apartment_number: Yup.string().required(i18next.t("LocationForm.required")),
    floor: Yup.string().required(i18next.t("LocationForm.required")),
  });
