import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { TypographyText } from "../Typography";
import PremiumSvg from "../../assets/premium.svg";
import { SCREEN_HEIGHT, mainStyles } from "../../styles/mainStyles";
import { colors } from "../colors";
import { BALOO_SEMIBOLD } from "../../redux/types";
import FastImage from "react-native-fast-image";
import { sized } from "../../Svg";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { checkIsNew, isRTL } from "../../../utils";
import { getLocalClients } from "../../api/merchants";

const IMAGE_SIZE = 123;
const PremiumIcon = sized(PremiumSvg, 24, 24, "white");

const Clients = (props) => {
  const { title, onPress, isDark, style } = props;
  const { t, i18n } = useTranslation();

  const language = i18n.language;
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocalClients(1)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const renderLocalClient = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => onPress(item.id)} style={styles.item}>
        <View style={styles.logoWrapper}>
          <FastImage
            source={{
              uri: item.image_url,
            }}
            style={styles.logo}
          />
        </View>
        {checkIsNew(item.create_date) && (
          <View style={styles.newIcon}>
            <TypographyText
              textColor={isDark ? colors.white : "#000"}
              size={14}
              font={BALOO_SEMIBOLD}
              title={t("MainScreen.new")}
              style={styles.newText}
            />
          </View>
        )}
        <View>
          <TypographyText
            textColor={isDark ? colors.white : "#000"}
            size={14}
            font={BALOO_SEMIBOLD}
            title={
              language === "ar" ? item.x_name_arabic || item.name : item.name
            }
            style={styles.name}
            numberOfLines={2}
          />
        </View>
      </TouchableOpacity>
    ),
    [title, isDark]
  );

  return (
    <View style={style}>
      {!!title && (
        <View
          style={[
            mainStyles.row,
            styles.titleWrapper,
            { alignSelf: isRTL() ? "flex-end" : "flex-start" },
          ]}
        >
          <PremiumIcon color="white" />
          <TypographyText
            textColor={isDark ? colors.white : "#000"}
            size={20}
            font={BALOO_SEMIBOLD}
            title={title}
            style={{ marginHorizontal: 12 }}
          />
        </View>
      )}

      <FlatList
        data={data}
        windowSize={SCREEN_HEIGHT}
        maxToRenderPerBatch={5}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderLocalClient}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={
          <View style={styles.listEmptyLoader}>
            <ActivityIndicator size={"large"} color={colors.green} />
          </View>
        }
        ListFooterComponent={
          loading &&
          data?.length && (
            <View style={styles.loader}>
              <ActivityIndicator size={"large"} color={colors.green} />
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    marginBottom: 16,
  },
  item: {
    width: IMAGE_SIZE,
    marginRight: 16,
    position: "relative",
  },
  logoWrapper: {
    ...mainStyles.generalShadow,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  logo: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
  },
  newIcon: {
    position: "absolute",
    top: 10,
    right: 0,
    backgroundColor: "#E32251",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  newText: {
    color: "#fff",
  },
  name: {
    paddingRight: 16,
  },
  contentContainerStyle: {
    paddingLeft: 5,
    flexGrow: 1,
  },
  listEmptyLoader: {
    paddingVertical: 50,
    alignSelf: "center",
    width: "100%",
  },
  loader: {
    paddingVertical: 50,
  },
});

export default Clients;
