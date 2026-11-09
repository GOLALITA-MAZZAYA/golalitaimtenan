// The header filter icon is hidden; filtering is done with the
// "Filter offers" / "Sort" bar under the header instead.
export const getHeaderBtnString = () => ['back'];

// Nearest has no sort_by value on the backend: it is requested by sending the
// user's coordinates instead.
export const SORT_NEAREST = "nearest";
export const SORT_ALPHABETICAL = "alphabetical";

// At most one of these is active at a time. "desc"/"asc" are the sort_order
// sent with sort_by: "discount". Nothing selected (null) keeps the backend's
// default x_sequence order.
export const SORT_OPTIONS = [
  { value: SORT_NEAREST, labelKey: "Merchants.sortNearest" },
  { value: SORT_ALPHABETICAL, labelKey: "Merchants.alphabetical" },
  { value: "desc", labelKey: "Merchants.sortDiscountHigh" },
];

export const FILTER_GROUP_DISCOUNT = "discount";
export const FILTER_GROUP_OFFER_TYPE = "offer_type";

// Sheet sections in display order, built from /category/available_filters.
const FILTER_GROUPS = [
  { key: FILTER_GROUP_DISCOUNT, labelKey: "Merchants.discount" },
  { key: FILTER_GROUP_OFFER_TYPE, labelKey: "Merchants.offerTypeLabel" },
];

export const groupAvailableFilters = (availableFilters = []) =>
  FILTER_GROUPS.map((group) => ({
    ...group,
    items: availableFilters.filter(
      (filter) => filter.filter_group === group.key
    ),
  })).filter((group) => group.items.length);

export const getAvailableFilterLabel = (filter, isRtl) =>
  (isRtl && filter.name_arabic) || filter.name || "";

export const getMerchantSortName = (merchant, isRtl) => {
  const name = isRtl
    ? merchant?.x_arabic_name || merchant?.merchant_name
    : merchant?.merchant_name || merchant?.x_arabic_name;

  return String(name || "").trim();
};

// Only set keys are sent: the backend treats these params as optional and
// expects offer_type as a string for one value, an array for several.
//
// Sending user_lat/user_long is what asks the backend for nearest-first
// ordering (there is no sort_by value for it), so they are only included
// while Nearest is on.
export const getOfferFilters = ({
  selectedFilters = [],
  sortOrder,
  nearestLocation,
}) => {
  const offerTypes = selectedFilters
    .filter((filter) => filter.filter_group === FILTER_GROUP_OFFER_TYPE)
    .map((filter) => filter.offer_type || filter.code)
    .filter(Boolean);

  // Only one discount range can be picked. Bounds are inclusive on the
  // backend; 0 and 100 are open ends, so they are left out of the payload.
  const discount = selectedFilters.find(
    (filter) => filter.filter_group === FILTER_GROUP_DISCOUNT
  );
  const minDiscount = Number(discount?.discount_min);
  const maxDiscount = Number(discount?.discount_max);

  return {
    ...(offerTypes.length
      ? { offer_type: offerTypes.length === 1 ? offerTypes[0] : offerTypes }
      : {}),
    ...(minDiscount > 0 ? { min_discount: minDiscount } : {}),
    ...(maxDiscount > 0 && maxDiscount < 100
      ? { max_discount: maxDiscount }
      : {}),
    ...(sortOrder === "desc" || sortOrder === "asc"
      ? { sort_by: "discount", sort_order: sortOrder }
      : {}),
    ...(sortOrder === SORT_ALPHABETICAL ? { sort_by: "merchant_name" } : {}),
    ...(nearestLocation
      ? {
          user_lat: nearestLocation.latitude,
          user_long: nearestLocation.longitude,
        }
      : {}),
  };
};
