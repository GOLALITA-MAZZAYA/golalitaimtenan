import { useTheme } from "../components/ThemeProvider";
//export const isDarkMode = () => useTheme().isDark ;

export const isDarkMode1 = true;

export const getBackGroundColor = () => {
  const isDarkMode = () => useTheme().isDark;
  return isDarkMode() ? "green" : "green";
};
export const getTitelColorStyle = () => (isDarkMode1 ? "#2F1539" : "#F3f3f3");
export const getGreyColor = () =>
  isDarkMode1
    ? "fontSize: 18,fontWeight: 600,color:white"
    : "fontSize: 18,fontWeight: 600,color: #000";

export const getActiveTextColor = () => (isDarkMode1 ? "white" : "black");

export const getUnActiveTextColor = () => "grey";

export const getDeliveryInformationColor = () =>
  isDarkMode1 ? "white" : "#312B3E";

export const getDeliveryInformationTextColor = () =>
  isDarkMode1 ? "white" : "#08003B";

export const getTakeawayInformationColor = () =>
  isDarkMode1 ? "white" : "#1CC0A0";

export const getUnActiveListIconColor = () =>
  isDarkMode1 ? "white" : "#999CAD";

export const getActiveListIconColor = () => (isDarkMode1 ? "white" : "#FFFFFF");

export const getCloseIconColor = () => (isDarkMode1 ? "white" : "#999CAD");
