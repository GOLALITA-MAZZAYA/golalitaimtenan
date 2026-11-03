import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import SearchSvg from "../../../../assets/search.svg";
import Burger from "../../../../assets/new_burger.svg";
import { useTheme } from "../../../../components/ThemeProvider";
import { colors } from "../../../../components/colors";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { getTextAlign, isRTL } from "../../../../../utils";
import { useTranslation } from "react-i18next";
import trackActivity from "../../../../api/activityTracker";

const MerchantListHeader = ({ style, isHome }) => {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleTextChange = (text) => {
    setSearch(text);
  };

  const handleSearchPress = () => {
    if (search.length > 0) {
      trackActivity('search', {
        search_query: search,
        page_name: 'search',
        metadata: { search_source: 'home_quick_search' },
      });
    }

    setSearch("");

    if (search.length == 0) {
      navigation.navigate("merchants", {
        screen: "merchants-filters",
        params: {
          filters: { merchant_name: search },
        },
      });
    } else {
      navigation.navigate("merchants", {
        screen: "merchants-list",
        params: {
          filters: { merchant_name: search },
        },
      });
    }
  };

  const handleFilterPress = () => {
    if (isHome) {
      navigation.openDrawer();
    } else {
      setSearch("");
      navigation.navigate("merchants", {
        screen: "merchants-filters",
      });
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? "#1C1C1E" : "#F5F5F7",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
          flexDirection: isRTL() ? "row-reverse" : "row",
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.filtersBlock,
          {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#E5E7EB",
          },
        ]}
        onPress={handleFilterPress}
        activeOpacity={0.7}
      >
        <Burger color={isDark ? colors.white : "#202226"} width={18} height={18} />
      </TouchableOpacity>
      <View style={styles.inputBlock}>
        <TextInput
          value={search}
          onChangeText={handleTextChange}
          style={[styles.input, getTextAlign()]}
          placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
          color={isDark ? colors.white : "#202226"}
          placeholder={t("Merchants.searchPlaceholder")}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.searchBlock,
          {
            marginLeft: isRTL() ? 4 : 0,
            marginRight: isRTL() ? 0 : 4,
          },
        ]}
        onPress={handleSearchPress}
        activeOpacity={0.7}
      >
        <SearchSvg color={isDark ? colors.mainDarkMode : "#202226"} width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    paddingHorizontal: 6,
  },
  filtersBlock: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  inputBlock: {
    flex: 1,
    paddingHorizontal: 8,
  },
  searchBlock: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 14,
  },
});

export default MerchantListHeader;
