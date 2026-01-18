import { StyleSheet, View } from "react-native";
import { useTheme } from "../../ThemeProvider";
import { TypographyText } from "../../Typography";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LUSAIL_REGULAR } from "../../../redux/types";
import { colors } from "../../colors";
import BottomSheetComponent from "../BottomSheetComponent";
import { useTranslation } from "react-i18next";

const Tags = (props) => {
  const { data, style, onSelect, value } = props;

  const { isDark } = useTheme();
  const { t } = useTranslation();

  if (!data?.length) {
    return null;
  }

  const passiveTextColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const passiveBackgroundColor = "transparent";
  const passiveBorderColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  return (
    <View style={style}>
      <View style={styles.tagsWrapper}>
        <BottomSheetComponent
          renderSelect={() => (
            <View
              style={[
                styles.titleWrapper,
                {
                  borderBottomColor: isDark
                    ? colors.mainDarkMode
                    : colors.navyBlue,
                },
              ]}
            >
              <TypographyText
                textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                size={16}
                title={t("Merchants.addCategory")}
                numberOfLines={1}
                style={[
                  styles.titleText,
                  {
                    borderBottomColor: isDark
                      ? colors.mainDarkMode
                      : colors.navyBlue,
                  },
                ]}
              />
            </View>
          )}
          options={data}
          value={value}
          onChange={onSelect}
          onClearPress={() => {
            onSelect([]);
          }}
          single={false}
          modalTitle={t("Vouchers.categories")}
        />

        {data?.map((item) => {
          const isActive = value.includes(item.value);

          if (!isActive) {
            return null;
          }

          return (
            <View
              style={[
                styles.item,
                {
                  marginRight: 10,
                  borderColor: passiveBorderColor,
                  backgroundColor: passiveBackgroundColor,
                },
              ]}
              key={item.value}
            >
              <TypographyText
                textColor={passiveTextColor}
                size={12}
                font={LUSAIL_REGULAR}
                title={item.label}
                numberOfLines={1}
                style={{ fontWeight: "700" }}
              />
              <TouchableOpacity
                style={[
                  styles.closeWrapper,
                  {
                    backgroundColor: isDark
                      ? colors.mainDarkMode
                      : colors.darkBlue,
                  },
                ]}
                onPress={() =>
                  onSelect(value.filter((id) => id !== item.value))
                }
              >
                <View
                  style={[
                    styles.closeLine1,
                    { backgroundColor: isDark ? "black" : "white" },
                  ]}
                />
                <View
                  style={[
                    styles.closeLine2,
                    { backgroundColor: isDark ? "black" : "white" },
                  ]}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  titleWrapper: {
    borderBottomWidth: 1,
    height: 21,
    marginTop: 5,
    marginRight: 10,
  },
  titleText: {
    height: 21,
  },
  item: {
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  closeWrapper: {
    position: "relative",
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 10,
  },
  closeLine1: {
    position: "absolute",
    width: 14,
    height: 1,
    top: 12,
    left: 5,
    transform: [{ rotate: "45deg" }],
  },
  closeLine2: {
    position: "absolute",
    width: 14,
    height: 1,
    top: 12,
    right: 5,
    transform: [{ rotate: "130deg" }],
  },
});

export default Tags;
