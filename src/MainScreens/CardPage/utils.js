export const transformDisplayedExpiryDate = (dateStr) => {
  return dateStr.split("-").reverse().join(".");
};

export const transformExpiryDateForRequest = (dateStr) => {
  return dateStr?.split("-").reverse().join("/");
};
