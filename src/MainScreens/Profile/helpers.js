export const getUpdatedValues = (user, values) => {
  const keys = Object.keys(values);

  const updatedValues = {};

  keys.forEach((name) => {
    if (user[name] !== values[name]) {
      updatedValues[name] = values[name];
    }
  });

  return updatedValues;
};
