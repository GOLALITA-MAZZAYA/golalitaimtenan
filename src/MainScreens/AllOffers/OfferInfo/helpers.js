import { isRTL } from "../../../../utils";

export const transformDate = (dateStr) => {
  if (!dateStr) {
    return "";
  }

  const date = dateStr.split(" ")[0];

  if (isRTL()) {
    return date.split("-").reverse().join("-");
  }

  return date;
};
