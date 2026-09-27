import React, { useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  View,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { colors } from "../colors";
import { useTheme } from "../ThemeProvider";
import { openScreen } from "../../Navigation/RootNavigation";
import { isRTL } from "../../../utils";

const FloatingAiChatButton = () => {
  const { isDark } = useTheme();
  const isRtl = isRTL();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const gradientColors = isDark
    ? ["#26262B", "#1C1C20", "#131315"]
    : ["#FFFFFF", "#F8F8FA", "#EEEDF2"];

  const primaryAccent = isDark ? colors.mainDarkMode : colors.darkBlue;
  const secondaryAccent = isDark ? "#E8D49A" : colors.mainDarkMode;

  const borderColor = isDark
    ? "rgba(221, 189, 107, 0.7)"
    : "rgba(162, 148, 117, 0.5)";

  return (
    <View
      style={[styles.container, isRtl ? { left: 18 } : { right: 18 }]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[styles.buttonWrapper, { transform: [{ scale: scaleAnim }] }]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => openScreen("AiChat")}
          style={styles.touchable}
          accessibilityLabel="AI Chat"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradientButton,
              {
                borderColor: borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.glossHighlight,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.8)",
                },
              ]}
            />

            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <Defs>
                <SvgGradient id="iconGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop
                    offset="0%"
                    stopColor={secondaryAccent}
                    stopOpacity="1"
                  />
                  <Stop
                    offset="100%"
                    stopColor={primaryAccent}
                    stopOpacity="1"
                  />
                </SvgGradient>
              </Defs>

              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.5C6.753 2.5 2.5 6.42 2.5 11.25c0 2.26.945 4.324 2.51 5.86-.113 1.373-.667 2.67-1.587 3.717a.38.38 0 0 0 .367.595c2.18-.344 4.032-1.185 5.41-2.204.894.246 1.85.382 2.8.382 5.247 0 9.5-3.92 9.5-8.75S17.247 2.5 12 2.5Z"
                fill="url(#iconGrad)"
              />

              <Path
                d="M10.8 7.5C10.8 9.3 9.3 10.8 7.5 10.8C9.3 10.8 10.8 12.3 10.8 14.1C10.8 12.3 12.3 10.8 14.1 10.8C12.3 10.8 10.8 9.3 10.8 7.5Z"
                fill={isDark ? "#1C1C20" : "#FFFFFF"}
              />

              <Path
                d="M16 6.5C16 7.5 15.3 8.2 14.3 8.2C15.3 8.2 16 8.9 16 9.9C16 8.9 16.7 8.2 17.7 8.2C16.7 8.2 16 7.5 16 6.5Z"
                fill={isDark ? "#1C1C20" : "#FFFFFF"}
              />
            </Svg>
          </LinearGradient>

          <View
            style={[
              styles.aiBadge,
              {
                backgroundColor: isDark ? "#141416" : "#FFFFFF",
                borderColor: primaryAccent,
              },
            ]}
          >
            <Svg width={12} height={8} viewBox="0 0 14 10" fill="none">
              <Path
                d="M1.5 8L3.2 2H4.8L6.5 8H5.2L4.8 6.5H3.2L2.8 8H1.5ZM3.5 5.3H4.5L4 3.5L3.5 5.3ZM9.5 8H8.2V2H9.5V8Z"
                fill={primaryAccent}
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 28,
    zIndex: 9999,
    elevation: 12,
  },
  buttonWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        backgroundColor: "transparent",
      },
      android: {
        elevation: 6,
      },
    }),
  },
  touchable: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  gradientButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    overflow: "hidden",
  },
  glossHighlight: {
    position: "absolute",
    top: 2,
    left: 6,
    right: 6,
    height: 14,
    borderRadius: 10,
  },
  aiBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    paddingHorizontal: 2.5,
    paddingVertical: 1,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FloatingAiChatButton;
