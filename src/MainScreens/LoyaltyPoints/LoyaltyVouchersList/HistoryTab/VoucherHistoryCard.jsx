import { StyleSheet, View } from "react-native";
import { colors } from "../../../../components/colors";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../../../redux/types";
import { isRTL } from "../../../../../utils";
import { useTranslation } from "react-i18next";

const VoucherHistoryCard = ({ item, index }) => {
  const isAr = isRTL();
  const { t } = useTranslation();

  const name = isAr ? (item.name_arabic || item.arabic_name || item.name) : item.name;
  const code = item.code;
  const type = item.type;
  const purchaseDate = item.purchase_date || item.purchaseDate || item.date || item.create_date || item.created_at;
  const expiryDate = item.expiry_date;
  const state = item.state;

  return (
    <View
      style={[
        styles.card,
        {
          marginTop: index ? 16 : 0,
          backgroundColor: colors.loyaltyCardBackground,
          borderColor: colors.loyaltyMainBorder,
        },
      ]}
    >
      {/* Top Header Row: Name & State */}
      <View style={[styles.headerRow, { flexDirection: isAr ? "row-reverse" : "row" }]}>
        <TypographyText
          title={name || ""}
          textColor={colors.loyaltyTextMainTitle || "#FFFFFF"}
          font={BALOO_SEMIBOLD}
          size={16}
          style={styles.nameText}
          numberOfLines={1}
        />
        {!!state && (
          <View
            style={[
              styles.stateBadge,
              state.toLowerCase() === "active" ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <TypographyText
              title={state.toUpperCase()}
              textColor={state.toLowerCase() === "active" ? "#53C361" : "#B1B1B4"}
              font={BALOO_SEMIBOLD}
              size={11}
            />
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Details Container: Code, Type, Purchase Date, Expiry Date */}
      <View style={{ gap: 10 }}>
        {/* Row 1: Code & Type */}
        <View style={[styles.detailsRow, { flexDirection: isAr ? "row-reverse" : "row" }]}>
          <View style={[styles.detailCol, { alignItems: isAr ? "flex-end" : "flex-start" }]}>
            <TypographyText
              title={isAr ? "الكود" : "Code"}
              textColor={colors.loyaltyTextSecondary || "#B1B1B4"}
              font={BALOO_REGULAR}
              size={11}
            />
            <TypographyText
              title={code || "-"}
              textColor={colors.loyaltyTextPrimary || "#D7BC76"}
              font={BALOO_SEMIBOLD}
              size={13}
              style={styles.detailValue}
            />
          </View>

          <View style={[styles.detailCol, { alignItems: isAr ? "flex-start" : "flex-end" }]}>
            <TypographyText
              title={isAr ? "النوع" : "Type"}
              textColor={colors.loyaltyTextSecondary || "#B1B1B4"}
              font={BALOO_REGULAR}
              size={11}
            />
            <TypographyText
              title={type || "-"}
              textColor={colors.loyaltyTextMainTitle || "#FFFFFF"}
              font={BALOO_SEMIBOLD}
              size={13}
              style={styles.detailValue}
            />
          </View>
        </View>

        {/* Row 2: Purchase Date & Expiry Date */}
        <View style={[styles.detailsRow, { flexDirection: isAr ? "row-reverse" : "row" }]}>
          <View style={[styles.detailCol, { alignItems: isAr ? "flex-end" : "flex-start" }]}>
            <TypographyText
              title={isAr ? "تاريخ الشراء" : "Purchase Date"}
              textColor={colors.loyaltyTextSecondary || "#B1B1B4"}
              font={BALOO_REGULAR}
              size={11}
            />
            <TypographyText
              title={purchaseDate || "-"}
              textColor={colors.loyaltyTextMainTitle || "#FFFFFF"}
              font={BALOO_SEMIBOLD}
              size={13}
              style={styles.detailValue}
            />
          </View>

          <View style={[styles.detailCol, { alignItems: isAr ? "flex-start" : "flex-end" }]}>
            <TypographyText
              title={isAr ? "تاريخ الانتهاء" : "Expiry Date"}
              textColor={colors.loyaltyTextSecondary || "#B1B1B4"}
              font={BALOO_REGULAR}
              size={11}
            />
            <TypographyText
              title={expiryDate || "-"}
              textColor={colors.loyaltyTextMainTitle || "#FFFFFF"}
              font={BALOO_SEMIBOLD}
              size={13}
              style={styles.detailValue}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  headerRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    flex: 1,
    fontSize: 16,
  },
  stateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: "rgba(83, 195, 97, 0.15)",
  },
  inactiveBadge: {
    backgroundColor: "rgba(177, 177, 180, 0.15)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginVertical: 12,
  },
  detailsRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailCol: {
    flex: 1,
  },
  detailValue: {
    marginTop: 2,
  },
});

export default VoucherHistoryCard;
