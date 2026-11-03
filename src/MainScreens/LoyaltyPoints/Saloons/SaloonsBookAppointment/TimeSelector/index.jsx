import React from "react";
import { View, StyleSheet } from "react-native";
import TimeSvg from "../../../../../assets/clinics/clock.svg";
import { TypographyText } from "../../../../../components/Typography";
import { colors } from "../../../../../components/colors";
import HorizontalTimes from "../../../../../components/Form/HorizontalTimes";
import { isRTL } from "../../../../../../utils";

const TimeSelector = ({
  availability,
  selectedTime,
  setSelectedTime,
  loading,
  t,
}) => {
  const isRtl = isRTL();

  return (
    <View style={styles.section}>
      <View style={[styles.title, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
        <TimeSvg color={colors.primary} width={18} height={18} />
        <TypographyText title={t("Saloons.selectTime")} size={14} style={{marginHorizontal: 6}} textColor={colors.loyaltyTextSecondary}/>
      </View>

      <HorizontalTimes
        times={availability}
        setTime={setSelectedTime}
        selectedTime={selectedTime}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 20 },
  title: { alignItems: "center", marginBottom: 16 },
});

export default TimeSelector;