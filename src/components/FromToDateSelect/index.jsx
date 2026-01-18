import { TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";
import { useTranslation } from "react-i18next";
import { getTransformedDateFromTimestamp } from "./helpers";
import { colors } from "../colors";
import { TypographyText } from "../Typography";
import { BALOO_SEMIBOLD } from "../../redux/types";
import CalendarSvg from "../../assets/calendar.svg";

const fontSize = 15;

const FromToDateSelect = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  style,
}) => {
  const { isDark } = useTheme();
  const [isFromDateVisible, setIsFromDateVisible] = useState(false);
  const [isToDateVisible, setIsToDateVisible] = useState(false);

  const textColor = isDark ? colors.white : colors.darkBlue;

  const { t } = useTranslation();

  return (
    <>
      <View style={[styles.wrapper, style]}>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setIsFromDateVisible(true)}
        >
          <CalendarSvg color={textColor} />
          <TypographyText
            textColor={textColor}
            size={fontSize}
            font={BALOO_SEMIBOLD}
            title={`${t("General.from")}: `}
            style={styles.label}
          />
          <TypographyText
            textColor={textColor}
            size={fontSize}
            font={BALOO_SEMIBOLD}
            title={getTransformedDateFromTimestamp(fromDate) || "..."}
            style={styles.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setIsToDateVisible(true)}
        >
          <CalendarSvg color={textColor} />
          <TypographyText
            textColor={textColor}
            size={fontSize}
            font={BALOO_SEMIBOLD}
            title={`${t("General.to")}: `}
            style={styles.label}
          />
          <TypographyText
            textColor={textColor}
            size={fontSize}
            font={BALOO_SEMIBOLD}
            title={getTransformedDateFromTimestamp(toDate) || "..."}
            style={styles.text}
          />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isFromDateVisible}
        mode="date"
        onConfirm={(date) => {
          setFromDate(new Date(date).getTime());
          setIsFromDateVisible(false);
        }}
        onCancel={() => setIsFromDateVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isToDateVisible}
        mode="date"
        onConfirm={(date) => {
          setToDate(new Date(date).getTime());
          setIsToDateVisible(false);
        }}
        onCancel={() => setIsToDateVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateBtn: {
    flexDirection: "row",
    marginHorizontal: 10,
  },
  text: {
    marginLeft: 10,
  },
  label: {
    marginLeft: 5,
  },
});

export default FromToDateSelect;
