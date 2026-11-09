import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import { useTheme } from "../../../../components/ThemeProvider";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import { isRTL } from "../../../../../utils";
import {
  FILTER_GROUP_DISCOUNT,
  SORT_NEAREST,
  SORT_OPTIONS,
  getAvailableFilterLabel,
  groupAvailableFilters,
} from "../helpers";

const FILTER = "filter";
const SORT = "sort";

const OfferFilterBar = ({
  // Offer filters come from /category/available_filters. When showFilters is
  // false (nothing configured for the category) only Sort is shown.
  availableFilters = [],
  filterIds = [],
  filtersLoading = false,
  showFilters = true,
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
  const [draftFilterIds, setDraftFilterIds] = useState([]);
  const [draftSort, setDraftSort] = useState(null);

  const filterGroups = useMemo(
    () => groupAvailableFilters(availableFilters),
    [availableFilters]
  );

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

  const filtersCount = filterIds.length;
  const selectedSort = isNearest ? SORT_NEAREST : sortOrder;
  const selectedSortOption = SORT_OPTIONS.find(
    (option) => option.value === selectedSort
  );
  // No sort picked yet: the bar just reads "Sort".
  const sortButtonLabel = selectedSortOption
    ? `${t("Merchants.sortLabel")}: ${t(selectedSortOption.labelKey)}`
    : t("Merchants.sortLabel");

  const openFilters = () => {
    setDraftFilterIds(filterIds);
    setOpenSheet(FILTER);
  };

  const closeSheet = () => setOpenSheet(null);

  // Discount ranges are single-choice; offer types can be combined.
  const toggleDraftFilter = (filter) => {
    setDraftFilterIds((prev) => {
      if (prev.includes(filter.id)) {
        return prev.filter((id) => id !== filter.id);
      }

      if (filter.filter_group !== FILTER_GROUP_DISCOUNT) {
        return [...prev, filter.id];
      }

      const discountIds = availableFilters
        .filter((item) => item.filter_group === FILTER_GROUP_DISCOUNT)
        .map((item) => item.id);

      return [...prev.filter((id) => !discountIds.includes(id)), filter.id];
    });
  };

  const applyFilters = () => {
    onApplyFilters({ filterIds: draftFilterIds });
    closeSheet();
  };

  const clearFilters = () => {
    setDraftFilterIds([]);
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
        {showFilters &&
          renderBarButton(
            filtersCount
              ? `${t("Merchants.filterOffers")} (${filtersCount})`
              : t("Merchants.filterOffers"),
            filtersCount > 0,
            openFilters
          )}
        {renderBarButton(
          sortButtonLabel,
          !!selectedSortOption,
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
                  // Tapping the selected option again clears the sort.
                  () =>
                    setDraftSort((prev) =>
                      prev === option.value ? null : option.value
                    )
                )
              )}

              {renderApplyButton(applySort)}
            </>
          )}

          {openSheet === FILTER && (
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <TypographyText
                size={13}
                font={BALOO_2}
                title={t("Merchants.filterAnyHint")}
                textColor={mutedTextColor}
                style={textAlign}
              />

              {filtersLoading ? (
                <ActivityIndicator
                  size="small"
                  color={activeColor}
                  style={styles.loader}
                />
              ) : (
                filterGroups.map((group) => (
                  <View key={group.key}>
                    {renderSectionTitle(t(group.labelKey))}
                    <View style={[styles.chips, rowDirection]}>
                      {group.items.map((filter) =>
                        renderChip(
                          String(filter.id),
                          getAvailableFilterLabel(filter, isRtl),
                          draftFilterIds.includes(filter.id),
                          () => toggleDraftFilter(filter)
                        )
                      )}
                    </View>
                  </View>
                ))
              )}

              {renderApplyButton(applyFilters)}
            </ScrollView>
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
  loader: {
    marginVertical: 24,
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
