import React, {useMemo, useState, useEffect} from "react";
import {View, StyleSheet} from "react-native";
import useFoodListData from "../../hooks/useFoodListData";
import {
  addFoodItemToForm,
  removeFoodItemFromForm,
} from "../../../../../redux/restaurant/restaurant-actions";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentForm} from "../../../../../redux/restaurant/restaurant-selectors";
import {Tabs} from "react-native-collapsible-tab-view";
import {colors} from "../../../../../components/colors";

import FoodCategoryTabBar from "./FoodCategoryTabBar";
import FoodListItems from "./FoodListItems";
import {isRTL} from "../../../../../../utils";
import {useTheme} from "../../../../../components/ThemeProvider";

const FoodList = ({restaurantId, formName, renderHeader = () => null}) => {
  const {data} = useFoodListData(restaurantId);

  const dispatch = useDispatch();
  const form = useSelector(selectCurrentForm);
  const itemsInsideForm = form?.items;
  const {isDark} = useTheme();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const categories = data || [];

  useEffect(() => {
    if (categories.length && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].category_id);
    }
  }, [categories]);

  const items = useMemo(() => {
    const selected = categories.find(
      (c) => c.category_id === selectedCategoryId
    );
    return selected?.items || [];
  }, [categories, selectedCategoryId]);

  const handleAddPress = (item) => {
    dispatch(addFoodItemToForm(formName, item));
  };

  const handleRemovePress = (item) => {
    dispatch(removeFoodItemFromForm(formName, item));
  };

  const backgroundColor = colors.loyaltyBackground;

  return (
    <View style={{flex: 1, backgroundColor: isDark ? backgroundColor: backgroundColor}}>
      <Tabs.Container
        key={isDark ? 'dark-list': 'light-list'}
        headerContainerStyle={{...styles.headerContainer, backgroundColor}}
        pagerProps={{
          style: {backgroundColor: isDark ? backgroundColor: backgroundColor}, 
        }}
        renderHeader={renderHeader}
        renderTabBar={() => (
          <FoodCategoryTabBar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        )}
      >
        <Tabs.Tab name="menu" key={isDark ? 'dark-list-tab': 'light-list-tab'}>
          <FoodListItems
            items={items}
            itemsInsideForm={itemsInsideForm}
            onAddPress={handleAddPress}
            onRemovePress={handleRemovePress}
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
          shadowOpacity: 0,
          elevation: 0,
    }
})

export default FoodList;