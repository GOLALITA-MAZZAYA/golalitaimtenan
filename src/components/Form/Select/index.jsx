import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import CloseSvg from "../../../assets/close.svg";
import ArrowDownSvg from "../../../assets/arrow_down_thin.svg";
import { sized } from "../../../Svg";
import { TypographyText } from "../../Typography";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../../redux/types";
import { useTheme } from "../../ThemeProvider";
import { colors } from "../../colors";
import BottomSheetComponent from "../BottomSheetComponent";
import { mainStyles } from "../../../styles/mainStyles";

const Select = (props) => {
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
    value: propsValue,
    single = true,
    name,
    error,
  } = props;
  const [value, setValue] = useState([]);

  const { isDark } = useTheme();

  const CloseIcon = sized(
    CloseSvg,
    14,
    14,
    isDark ? colors.darkGrey : colors.darkBlue
  );
  const ArrowIcon = sized(
    ArrowDownSvg,
    24,
    24,
    isDark ? colors.darkGrey : colors.darkBlue
  );

  useEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  const handleClosePress = () => {
    setValue(single ? undefined : []);

    if (onClearPress) {
      onClearPress();
    }
  };

  const toFlatList = (items) => {
    let result = [];

    items.forEach((option) => {
      result.push({
        value: option.value,
        label: option.label,
        data: option.data,
        indent: 0,
      });
    });

    return result;
  };

  const data = toFlatList(options);

  const renderValue = () => {
    if (value && Array.isArray(value) && value.length > 0) {
      return (
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={15}
          font={BALOO_REGULAR}
          title={data
            .filter((option) => {
              return value?.includes(option.value);
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

    const active = data.find((option) => {
      return option.value === value;
    });

    if (active) {
      return (
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
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
        textColor={isDark ? colors.white : colors.darkBlue}
        size={15}
        font={BALOO_REGULAR}
        title={placeholder}
        numberOfLines={1}
        style={[disabled ? styles.valueDisabled : {}, placeholderTextStyle]}
      />
    );
  };

  const showArrowIcon = Boolean(!value?.length || !allowClear);
  const showClearIcon = Boolean(allowClear && value?.length);

  return (
    <>
      {label && (
        <View style={styles.label}>
          <View style={{ flex: 1 }}>
            <TypographyText
              textColor={isDark ? colors.darkGrey : colors.darkBlue}
              size={16}
              font={BALOO_MEDIUM}
              title={label}
              numberOfLines={1}
              style={styles.labelText}
            />
          </View>
        </View>
      )}

      <>
        <BottomSheetComponent
          name={name}
          renderSelect={() => (
            <View
              style={[
                styles.main,
                {
                  borderColor: isDark ? colors.darkGrey : colors.lightGrey,
                  backgroundColor: isDark
                    ? colors.mainDarkModeText
                    : colors.white,
                },
                mainStyle,
              ]}
            >
              <View style={styles.body}>{renderValue()}</View>
              <View>
                {loading ? (
                  <View style={styles.iconWrap}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  showArrowIcon && (
                    <View style={styles.iconWrap}>
                      <ArrowIcon />
                    </View>
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
          )}
          options={data}
          onChange={onChange}
          onClearPress={() => {
            setValue(null);
          }}
          single={single}
          modalTitle={label}
          value={value}
        />
        {props.error && (
          <TypographyText
            title={props.error}
            textColor={"#FF406E"}
            size={14}
            style={{ fontWeight: "700", marginTop: 3 }}
          />
        )}
      </>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    height: 52,
    ...mainStyles.lightShadow,
  },
  empty: {
    height: 200,
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
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  help: {
    marginLeft: 5,
  },
  labelText: { marginLeft: 0, fontWeight: "700" },
  valueMargin: {
    marginBottom: 15,
  },
  valueDisabled: {
    color: "#ccc",
  },
  list: {},
  option: {},
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
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
});

export default Select;
