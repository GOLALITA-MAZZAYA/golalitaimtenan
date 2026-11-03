import {
  SET_FAMILY_MEMBERS,
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
