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

  const isInsideMerchantsStack = () =>
    !!navigation.getState?.()?.routeNames?.includes("merchants-filters");

  // From Home (Main) we must go through MainStack "merchants".
  // From inside MerchantsNavigator, navigate to the nested screen directly.
  const openMerchantsScreen = (screen, params) => {
    if (isInsideMerchantsStack()) {
      navigation.navigate(screen, params);
      return;
    }

    navigation.navigate("merchants", {
      screen,
      params,
    });
  };

  const handleTextChange = (text) => {
    setSearch(text);
  };

  const handleSearchPress = () => {
    const query = search;

    if (query.length > 0) {
      trackActivity("search", {
        search_query: query,
        page_name: "search",
        metadata: { search_source: "home_quick_search" },
      });
    }

    setSearch("");

    if (query.length === 0) {
      openMerchantsScreen("merchants-filters", {
        filters: { merchant_name: query },
      });
    } else {
      openMerchantsScreen("merchants-list", {
        filters: { merchant_name: query },
      });
    }
  };

  const handleFilterPress = () => {
    if (isHome) {
      navigation.openDrawer();
    } else {
      setSearch("");
      openMerchantsScreen("merchants-filters");
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? "#444444" : "#FAFAFA",
          flexDirection: isRTL() ? "row-reverse" : "row",
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={[styles.filtersBlock, { borderWidth: isDark ? 1 : 0 }]}
        onPress={handleFilterPress}
      >
        <Burger color={isDark ? colors.white : "#202226"} />
      </TouchableOpacity>
      <View style={styles.inputBlock}>
        <TextInput
          value={search}
          onChangeText={handleTextChange}
          style={[styles.input, getTextAlign()]}
          placeholderTextColor={"rgba(255,255,255,0.5)"}
          color={isDark ? colors.white : "#202226"}
          placeholder={t("Merchants.searchPlaceholder")}
        />
      </View>
      <TouchableOpacity style={styles.searchBlock} onPress={handleSearchPress}>
        <SearchSvg color={isDark ? colors.mainDarkMode : "#202226"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    borderRadius: 25,
    backgroundColor: "#444444",
    alignItems: "center",
  },
  filtersBlock: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  inputBlock: {
    flex: 1,
  },
  searchBlock: {
    marginHorizontal: 20,
  },
  input: {
    padding: 10,
  },
});

export default MerchantListHeader;
