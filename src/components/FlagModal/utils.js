export const getPhoneInputSelection = (isRTL, inputValueLength) => {
  if (isRTL && inputValueLength) {
    return {
      start: inputValueLength,
      end: inputValueLength,
    };
  }

  return;
};
