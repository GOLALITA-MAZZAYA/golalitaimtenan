import {
  SET_FAMILY_MEMBERS,
  SET_FAMILY_MEMBERS_LOADING,
  SET_TRANSACTIONS,
  SET_TRANSACTIONS_HISTORY,
  SET_TRANSACTIONS_HISTORY_ERROR,
  SET_TRANSACTIONS_HISTORY_FILTERS,
  SET_TRANSACTIONS_HISTORY_LOADING,
} from "./transactions-types";

const initialState = {
  familyMembers: [],
  familyMembersLoading: false,
  transactions: [],
  transactionsHistory: [],
  transactionsLoading: false,
  transactionsError: false,
  historyFilters: {
    selectedCategory: null,
    search: "",
  },
};

export const transactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FAMILY_MEMBERS:
      return { ...state, familyMembers: action.familyMembers };
    case SET_FAMILY_MEMBERS_LOADING:
      return { ...state, familyMembersLoading: action.loading };
    case SET_TRANSACTIONS:
      return { ...state, transactions: action.transactions };
    case SET_TRANSACTIONS_HISTORY:
      return { ...state, transactionsHistory: action.transactions };
    case SET_TRANSACTIONS_HISTORY_LOADING:
      return {
        ...state,
        transactionsHistoryLoading: action.loading,
        transactionsHistoryError: false,
      };
    case SET_TRANSACTIONS_HISTORY_ERROR:
      return { ...state, transactionsHistoryError: action.error };
    case SET_TRANSACTIONS_HISTORY_FILTERS:
      return {
        ...state,
        historyFilters: { ...state.historyFilters, ...action.filters },
      };
    default:
      return state;
  }
};
