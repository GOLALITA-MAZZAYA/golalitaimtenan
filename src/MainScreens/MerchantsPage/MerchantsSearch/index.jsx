import { StyleSheet, TextInput, View } from "react-native";
import SearchSvg from "../../../assets/search.svg";
import { useTheme } from "../../../components/ThemeProvider";
import { colors } from "../../../components/colors";
import { useTranslation } from "react-i18next";

const MerchantsSearch = ({ onChange }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const iconColor = isDark ? "white" : colors.darkBlue;

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchIconWrapper}>
        <SearchSvg color={iconColor} width={16} height={16} />
      </View>
      <TextInput
        placeholder={`${t("Merchants.search")} ...`}
        style={styles.input}
        onChangeText={onChange}
        placeholderTextColor={isDark ? colors.white : colors.darkBlue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
  },
  searchIconWrapper: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingRight: 10,
  },
});

export default MerchantsSearch;
