import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../components/AppImage";
import RightArrowSvg from '../../../../assets/loyaltyPoints/rightArrow.svg';
import RightArrowLightSvg from '../../../../assets/loyaltyPoints/right-arrow-light';
import { colors } from "../../../../components/colors";
import { TypographyText } from "../../../../components/Typography";
import { isRTL } from "../../../../../utils";
import { useTheme } from "../../../../components/ThemeProvider";
import { BALOO_BOLD, BALOO_REGULAR } from "../../../../redux/types";

const ListCard = memo(({ icon, onPress, title, description, style, isDark: isDarkProp, isGrouped }) => {
  const { isDark: isDarkTheme } = useTheme();
  const isDark = isDarkProp ?? isDarkTheme;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        isGrouped ? styles.groupedWrapper : styles.standaloneWrapper,
        {
          flexDirection: isRTL() ? 'row-reverse' : 'row',
          backgroundColor: isGrouped ? 'transparent' : isDark ? '#18181B' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
        style,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F4F4F5',
            marginLeft: isRTL() ? 12 : 0,
            marginRight: isRTL() ? 0 : 12,
          },
        ]}
      >
        <Image
          source={typeof icon === 'string' ? { uri: icon } : icon}
          style={styles.icon}
          contentFit="contain"
        />
      </View>

      <View style={styles.textWrapper}>
        <TypographyText
          title={title}
          textColor={isDark ? '#FFFFFF' : '#111827'}
          size={15}
          font={BALOO_BOLD}
          style={styles.title}
        />

        {!!description && (
          <TypographyText
            title={description}
            textColor={isDark ? '#71717A' : '#A1A1AA'}
            size={12}
            font={BALOO_REGULAR}
            style={styles.description}
          />
        )}
      </View>

      <View
        style={[
          styles.arrowWrapper,
          {
            transform: [{ rotate: isRTL() ? '180deg' : '0deg' }],
          },
        ]}
      >
        {isDark ? (
          <RightArrowSvg color="#71717A" />
        ) : (
          <RightArrowLightSvg color="#A1A1AA" />
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  standaloneWrapper: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  groupedWrapper: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 34,
    height: 34,
  },
  title: {
    fontWeight: '700',
    lineHeight: 18,
  },
  description: {
    marginTop: 2,
  },
  textWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  arrowWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});

export default ListCard;