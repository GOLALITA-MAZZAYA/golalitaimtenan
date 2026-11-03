import React from "react";
import { View, StyleSheet } from "react-native";
import CalendarSvg from "../../../../../assets/clinics/calendar.svg";
import CustomCalendar from "../../../../../components/CustomDateCalendar";
import { TypographyText } from "../../../../../components/Typography";
import { colors } from "../../../../../components/colors";
import { isRTL } from "../../../../../../utils";

const DateSelector = ({ setDate, t }) => {
  const isRtl = isRTL();

  return (
    <View style={styles.section}>
      <View style={[styles.title, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
        <CalendarSvg color={colors.primary} width={18} height={18} />
        <TypographyText
          title={t("Saloons.selectDate")}
          size={14}
          style={{ marginHorizontal: 5 }}
        />
      </View>

      <CustomCalendar isModal={false} onChange={setDate} modes={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 20 },
  title: { alignItems: "center", },
});

export default DateSelector;