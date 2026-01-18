export const removeDuplicatesWithSameId = (data) => {
  return data.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.merchant_id === value.merchant_id)
  );
};
