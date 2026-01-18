import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { colors } from "../colors";
import { BALOO_REGULAR } from "../../redux/types";
import { TypographyText } from "../Typography";
import { useTheme } from "../ThemeProvider";

const DropDown = ({ items, onItemPress }) => {
  const { isDark } = useTheme();
  return (
    <View style={{ position: "relative" }}>
      <View
        style={[styles.dropdown, isDark && { backgroundColor: colors.secBlue }]}
      >
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity activeOpacity={1}>
            {items.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => onItemPress(item)}
                  key={index}
                  style={styles.dropdown__item}
                >
                  <TypographyText
                    textColor={isDark ? colors.white : colors.darkBlue}
                    size={16}
                    font={BALOO_REGULAR}
                    title={item?.label || item}
                  />
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default DropDown;
