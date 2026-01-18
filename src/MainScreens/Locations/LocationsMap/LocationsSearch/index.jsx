import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import BackSvg from "../../../../assets/back.svg";
import { SearchIconDark } from "../../../../assets/delivery_assets";
import { colors } from "../../../../components/colors";
import { useState } from "react";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_MEDIUM } from "../../../../redux/types";
import LocationsSearchModal from "./LocationsSearchModal";
import { useTranslation } from "react-i18next";

const LocationSearch = (props) => {
  const { placeholder, onSearchItemPress, onBackPress, isDark } = props;
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const onChangeText = (search) => {
    setSearch(search);
  };

  const handleCancelPress = () => {
    setSearch("");
  };

  const handleSearchItemPress = (item) => {
    setSearch("");
    onSearchItemPress(item);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onBackPress}>
        <BackSvg color={isDark ? colors.white : colors.darkBlue} />
      </TouchableOpacity>

      <View style={styles.searchFiled}>
        <SearchIconDark />
        <TextInput
          style={[
            styles.input,
            { color: isDark ? colors.white : colors.darkBlue },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.grey}
          onChangeText={onChangeText}
          value={search}
        />
      </View>
      {search && (
        <TouchableOpacity style={styles.cancel} onPress={handleCancelPress}>
          <TypographyText
            textColor={isDark ? colors.grey : colors.darkBlue}
            size={14}
            font={BALOO_MEDIUM}
            title={t("Location.cancel")}
          />
        </TouchableOpacity>
      )}

      {!!search && (
        <LocationsSearchModal
          search={search}
          onPress={handleSearchItemPress}
          isDark={isDark}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 20,
    height: 32,
    zIndex: 20,
  },
  searchFiled: {
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginLeft: 20,
    flex: 1,
  },
  input: {
    marginLeft: 5,
    flex: 1,
    height: 32,
  },
  searchIcon: {
    width: 10,
    height: 10,
  },
  cancel: {
    marginLeft: 20,
  },
});

export default LocationSearch;
