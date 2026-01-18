export const getTransformedDateFromTimestamp = (timestamp) => {
  if (!timestamp) {
    return;
  }

  const date = new Date(timestamp);
  const day = date.getDate();
  const transformedDay = day < 10 ? `0${day}` : day;
  const month = date.getMonth() + 1;
  const transformedMonth = month < 10 ? `0${month}` : month;

  const year = date.getFullYear();

  return `${transformedDay}-${transformedMonth}-${year}`;
};
