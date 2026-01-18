import i18next from "i18next";

export const getConfig = () => [
  {
    label: "Location name",
    placeholder: "Enter location name",
    key: "location_name",
  },
  {
    label: i18next.t("LocationForm.zone"),
    placeholder: i18next.t("LocationForm.zonePlaceholder"),
    key: "zone",
  },
  {
    label: i18next.t("LocationForm.street"),
    placeholder: i18next.t("LocationForm.streetPlaceholder"),
    key: "street_number",
  },
  {
    label: i18next.t("LocationForm.building"),
    placeholder: i18next.t("LocationForm.buildingPlaceholder"),
    key: "building_number",
  },
  {
    label: "Apartment number",
    placeholder: "Enter apartment number",
    key: "apartment_number",
  },
  {
    label: "Floor",
    placeholder: "Enter floor",
    key: "floor",
  },
];
