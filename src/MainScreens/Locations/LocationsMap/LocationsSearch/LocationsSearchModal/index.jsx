import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../../../../redux/types";
import { useEffect, useState } from "react";
import { getAddressFromName } from "../../../../../helpers";
import { useTranslation } from "react-i18next";

const LocationsSearchModal = ({ search, onPress, isDark }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      getAddressFromName(search)
        .then((location) => {
          setLocations([location]);
        })
        .catch((err) => {
          console.log(err, "err");
          setLocations([]);
        })
        .finally(() => setLoading(false));
    }
  }, [search]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
      <TypographyText
        textColor={isDark ? colors.white : colors.darkBlue}
        size={14}
        font={BALOO_MEDIUM}
        title={item.city}
      />
      <TypographyText
        textColor={isDark ? colors.grey : colors.darkBlue}
        size={14}
        font={BALOO_REGULAR}
        title={item.formatted_address}
      />
    </TouchableOpacity>
  );

  const NoSearchText = (
    <TypographyText
      textColor={colors.darkBlue}
      size={14}
      font={BALOO_MEDIUM}
      title={t("Location.noLocations")}
      style={{ textAlign: "center" }}
    />
  );

  const NotFoundText = (
    <TypographyText
      textColor={colors.darkBlue}
      size={14}
      font={BALOO_MEDIUM}
      title={t("Location.notFound")}
      style={{ textAlign: "center" }}
    />
  );

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? colors.darkBlue : colors.white },
      ]}
    >
      <FlatList
        data={locations}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={!search ? NoSearchText : NotFoundText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    position: "absolute",
    top: 50,
    left: 0,
    backgroundColor: colors.white,
    zIndex: 21,
  },
  contentContainerStyle: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: 200,
  },
  item: {
    marginTop: 16,
  },
});

export default LocationsSearchModal;
