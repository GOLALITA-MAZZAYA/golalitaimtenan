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

export const OFFER_TYPES = [
  { value: "special", labelKey: "Merchants.offerTypeSpecial" },
  { value: "bogo", labelKey: "Merchants.offerTypeBogo" },
  { value: "points", labelKey: "Merchants.offerTypePoints" },
  { value: "vip", labelKey: "Merchants.offerTypeVip" },
];

// Both bounds are inclusive on the backend and compared against the
// merchant's maximum discount; an open end is left out of the payload.
export const DISCOUNT_RANGES = [
  { key: "0-10", max: 10 },
  { key: "10-20", min: 10, max: 20 },
  { key: "20-40", min: 20, max: 40 },
  { key: "40+", min: 40 },
];

export const getDiscountRangeLabel = (range, t) => {
  if (range.min == null) {
    return t("Merchants.discountUpTo", { value: range.max });
  }

  if (range.max == null) {
    return `${range.min}%+`;
  }

  return `${range.min}-${range.max}%`;
};

// Only set keys are sent: the backend treats these params as optional and
// expects offer_type as a string for one value, an array for several.
//
// Sending user_lat/user_long is what asks the backend for nearest-first
// ordering (there is no sort_by value for it), so they are only included
// while Nearest is on.
export const getOfferFilters = ({
  offerTypes,
  discountRange,
  sortOrder,
  nearestLocation,
}) => {
  const range = DISCOUNT_RANGES.find((item) => item.key === discountRange);

  return {
    ...(offerTypes.length
      ? { offer_type: offerTypes.length === 1 ? offerTypes[0] : offerTypes }
      : {}),
    ...(range?.min != null ? { min_discount: range.min } : {}),
    ...(range?.max != null ? { max_discount: range.max } : {}),
    ...(sortOrder === "desc" || sortOrder === "asc"
      ? { sort_by: "discount", sort_order: sortOrder }
      : {}),
    ...(sortOrder === SORT_ALPHABETICAL ? { sort_by: "alphabetical" } : {}),
    ...(nearestLocation
      ? {
          user_lat: nearestLocation.latitude,
          user_long: nearestLocation.longitude,
        }
      : {}),
  };
};
