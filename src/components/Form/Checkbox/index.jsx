import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { LUSAIL_REGULAR } from "../../../redux/types";
import { TypographyText } from "../../Typography";
import { isRTL } from "../../../../utils";
import { useTheme } from "../../../../src/components/ThemeProvider";
import { colors } from "../../colors";

const Checkbox = (props) => {
  const { label, flag, emoji, onChange, active = false, style = {} } = props;
  const { isDark } = useTheme();

  const isBase64 = flag?.length > 100;
  const base64Image = `data:image/png;base64,${flag}`;
  const tintColor = !isDark ? colors.darkBlue : colors.mainDarkMode;

  return (
    <TouchableOpacity
      onPress={() => onChange(!active)}
      style={[
        styles.button,
        {
          borderColor: colors.darkGrey,
          flexDirection: isRTL() ? "row-reverse" : "row",
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: isRTL() ? "row-reverse" : "row",
          alignItems: "center",
          flex: style?.flex,
        }}
      >
        {!!flag && (
          <Image
            source={{ uri: isBase64 ? base64Image : flag }}
            style={{
              width: 25,
              height: 18,
              resizeMode: "contain",
              marginRight: 11,
              borderRadius: 3,
              borderWidth: 0.2,
              padding: 6,
              elevation: 5,
              borderColor: "#000",
            }}
          />
        )}
        {!!emoji && (
          <TypographyText
            size={25}
            //  font={LUSAIL_REGULAR}
            title={emoji}
            //  numberOfLines={1}
            style={{ marginRight: 11 }}
          />
        )}
        {!!label && (
          <TypographyText
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={14}
            font={LUSAIL_REGULAR}
            title={label}
            numberOfLines={1}
            style={{ fontWeight: "700", marginRight: 11, flex: style?.flex }}
          />
        )}
      </View>
      <View style={[styles.checkbox]}>
        {active ? (
          <Image
            source={require("../../../assets/Checkbox1.png")}
            style={[styles.logo, { tintColor }]}
          />
        ) : (
          <Image
            source={require("../../../assets/Checkbox4.png")}
            style={[styles.logo, { tintColor }]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomWidth: 1.5,
    paddingBottom: 11,
  },
  label: {
    fontSize: 13,
    color: "#000",
    flex: 1,
  },
  help: {
    paddingLeft: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
  },
  logo: {
    resizeMode: "contain",
    with: "100%",
    height: "100%",
  },
});

export default Checkbox;
