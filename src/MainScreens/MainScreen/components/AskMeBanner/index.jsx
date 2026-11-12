import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../components/ThemeProvider';
import { colors } from '../../../../components/colors';
import { LUSAIL_REGULAR } from '../../../../redux/types';
import { navigate } from '../../../../Navigation/RootNavigation';
import { isRTL } from '../../../../../utils';

/**
 * AskMeBanner
 * 
 * Minimalist inline AI assistant prompt placed directly below the home screen banner.
 * Auto-hides on scroll down via `collapseAnim`.
 */
const AskMeBanner = ({
  collapseAnim,
  onPromptSelect,
}) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const isRtl = isRTL();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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

  const handlePress = (initialQuery) => {
    if (typeof onPromptSelect === 'function' && initialQuery) {
      onPromptSelect(initialQuery);
    }
    navigate('AiChat', initialQuery ? { initialQuery } : undefined);
  };

  const isArabic = i18n.language === 'ar';
  const labels = {
    welcomePrefix: isArabic ? 'مرحبا ! ' : 'Welcome! ',
    welcomeSuffix: isArabic ? 'هل تريد المساعدة؟' : 'How can I assist you?',
  };

  const goldAccent = isDark ? colors.mainDarkMode || '#D7BC76' : colors.darkBlue || '#a29475';
  const welcomeRedColor = isDark ? '#FF6B6B' : (colors.red || '#ED544C');

  const targetHeight = 28;

  const animatedHeight = collapseAnim
    ? collapseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, targetHeight],
      })
    : targetHeight;

  const animatedOpacity = collapseAnim
    ? collapseAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
      })
    : 1;

  const animatedMargin = collapseAnim
    ? collapseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 8],
      })
    : 8;

  return (
    <Animated.View
      style={[
        styles.animWrapper,
        {
          height: animatedHeight,
          opacity: animatedOpacity,
          marginBottom: animatedMargin,
        },
      ]}
    >
      <Animated.View style={{ width: '100%', transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => handlePress()}
          style={[
            styles.compactBar,
            {
              flexDirection: isRtl ? 'row-reverse' : 'row',
            },
          ]}
        >
          {/* Minimalist AI Sparkle Icon */}
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C6.477 2 2 6.142 2 11.25c0 2.404.995 4.598 2.637 6.223-.119 1.458-.696 2.836-1.658 3.945a.4.4 0 0 0 .385.632c2.28-.365 4.212-1.258 5.652-2.344.935.26 1.936.394 2.984.394 5.523 0 10-4.142 10-9.25S17.523 2 12 2Zm-1.5 5.5c0 2-1.5 3.5-3.5 3.5 2 0 3.5 1.5 3.5 3.5 0-2 1.5-3.5 3.5-3.5-2 0-3.5-1.5-3.5-3.5Zm5.5-1.5c0 1.2-.8 2-2 2 1.2 0 2 .8 2 2 0-1.2.8-2 2-2-1.2 0-2-.8-2-2Z"
              fill={goldAccent}
            />
          </Svg>

          {/* Welcome Prompt Text with "Welcome!" in red */}
          <View
            style={[
              styles.compactTextRow,
              { flexDirection: isRtl ? 'row-reverse' : 'row' },
            ]}
          >
            <Text
              style={{
                fontFamily: LUSAIL_REGULAR,
                fontSize: 13,
                flex: 1,
                textAlign: isRtl ? 'right' : 'left',
              }}
              numberOfLines={1}
            >
              <Text
                style={{
                  color: welcomeRedColor,
                  fontWeight: '700',
                }}
              >
                {labels.welcomePrefix}
              </Text>
              <Text
                style={{
                  color: isDark ? colors.white : '#1C1C1E',
                  fontWeight: '500',
                }}
              >
                {labels.welcomeSuffix}
              </Text>
            </Text>
          </View>

          {/* Minimalist Chevron */}
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d={isRtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              stroke={goldAccent}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animWrapper: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    marginTop: 8,
  },
  compactBar: {
    height: 28,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactTextRow: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
});

export default AskMeBanner;
