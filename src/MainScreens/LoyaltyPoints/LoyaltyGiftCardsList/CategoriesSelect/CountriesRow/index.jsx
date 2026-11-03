import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Image from "../../../../../components/AppImage";
import { TypographyText } from "../../../../../components/Typography";
import { colors } from "../../../../../components/colors";
import { BALOO_2 } from "../../../../../redux/types";
import { isRTL } from "../../../../../../utils";

const CountriesRow = ({ countries, value, onChange }) => {
  const isRtl = isRTL();

  const renderCountry = ({ item }) => {
    const active = item.value === value;

    return (
      <TouchableOpacity
        onPress={() => onChange(active ? undefined : item.value)}
        style={[
          styles.chip,
          { backgroundColor: active ? colors.loyaltyPrimary : colors.loyaltyCardBackground },
        ]}
      >
        {!!item.icon && (
          <Image source={{ uri: `data:image/png;base64,${item.icon}` }} style={styles.flag} />
        )}

        <TypographyText
          title={isRtl ? item.label_arabic : item.label}
          font={BALOO_2}
          size={13}
          textColor={active ? colors.loyaltyBtnTextPrimary : colors.loyaltyTextInputText}
          style={styles.label}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      data={countries}
      keyExtractor={item => String(item.value)}
      renderItem={renderCountry}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      style={styles.wrapper}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 22,
  },
  list: {
    paddingHorizontal: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  flag: {
    width: 22,
    height: 14,
    marginRight: 8,
    borderRadius: 2,
  },
  label: {
    fontSize: 13,
  },
});

export default CountriesRow;
