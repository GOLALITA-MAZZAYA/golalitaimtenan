import {
  SET_TRANSACTIONS,
  SET_FAMILY_MEMBERS,
  SET_TRANSACTIONS_HISTORY,
  SET_TRANSACTIONS_HISTORY_ERROR,
  SET_TRANSACTIONS_HISTORY_FILTERS,
  SET_TRANSACTIONS_HISTORY_LOADING,
  SET_FAMILY_MEMBERS_LOADING,
} from "./transactions-types";

export const setFamilyMembers = (familyMembers) => ({
  type: SET_FAMILY_MEMBERS,
  familyMembers,
});

export const setFamilyMembersLoading = (loading) => ({
  type: SET_FAMILY_MEMBERS_LOADING,
  loading,
});

export const setTransactions = (transactions) => ({
  type: SET_TRANSACTIONS,
  transactions,
});

export const setTransactionsHistory = (transactions) => ({
  type: SET_TRANSACTIONS_HISTORY,
  transactions,
});

export const setTransactionsHistoryLoading = (loading) => ({
  type: SET_TRANSACTIONS_HISTORY_LOADING,
  loading,
});

export const setTransactionsHistoryError = (error) => ({
  type: SET_TRANSACTIONS_HISTORY_ERROR,
  error,
});

export const setTransactionsHistoryFilters = (filters) => ({
  type: SET_TRANSACTIONS_HISTORY_FILTERS,
  filters,
});
