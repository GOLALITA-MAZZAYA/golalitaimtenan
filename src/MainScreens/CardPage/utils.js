export const transformDisplayedExpiryDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split("-").reverse().join(".");
};

export const transformExpiryDateForRequest = (dateStr) => {
  return dateStr?.split("-").reverse().join("/");
};
