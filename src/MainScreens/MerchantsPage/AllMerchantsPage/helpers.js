export const getHeaderBtnString = (isHotel) => {
  const btns = ["back"];

  if (!isHotel) {
    btns.push("filter");
  }

  return btns;
};

// Nearest has no sort_by value on the backend: it is requested by sending the
// user's coordinates instead.
export const SORT_NEAREST = "nearest";
export const SORT_ALPHABETICAL = "alphabetical";

// One of these is active at a time. "desc"/"asc" are the sort_order sent with
// sort_by: "discount"; null keeps the backend's default x_sequence order.
export const SORT_OPTIONS = [
  { value: null, labelKey: "Merchants.sortDefault" },
  { value: SORT_NEAREST, labelKey: "Merchants.sortNearest" },
  { value: SORT_ALPHABETICAL, labelKey: "Merchants.alphabetical" },
  { value: "desc", labelKey: "Merchants.sortDiscountHigh" },
  { value: "asc", labelKey: "Merchants.sortDiscountLow" },
];

// Only set keys are sent: the backend treats these params as optional and
// expects filter_id as a number for one value, an array for several.
//
// Sending user_lat/user_long is what asks the backend for nearest-first
// ordering (there is no sort_by value for it), so they are only included
// while Nearest is on.
export const getOfferFilters = ({
  filterIds = [],
  sortOrder,
  nearestLocation,
}) => {
  const normalizedIds = (Array.isArray(filterIds) ? filterIds : [])
    .map((id) => (id == null || id === "" ? null : Number(id) || id))
    .filter((id) => id != null && id !== "");

  return {
    ...(normalizedIds.length
      ? {
          filter_id:
            normalizedIds.length === 1 ? normalizedIds[0] : normalizedIds,
        }
      : {}),
    ...(sortOrder === "desc" || sortOrder === "asc"
      ? { sort_by: "discount", sort_order: sortOrder }
      : {}),
    ...(sortOrder === SORT_ALPHABETICAL
      ? { sort_by: "merchant_name" }
      : {}),
    ...(nearestLocation
      ? {
          user_lat: nearestLocation.latitude,
          user_long: nearestLocation.longitude,
        }
      : {}),
  };
};
