import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Checkbox from "../../../../../components/Form/Checkbox";
import CloseSvg from "../../../../../assets/close.svg";
import ArrowDownSvg from "../../../../../assets/arrow_down_thin.svg";
import SearchSvg from "../../../../../assets/search.svg";
import { sized } from "../../../../../Svg";
import { TypographyText } from "../../../../../components/Typography";
import { BALOO_REGULAR, BALOO_MEDIUM } from "../../../../../redux/types";
import { useTheme } from "../../../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { getTextAlign, isRTL } from "../../../../../../utils";
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { colors } from "../../../../../components/colors";
import Portal from "../../../../../components/Portal";

const BottomSheetComponent = (props) => {
  const {
    options,
    label,
    placeholderTextStyle,
    placeholder,
    onChange,
    loading,
    disabled,
    mainStyle,
    allowClear,
    onClearPress,
    renderItem,
    renderSelect,
    value: propsValue,
    single,
    name,
    modalTitle,
  } = props;
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState([]);
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");

  const isArabic = i18n.language === "ar";
  const { isDark } = useTheme();
  const CloseIcon = sized(CloseSvg, 14, 14, isDark ? "#fff" : "#312B3E");
  const ArrowIcon = sized(ArrowDownSvg, 24, 24, isDark ? "#fff" : "#312B3E");

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["1%", "90%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentModalclose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (!index) {
      handlePresentModalclose();
      setVisible(false);
    }
  }, []);

  const handleSearchChange = (text) => {
    setSearch(text);
  };

  const updatedOptions = useMemo(() => {
    return options?.filter((item) => {
      // Check if 'label' includes the search term
      const nameMatches = item?.label
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.toLowerCase());

      // Safely handle 'short_names' even if it's an empty array
      const shortNameMatches =
        Array.isArray(item?.short_names) &&
        item?.short_names?.some((shortName) =>
          shortName?.name
            ?.toString()
            ?.toLowerCase()
            ?.includes(search.toLowerCase())
        );

      return nameMatches || shortNameMatches;
    });
  }, [options, search]);
  useEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  const onOk = () => {
    handlePresentModalclose();
    setVisible(false);

    onChange(value);
  };

  const handleClosePress = () => {
    setValue(single ? undefined : []);
    if (onClearPress) {
      onClearPress();
    }
  };

  const renderValue = () => {
    if (value && Array.isArray(value) && value.length > 0) {
      return (
        <TypographyText
          textColor={isDark ? "#fff" : colors.mainDarkModeText}
          size={15}
          font={BALOO_REGULAR}
          title={options
            .filter((option) => {
              return value.includes(option.value);
            })
            .map((option) => {
              return option.label;
            })
            .join(", ")}
          numberOfLines={1}
          style={[disabled ? styles.valueDisabled : {}]}
        />
      );
    }

    const active = options.find((option) => {
      return option.value === value;
    });

    if (active) {
      return (
        <TypographyText
          textColor={isDark ? "#fff" : colors.mainDarkModeText}
          size={15}
          font={BALOO_REGULAR}
          title={active.label}
          numberOfLines={1}
          style={[disabled ? styles.valueDisabled : {}]}
        />
      );
    }

    return (
      <TypographyText
        textColor={isDark ? "#fff" : "#999CAD"}
        size={15}
        font={BALOO_REGULAR}
        title={placeholder}
        numberOfLines={1}
        style={[disabled ? styles.valueDisabled : {}, placeholderTextStyle]}
      />
    );
  };
  // renders
  const renderFooter = () => (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        paddingVertical: 20,
        marginBottom: 50,
      }}
    >
      <TouchableOpacity
        onPress={onOk}
        style={[
          styles.footerContainer,
          { backgroundColor: isDark ? colors.navyBlue : colors.darkBlue },
        ]}
      >
        <TypographyText
          title={t("General.confirm")}
          textColor={isDark ? colors.white : colors.white}
          size={16}
          font={BALOO_MEDIUM}
        />
      </TouchableOpacity>
    </View>
  );
  const renderBody = () => (
    <BottomSheetFlatList
      style={[
        styles.contentContainer,
        { backgroundColor: isDark ? colors.darkBlue : colors.white },
      ]}
      ListEmptyComponent={() => (
        <View
          style={{
            ...styles.empty,
            height: 200,
          }}
        >
          <TypographyText
            textColor={"#312B3E"}
            size={14}
            font={BALOO_REGULAR}
            title={t("General.noData")}
            numberOfLines={1}
          />
        </View>
      )}
      renderItem={({ item: option }) => {
        function getFormattedLabel(option) {
          // Extract label
          const mainLabel = option.label;

          // Extract names from short_names array
          const shortNames = option.short_names.map((item) => item.name);

          // Combine main label with short names
          const fLabel = [mainLabel, ...shortNames].join(", ") + ".";

          return fLabel;
        }
        if (renderItem) {
          return renderItem(option, () => {
            setVisible(false);
          });
        }

        const active = single
          ? option.value === value
          : value.includes(option.value);

        return (
          <View
            key={option.value}
            style={{
              paddingLeft: option.indent > 0 ? option.indent * levelIndent : 0,
            }}
          >
            <Checkbox
              style={{ paddingHorizontal: 16, paddingLeft: 0 }}
              isLocationfilter={true}
              label={getFormattedLabel(option)}
              flag={option.x_flag_image}
              emoji={option.emoji}
              active={active}
              onChange={(checked) => {
                if (checked) {
                  setValue((state) => {
                    if (single) {
                      return option.value;
                    }

                    if (Array.isArray(state)) {
                      return state.concat([option.value]);
                    }

                    return state;
                  });
                } else {
                  setValue((state) => {
                    if (single) {
                      return undefined;
                    }

                    if (Array.isArray(state)) {
                      return state.filter((item) => {
                        return item !== option.value;
                      });
                    }

                    return state;
                  });
                }
              }}
            />
          </View>
        );
      }}
      data={updatedOptions}
      keyExtractor={(item) => {
        return String(item.value);
      }}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderHeader = () => (
    <View
      style={[
        styles.searchWrapper,
        { backgroundColor: isDark ? colors.navyBlue : "#FAFAFA" },
      ]}
    >
      <View>
        <SearchSvg color={isDark ? colors.mainDarkMode : "#202226"} />
      </View>

      <TextInput
        onChangeText={handleSearchChange}
        style={[styles.searchInput, getTextAlign()]}
        placeholderTextColor={isDark ? colors.mainDarkMode : "#202226"}
        color={isDark ? colors.mainDarkMode : "#202226"}
        placeholder={t("Merchants.searchPlaceholder")}
      />
    </View>
  );

  const showArrowIcon = Boolean((!value?.length && !value) || !allowClear);
  const showClearIcon = Boolean(
    (allowClear && value?.length) || (allowClear && !!value)
  );

  return (
    <>
      {label && (
        <View style={styles.label}>
          <TouchableOpacity
            onPress={() => {
              //setVisible(true);
              handlePresentModalPress();
            }}
            disabled={disabled}
          >
            <TypographyText
              textColor={isDark ? "#fff" : "#312B3E"}
              size={14}
              font={BALOO_REGULAR}
              title={label}
              numberOfLines={1}
              style={styles.labelText}
            />
          </TouchableOpacity>
        </View>
      )}
      {renderSelect ? (
        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            //switchVisible
            handlePresentModalPress();
            setVisible(true);
          }}
        >
          {renderSelect(renderValue())}
        </TouchableOpacity>
      ) : (
        <>
          <View style={[styles.main, mainStyle]}>
            <View style={styles.body}>
              <TouchableOpacity
                onPress={() => {
                  // setVisible(true);
                  handlePresentModalPress();
                }}
                disabled={disabled}
              >
                {renderValue()}
              </TouchableOpacity>
            </View>
            <View>
              {loading ? (
                <ActivityIndicator />
              ) : (
                showArrowIcon && (
                  <TouchableOpacity
                    style={styles.iconWrap}
                    onPress={() => {
                      // setVisible(true);
                      handlePresentModalPress();
                    }}
                  >
                    <ArrowIcon />
                  </TouchableOpacity>
                )
              )}
              {showClearIcon && (
                <TouchableOpacity
                  onPress={handleClosePress}
                  style={styles.iconWrap}
                >
                  <CloseIcon />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}
      <Portal name={name}>
        <BottomSheetModalProvider key={name}>
          <View style={styles.container}>
            <BottomSheetModal
              key={name}
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onChange={handleSheetChanges}
              backgroundStyle={{
                backgroundColor: isDark ? colors.darkBlue : colors.white,
              }}
              topInset={250}
            >
              <View
                style={{
                  flexDirection: isRTL() ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  marginVertical: 16,
                  paddingHorizontal: 25,
                  width: "100%",
                }}
              >
                <TypographyText
                  title={modalTitle}
                  textColor={isDark ? colors.white : colors.darkBlue}
                  size={20}
                  font={BALOO_MEDIUM}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleClosePress();
                    handlePresentModalclose();
                  }}
                >
                  <TypographyText
                    title={"X"}
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={21}
                    font={BALOO_MEDIUM}
                  />
                </TouchableOpacity>
              </View>

              {renderHeader()}

              {renderBody()}

              {renderFooter()}
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "green",
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: "#999CAD",
    paddingVertical: 12.6,
    paddingHorizontal: 14,
  },
  empty: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    marginTop: 5,
  },
  search: {
    borderBottomColor: "#12234D",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchIcon: { marginBottom: 10 },
  searchField: {
    flexGrow: 1,
    marginLeft: 18,
    marginBottom: 10,
    color: "#000",
  },
  body: {
    flex: 1,
  },
  required: {
    color: "red",
  },
  label: {
    marginBottom: 11,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  help: {
    marginLeft: 5,
  },
  labelText: { marginLeft: 10 },
  valueMargin: {
    marginBottom: 15,
  },
  valueDisabled: {
    color: "#ccc",
  },
  list: {
    alignItems: "center",
  },
  option: {},
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    width: 20,
  },

  customOptionMain: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  customOptionInput: {
    flexGrow: 1,
    width: 120,
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    marginRight: 10,
    color: "#000",
  },
  container: {
    justifyContent: "center",
    // backgroundColor: 'grey',
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    //alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 100,
    //alignSelf:'center'
  },
  footerContainer: {
    padding: 12,
    // margin: 12,
    borderRadius: 12,
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
  },
  searchWrapper: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    marginHorizontal: 35,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default BottomSheetComponent;
