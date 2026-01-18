import React, { useCallback, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getCloseIconColor } from "../../../../styles/colors";

import { CloseIcon } from "../../../../assets/delivery_assets";
import BottomSheet, { BottomSheetRefProps } from "./BottomSheet";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { SizedBox } from "../_shared/componenets/SizedBox";

const options = ["option1", "option2", "option3"];

export default function BottomSheetApp() {
  const ref = useRef(null);

  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-200);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onPress} />
        <BottomSheet ref={ref}>
          <View
            style={{
              marginHorizontal: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <CloseIcon style={{ width: 20, height: 20, stroke: "#999CAD" }} />
              <Text
                style={{ fontSize: 18, fontWeight: "600", color: "#08003B" }}
              >
                Filter Restaurants
              </Text>
              <SizedBox size={1} />
            </View>
            <SizedBox size={24} />
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#08003B" }}>
              Most Used
            </Text>
            <SizedBox size={8} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "600", color: "#999CAD" }}
              >
                Option1
              </Text>
              <BouncyCheckbox
                size={16}
                innerIconStyle={{
                  borderRadius: 4,
                  borderColor: "#999CAD",
                }}
                onPress={(isChecked) => {}}
              />
            </View>
            <SizedBox size={8} />
            <View
              style={{
                borderBottomColor: "grey",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: "white",
    opacity: 0.6,
  },
});
