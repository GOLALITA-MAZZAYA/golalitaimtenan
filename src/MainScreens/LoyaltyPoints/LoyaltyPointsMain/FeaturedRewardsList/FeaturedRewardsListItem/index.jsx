import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import ButtonWithImage from "../../../common/ButtonWithIcon";
import { isRTL } from "../../../../../../utils";
import { useTheme } from "../../../../../components/ThemeProvider";
import { BALOO_BOLD, BALOO_REGULAR } from "../../../../../redux/types";

const FeaturedRewardslistItem = ({ image, source, title, description, btnText, onPress }) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.wrapper,
        {
          flexDirection: isRTL() ? 'row-reverse' : 'row',
          backgroundColor: isDark ? '#18181B' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.infoBlock, { alignItems: isRTL() ? 'flex-end' : 'flex-start' }]}>
        <TypographyText
          title={title}
          textColor={isDark ? '#FFFFFF' : '#111827'}
          size={16}
          font={BALOO_BOLD}
          style={styles.title}
        />
        <TypographyText
          title={description}
          textColor={isDark ? '#A1A1AA' : '#71717A'}
          size={12}
          font={BALOO_REGULAR}
          style={styles.description}
        />

        <ButtonWithImage
          text={btnText}
          onPress={onPress}
          style={styles.btn}
          primary
        />
      </View>

      <View style={styles.imageWrapper}>
        {image && image}
        {source && (
          <Image source={source} resizeMode="contain" style={styles.logo} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 18,
    marginRight: 12,
    padding: 14,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  infoBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    lineHeight: 20,
  },
  description: {
    marginTop: 2,
    marginBottom: 10,
  },
  btn: {
    height: 36,
    paddingHorizontal: 16,
    flex: 0,
    alignSelf: 'flex-start',
  },
  imageWrapper: {
    width: 95,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default FeaturedRewardslistItem;