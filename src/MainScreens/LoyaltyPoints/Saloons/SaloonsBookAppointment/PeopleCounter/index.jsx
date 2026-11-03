import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TypographyText } from "../../../../../components/Typography";
import { BALOO_2 } from "../../../../../redux/types";
import { colors } from "../../../../../components/colors";
import {isRTL} from "../../../../../../utils";

const Counter = ({ label, value, onChange, min = 0 }) => {
  const isRtl = isRTL();

  return (
    <View style={[styles.row, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
      <TypographyText
        font={BALOO_2}
        size={15}
        textColor={colors.mainText}
        title={label}
        style={{ flex: 1 }}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(min, value - 1))}
          style={[styles.btn, {backgroundColor: colors.primary,}, value <= min && styles.disabled]}
          disabled={value <= min}
        >
          <TypographyText title="−" size={18} textColor={colors.white}/>
        </TouchableOpacity>

        <TypographyText title={`${value}`} style={styles.value} textColor={colors.mainText}/>

        <TouchableOpacity
          onPress={() => onChange(value + 1)}
          style={[styles.btn,{backgroundColor: colors.primary,}]}
        >
          <TypographyText title="+" size={18} textColor={colors.white}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PeopleCounter = ({ adults, children, setAdults, setChildren, t }) => {
  return (
    <View style={[styles.card,{backgroundColor: colors.cardBackground, borderColor: colors.primaryBorderLight}]}>
      <TypographyText
        font={BALOO_2}
        size={16}
        textColor={colors.mainText}
        title={t("Saloons.numberOfPeople")}
        weight="600"
      />

      <Counter
        label={t("Saloons.adults")}
        value={adults}
        min={1}
        onChange={setAdults}
      />

      <Counter
        label={t("Saloons.children")}
        value={children}
        min={0}
        onChange={setChildren}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
  },
  row: { alignItems: "center", paddingVertical: 10 },
  controls: { flexDirection: "row", alignItems: "center", },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: { opacity: 0.4 },
  value: { marginHorizontal: 10, width: 20, textAlign: 'center' },
});

export default PeopleCounter;