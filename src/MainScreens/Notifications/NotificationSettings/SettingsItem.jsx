import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { mainStyles } from "../../../styles/mainStyles";
import { TypographyText } from "../../../components/Typography";
import { colors } from "../../../components/colors";
import { BALOO_REGULAR } from "../../../redux/types";
import CustomCheckbox from "../../../components/CustomCheckbox/CustomCheckbox";
import { useTheme } from "../../../components/ThemeProvider";
import FastImage from "react-native-fast-image";
import { getFlexDirection } from "../../../../utils";

const SettingsItem = ({ icon, label, isActive, setIsActive, categoryIcon }) => {
  const [isChecked, setIsChecked] = useState(isActive);
  const { isDark } = useTheme();
  return (
    <View
      style={[
        mainStyles.betweenRow,
        mainStyles.p20,
        { marginBottom: 20 },
        getFlexDirection(),
      ]}
    >
      <View style={[mainStyles.row, getFlexDirection()]}>
        <View style={[mainStyles.logoWrapper, styles.logoWrapper]}>
          <FastImage
            source={{
              uri: icon,
            }}
            style={styles.logo}
          />
        </View>

        <View style={styles.categoryLogoWrapper}>
          {categoryIcon && (
            <FastImage
              source={{
                uri: categoryIcon,
              }}
              style={styles.categoryLogo}
            />
          )}
        </View>

        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={14}
          font={BALOO_REGULAR}
          title={label}
          style={{ width: "60%" }}
          numberOfLines={1}
          ellipsizeMode="tail"
        />
      </View>
      <CustomCheckbox
        isActive={isChecked}
        setIsActive={() => {
          setIsActive();
          setIsChecked(!isChecked);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoWrapper: {
    width: 44,
    height: 44,
  },
  logo: {
    width: 33,
    height: 33,
    borderRadius: 50,
  },
  categoryLogoWrapper: {
    width: 20,
    height: 20,
    marginLeft: 8,
    marginRight: 15,
  },
  categoryLogo: {
    width: 20,
    height: 20,
  },
});

const areEqual = (prevProps, nextProps) => {
  return prevProps.merchant_id === nextProps.merchant_id;
};

export default React.memo(SettingsItem, areEqual);
