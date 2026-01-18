import instance from "../instance";

export const transactionsApi = {
  getTransactions: (body) => instance.post("/user/transaction/data", body),
  getTransactionsHistory: (body) =>
    instance.post("/user/sales/transaction/data", body),
  getFamilyMembers: (body) => instance.post("/res.partner/search", body),
  transferAmount: (body) => instance.post("/user/transfer/points", body),
  addFamilyMember: (body) => instance.post("/user/add/members/", body),
  deleteFamilyMember: (body) => instance.post("/user/delete/members", body),
  editFamilyMember: (body) => instance.post("/user/update/members", body),
};
