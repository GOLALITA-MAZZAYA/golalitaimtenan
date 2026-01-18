import { StyleSheet, View } from "react-native";
import { SizedBox } from "../../../../_shared/componenets/SizedBox";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { TypographyText } from "../../../../../../../components/Typography";
import { colors } from "../../../../../../../components/colors";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../../../../../../redux/types";
import { TouchableOpacity } from "react-native-gesture-handler";

const RestaurantFiltersItem = ({
  isDark,
  title = "Default title",
  options,
  values,
  onChange,
  t,
  language,
}) => {
  const selectedCount = values?.length;

  const handleClearPress = () => {
    onChange();
  };

  if (!options) {
    return null;
  }

  return (
    <>
      <View style={styles.header}>
        <TypographyText
          title={title}
          textColor={isDark ? colors.white : colors.darkBlue}
          size={18}
          font={BALOO_MEDIUM}
          style={{ flexGrow: 1, textAlign: "left" }}
        />

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          {!!selectedCount && (
            <TypographyText
              title={`${selectedCount} selected`}
              textColor={isDark ? colors.white : "#999CAD"}
              size={14}
              font={BALOO_REGULAR}
              style={{ marginRight: 10 }}
            />
          )}

          {!!selectedCount && (
            <TouchableOpacity onPress={handleClearPress}>
              <TypographyText
                title={t("RestaurantList.clear")}
                textColor={isDark ? colors.white : colors.darkBlue}
                size={14}
                font={BALOO_MEDIUM}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SizedBox size={8} />

      {options.map((item) => {
        const isChecked = values.includes(item.id);

        return (
          <View style={styles.option}>
            <TypographyText
              title={
                language === "ar" ? item.name_arbic || item.name : item.name
              }
              textColor={"#999CAD"}
              size={15}
              font={BALOO_MEDIUM}
            />

            <View style={{ right: -16 }}>
              <BouncyCheckbox
                size={15}
                innerIconStyle={[
                  styles.innerIconStyle,
                  {
                    backgroundColor: isChecked ? colors.green : colors.white,
                    borderColor: isChecked ? colors.green : colors.grey,
                  },
                ]}
                onPress={(isChecked) => onChange(item.id)}
                isChecked={isChecked}
                disableBuiltInState
              />
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },

  innerIconStyle: {
    borderRadius: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
});

export default RestaurantFiltersItem;
