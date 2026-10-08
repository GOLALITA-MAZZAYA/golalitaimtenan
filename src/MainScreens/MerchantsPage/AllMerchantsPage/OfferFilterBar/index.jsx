import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import { useTheme } from "../../../../components/ThemeProvider";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import { isRTL } from "../../../../../utils";
import {
  DISCOUNT_RANGES,
  OFFER_TYPES,
  SORT_NEAREST,
  SORT_OPTIONS,
  getDiscountRangeLabel,
} from "../helpers";

const FILTER = "filter";
const SORT = "sort";

const OfferFilterBar = ({
  offerTypes,
  discountRange,
  sortOrder,
  isNearest,
  onApplyFilters,
  onApplySort,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isRtl = isRTL();

  const [openSheet, setOpenSheet] = useState(null);
  // Selections are drafted in the sheet and only sent on Apply, so tapping
  // several chips doesn't fire a merchant list request per tap.
  const [draftOfferTypes, setDraftOfferTypes] = useState([]);
  const [draftDiscountRange, setDraftDiscountRange] = useState(null);
  const [draftSort, setDraftSort] = useState(null);

  const activeColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const activeTextColor = isDark ? "#000000" : "#FFFFFF";
  const textColor = isDark ? colors.white : "#1C1C1E";
  const mutedTextColor = isDark ? "#A1A1AA" : "#71717A";
  const surfaceColor = isDark ? "#1C1C1E" : "#F4F4F5";
  const borderColor = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.05)";
  const rowDirection = { flexDirection: isRtl ? "row-reverse" : "row" };
  const textAlign = { textAlign: isRtl ? "right" : "left" };

  const filtersCount = offerTypes.length + (discountRange ? 1 : 0);
  const selectedSort = isNearest ? SORT_NEAREST : sortOrder;
  const sortLabel = t(
    SORT_OPTIONS.find((option) => option.value === selectedSort).labelKey
  );

  const openFilters = () => {
    setDraftOfferTypes(offerTypes);
    setDraftDiscountRange(discountRange);
    setOpenSheet(FILTER);
  };

  const closeSheet = () => setOpenSheet(null);

  const toggleDraftOfferType = (type) => {
    setDraftOfferTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const applyFilters = () => {
    onApplyFilters({
      offerTypes: draftOfferTypes,
      discountRange: draftDiscountRange,
    });
    closeSheet();
  };

  const clearFilters = () => {
    setDraftOfferTypes([]);
    setDraftDiscountRange(null);
  };

  const openSort = () => {
    setDraftSort(selectedSort);
    setOpenSheet(SORT);
  };

  const applySort = () => {
    const isDraftNearest = draftSort === SORT_NEAREST;

    onApplySort({
      sortOrder: isDraftNearest ? null : draftSort,
      isNearest: isDraftNearest,
    });
    closeSheet();
  };

  const renderBarButton = (label, isActive, onPress) => (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.barButton,
        rowDirection,
        {
          backgroundColor: surfaceColor,
          borderColor: isActive ? activeColor : borderColor,
        },
      ]}
    >
      <TypographyText
        size={13}
        font={BALOO_2}
        title={label}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        textColor={isActive ? activeColor : textColor}
        style={styles.barButtonText}
      />
      <View style={[styles.chevron, { borderColor: mutedTextColor }]} />
    </TouchableOpacity>
  );

  const renderChip = (key, label, isSelected, onPress) => (
    <TouchableOpacity
      key={key}
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? activeColor : surfaceColor,
          borderColor: isSelected ? colors.transparent : borderColor,
        },
      ]}
    >
      <TypographyText
        size={13}
        font={BALOO_2}
        title={label}
        textColor={isSelected ? activeTextColor : textColor}
        style={styles.chipText}
      />
    </TouchableOpacity>
  );

  const renderSectionTitle = (title) => (
    <TypographyText
      size={14}
      font={BALOO_2}
      title={title}
      textColor={mutedTextColor}
      style={[styles.sectionTitle, textAlign]}
    />
  );

  const renderSortRow = (key, label, isSelected, onPress) => (
    <TouchableOpacity
      key={key}
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.sortRow, rowDirection, { borderBottomColor: borderColor }]}
    >
      <TypographyText
        size={15}
        font={BALOO_2}
        title={label}
        textColor={isSelected ? activeColor : textColor}
        style={isSelected ? styles.chipText : undefined}
      />
      <View
        style={[
          styles.radio,
          { borderColor: isSelected ? activeColor : mutedTextColor },
        ]}
      >
        {isSelected && (
          <View
            style={[
              styles.radioDot,
              { backgroundColor: activeColor },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderApplyButton = (onPress) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.applyButton, { backgroundColor: activeColor }]}
    >
      <TypographyText
        size={15}
        font={BALOO_2}
        title={t("Merchants.apply")}
        textColor={activeTextColor}
        style={styles.chipText}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.bar, rowDirection]}>
        {renderBarButton(
          filtersCount
            ? `${t("Merchants.filterOffers")} (${filtersCount})`
            : t("Merchants.filterOffers"),
          filtersCount > 0,
          openFilters
        )}
        {renderBarButton(
          `${t("Merchants.sortLabel")}: ${sortLabel}`,
          selectedSort !== null,
          openSort
        )}
      </View>

      <Modal
        isVisible={!!openSheet}
        onBackdropPress={closeSheet}
        onBackButtonPress={closeSheet}
        style={styles.modal}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: isDark ? colors.darkModeBackground : colors.white,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <View style={[styles.sheetHeader, rowDirection]}>
            <TypographyText
              size={18}
              font={BALOO_2}
              title={
                openSheet === SORT
                  ? t("Merchants.sortLabel")
                  : t("Merchants.filterOffers")
              }
              textColor={textColor}
              style={styles.sheetTitle}
            />
            {openSheet === FILTER && (
              <TouchableOpacity onPress={clearFilters} hitSlop={10}>
                <TypographyText
                  size={14}
                  font={BALOO_2}
                  title={t("Merchants.reset")}
                  textColor={activeColor}
                  style={styles.chipText}
                />
              </TouchableOpacity>
            )}
          </View>

          {openSheet === SORT && (
            <>
              {SORT_OPTIONS.map((option) =>
                renderSortRow(
                  String(option.value),
                  t(option.labelKey),
                  draftSort === option.value,
                  () => setDraftSort(option.value)
                )
              )}

              {renderApplyButton(applySort)}
            </>
          )}

          {openSheet === FILTER && (
            <>
              <TypographyText
                size={13}
                font={BALOO_2}
                title={t("Merchants.filterAnyHint")}
                textColor={mutedTextColor}
                style={textAlign}
              />

              {renderSectionTitle(t("Merchants.discount"))}
              <View style={[styles.chips, rowDirection]}>
                {DISCOUNT_RANGES.map((range) =>
                  renderChip(
                    range.key,
                    getDiscountRangeLabel(range, t),
                    draftDiscountRange === range.key,
                    () =>
                      setDraftDiscountRange((prev) =>
                        prev === range.key ? null : range.key
                      )
                  )
                )}
              </View>

              {renderSectionTitle(t("Merchants.offerTypeLabel"))}
              <View style={[styles.chips, rowDirection]}>
                {OFFER_TYPES.map((type) =>
                  renderChip(
                    type.value,
                    t(type.labelKey),
                    draftOfferTypes.includes(type.value),
                    () => toggleDraftOfferType(type.value)
                  )
                )}
              </View>

              {renderApplyButton(applyFilters)}
            </>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bar: {
    marginBottom: 12,
    marginHorizontal: -5,
  },
  barButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  barButtonText: {
    flexShrink: 1,
    fontWeight: "700",
  },
  chevron: {
    width: 7,
    height: 7,
    marginHorizontal: 8,
    marginBottom: 3,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    transform: [{ rotate: "45deg" }],
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheet: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sheetTitle: {
    fontWeight: "700",
  },
  sectionTitle: {
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },
  chips: {
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  chip: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontWeight: "700",
  },
  sortRow: {
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  applyButton: {
    minHeight: 48,
    marginTop: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OfferFilterBar;
