// draft - Order Created.
//order_accepted - Order Accepted by Restro
//order_preparation - Order Started Preparation.
// order_ready - Ready to Picked
// order_picked - Order picked
// order_cancel - Order Cancelled
// order_delivered - Order delivered
// p_darft - parent initiated.
// p_pending - Payment pendingp_cancel - payment cancel
//p_fail - payment failed

export const ORDER_STATUSES_CONFIG = {
  draft: {
    color: "orange",
    translation: "OrderHistoryList.draft",
  },
  order_accepted: {
    color: "green",
    is_current_order: true,
    translation: "OrderHistoryList.order_accepted",
  },
  order_preparation: {
    color: "grey",
    is_current_order: true,
    translation: "OrderHistoryList.orderPreparation",
  },
  order_ready: {
    color: "green",
    is_current_order: true,
    translation: "OrderHistoryList.order_ready",
  },
  order_picked: {
    color: "orange",
    is_current_order: true,
    translation: "OrderHistoryList.order_picked",
  },

  order_cancel: {
    color: "red",
    translation: "OrderHistoryList.order_cancel",
    can_reorder: true,
  },

  order_delivered: {
    color: "green",
    translation: "OrderHistoryList.order_delivered",
    can_reorder: true,
  },

  p_draft: {
    color: "grey",
    translation: "OrderHistoryList.draft",
  },

  p_pending: {
    color: "orange",
    translation: "OrderHistoryList.p_pending",
  },

  p_fail: {
    color: "red",
    translation: "OrderHistoryList.p_fail",
  },
};
