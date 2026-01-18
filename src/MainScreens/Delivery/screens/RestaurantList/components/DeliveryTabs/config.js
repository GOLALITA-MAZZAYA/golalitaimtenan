import {
  DeliveryIcon as _DeliveryIcon,
  TakeawayIcon as _TakeawayIcon,
} from "../../../../../../assets/delivery_assets";

export const CONSTANTS = {
  DELIVERY: "delivery",
  TAKEWAY: "take_away",
};

export const TABS = [
  {
    name: "Delivery",
    key: CONSTANTS.DELIVERY,
    icon: _DeliveryIcon,
  },
  {
    name: "Takeaway",
    key: CONSTANTS.TAKEWAY,
    icon: _TakeawayIcon,
  },
];
