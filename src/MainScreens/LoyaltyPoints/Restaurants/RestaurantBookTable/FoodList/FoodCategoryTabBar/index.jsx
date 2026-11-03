import React from "react";
import {FlatList, TouchableOpacity, StyleSheet} from "react-native";
import {TypographyText} from "../../../../../../components/Typography";
import {colors} from "../../../../../../components/colors";
import {BALOO_2} from "../../../../../../redux/types";
import {isRTL} from "../../../../../../../utils";


const FoodCategoryTabBar = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const isRtl = isRTL();

  const renderCategory = ({item}) => {
    const isSelected = item.category_id === selectedCategoryId;

    return (
      <TouchableOpacity
        onPress={() => onSelectCategory(item.category_id)}
        style={[
          styles.categoryItem,
          {
            borderBottomColor: isSelected
              ? colors.primary
              : colors.secondary,
            borderBottomWidth: 2,
          },
        ]}
      >
        <TypographyText
          title={isRtl ? item.category_name_ar : item.category_name}
          font={BALOO_2}
          textColor={
            isSelected
              ? colors.loyaltyTextMainTitle
              : colors.textSecondary
          }
          style={styles.categoryText}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      contentContainerStyle={styles.categoriesContainer}
      horizontal
      data={categories}
      keyExtractor={(item) => `${item.category_id}`}
      renderItem={renderCategory}
      showsHorizontalScrollIndicator={false}
      style={styles.categoryList}
    />
  );
};

const styles = StyleSheet.create({
  categoryList: {
    marginBottom: 10,
  },
  categoriesContainer: {
    marginBottom: 20,
    marginHorizontal: 20
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  categoryText: {
    fontWeight: "600",
  },
});

export default FoodCategoryTabBar;