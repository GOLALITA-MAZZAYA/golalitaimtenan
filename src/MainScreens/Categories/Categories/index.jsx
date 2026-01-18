import { SafeAreaView, StyleSheet, View, FlatList } from "react-native";
import CommonHeader from "../../../components/CommonHeader/CommonHeader";
import { useTheme } from "../../../components/ThemeProvider";
import { colors } from "../../../components/colors";
import { mainStyles } from "../../../styles/mainStyles";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { TypographyText } from "../../../components/Typography";
import { LUSAIL_REGULAR } from "../../../redux/types";
import { useSelector } from "react-redux";

const IMAGE_SIZE = 80;

const Categories = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const parentCategories = useSelector(
    (state) => state.merchantReducer.parentCategories
  );
  const language = i18n.language;

  const navigateToMerchant = (category) => {
    if (!category.children?.length) {
      navigation.navigate("merchants", {
        screen: "merchants-list",
        params: {
          filters: { category_id: [category.id] },
          parentCategoryId: category?.parent_id?.[0],
          parentCategoryName:
            language === "ar" ? category?.x_name_arabic : category.name,
        },
      });

      return;
    }

    navigation.navigate("categories", {
      screen: "categories-child",
      params: {
        childCategories: category.children,
        parentCategoryName:
          language === "ar" ? category?.x_name_arabic : category.name,
      },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CommonHeader
          isWhite={isDark}
          label={t("Categories.title")}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        <FlatList
          data={parentCategories}
          numColumns={3}
          contentContainerStyle={styles.contentContainerStyle}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToMerchant(item)}
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <View style={[styles.imageWrapper]}>
                <FastImage
                  style={styles.categoryImage}
                  source={{
                    uri:
                      (isDark ? item.x_image_url_4 : item.x_image_url_3) ||
                      undefined,
                  }}
                />
              </View>
              <TypographyText
                textColor={isDark ? colors.white : "#000"}
                size={14}
                font={LUSAIL_REGULAR}
                title={language === "ar" ? item.x_name_arabic : item.name}
                style={styles.categoryName}
                numberOfLines={3}
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  categoryName: {
    marginTop: 4,
    flex: 1,
    width: IMAGE_SIZE,
    fontWeight: "700",
    textAlign: "center",
  },
  categoryItem: {
    marginRight: 16,
    flex: 1,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    marginTop: 16,
    paddingBottom: 40,
  },
  imageWrapper: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    ...mainStyles.generalShadow,
    width: IMAGE_SIZE + 5,
    height: IMAGE_SIZE + 5,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
  },
  noData: {
    height: IMAGE_SIZE + 26,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainerStyle: {
    paddingLeft: 5,
  },
  categoryImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
  },
  contentContainerStyle: { flexGrow: 1, paddingHorizontal: 20, marginTop: 16 },
});

export default Categories;
