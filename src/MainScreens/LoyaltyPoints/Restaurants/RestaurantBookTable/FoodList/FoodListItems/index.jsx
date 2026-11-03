import React from "react";
import {StyleSheet} from "react-native";
import {Tabs} from "react-native-collapsible-tab-view";
import FoodListItem from "../FoodListItem";
import {colors} from "../../../../../../components/colors";
import {isRTL} from "../../../../../../../utils";
import {useTheme} from "../../../../../../components/ThemeProvider";

const FoodListItems = ({
  items,
  itemsInsideForm,
  onAddPress,
  onRemovePress,
}) => {
  const isRtl = isRTL();
  const {isDark} = useTheme();

  return (
    <Tabs.FlatList
      bounces={false}
      data={items}
      key={isDark ? 'dark': 'light'}
      keyExtractor={(item) => `${item.id}`}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={[styles.content,{backgroundColor: colors.loyaltyBackground}]}
      renderItem={({item}) => {
        const amount =
          itemsInsideForm?.find((el) => el.id === item.id)
            ?.quantity || "0";

        return (
          <FoodListItem
            uri={item.image_url || ''}
            name={isRtl ? item.name_ar : item.name}
            description={
              isRtl ? item.description_ar : item.description
            }
            price={item.price}
            amount={amount}
            onAddPress={() => onAddPress(item)}
            onRemovePress={() => onRemovePress(item)}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.loyaltyBackground,
  },
  content: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.loyaltyBackground,
  },
});

export default FoodListItems;