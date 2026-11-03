import React from "react";
import { View, StyleSheet } from "react-native";
import { TypographyText } from "../../../../../components/Typography";
import { BALOO_2 } from "../../../../../redux/types";
import { colors } from "../../../../../components/colors";
import {isRTL} from "../../../../../../utils";


const ServicesSummary = ({ services = [], t }) => {
  const isRtl = isRTL();

  if (!services.length) return null;

  return (
    <View style={[styles.card,{ backgroundColor: colors.cardBackground, borderColor: colors.primaryBorderLight,}]}>
      <TypographyText
        font={BALOO_2}
        size={16}
        textColor={colors.mainText}
        title={t("Saloons.servicesLabel")}
        weight="600"
      />

      {services.map((svc, index) => (
        <View
          key={svc.id || index}
          style={[
            styles.row,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <TypographyText
            font={BALOO_2}
            size={14}
            textColor={colors.mainText}
            title={isRtl ? svc.name_ar || svc.name : svc.name}
            style={{ flex: 1 }}
          />

          <TypographyText
            font={BALOO_2}
            size={14}
            textColor={colors.primary}
            title={`${svc.price || ""} QAR`}
          />
        </View>
      ))}
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
  row: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.mainBorder,
  },
});

export default ServicesSummary;