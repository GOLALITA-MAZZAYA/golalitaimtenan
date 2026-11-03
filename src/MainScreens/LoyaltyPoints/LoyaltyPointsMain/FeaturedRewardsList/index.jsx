import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import RightArrowSvg from '../../../../assets/loyaltyPoints/rightArrowPrimary.svg';
import RightArrowLightSvg from '../../../../assets/loyaltyPoints/right-arrow-light.svg';
import FeaturedRewardslistItem from "./FeaturedRewardsListItem";
import BagSvg from '../../../../assets/loyaltyPoints/home/bag.svg';
import { TypographyText } from "../../../../components/Typography";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import i18next from "i18next";
import { isRTL } from "../../../../../utils";
import { useTheme } from "../../../../components/ThemeProvider";
import { navigate } from "../../../../Navigation/RootNavigation";
import { BALOO_BOLD, BALOO_MEDIUM } from "../../../../redux/types";

const getFeaturedRewardsList = (isDark) => {
  return [
    {
      title: i18next.t('LoyaltyMain.travel'),
      description: i18next.t('LoyaltyMain.useYourPoints'),
      btnText: i18next.t('LoyaltyTravel.select'),
      onPress: () => navigate('loyaltyPoints-travel-list'),
      source: isDark
        ? require('../../../../assets/loyaltyPoints/categories/travelx2.png')
        : require('../../../../assets/loyaltyPoints/categories/travel_lightx2.png'),
    },
    {
      image: <BagSvg />,
      title: i18next.t('LoyaltyMain.shop'),
      description: i18next.t('LoyaltyMain.exploreTheStore'),
      btnText: i18next.t('LoyaltyMain.explore'),
      onPress: () => navigate('loyaltyPoints-goods-list'),
    },
  ];
};

const FeaturedRewardsList = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const handleSeeAllPress = () => {
    navigate('loyaltyPoints-categories');
  };

  const data = getFeaturedRewardsList(isDark);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.headerWrapper, { flexDirection: isRTL() ? 'row-reverse' : 'row' }]}>
        <TypographyText
          title={t('LoyaltyMain.featuredRewards')}
          textColor={isDark ? '#FFFFFF' : '#111827'}
          size={18}
          font={BALOO_BOLD}
          style={styles.title}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.seeAllWrapper, { flexDirection: isRTL() ? 'row-reverse' : 'row' }]}
          onPress={handleSeeAllPress}
        >
          <TypographyText
            title={t('LoyaltyMain.seeAll')}
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={14}
            font={BALOO_MEDIUM}
            style={styles.actionText}
          />
          <View
            style={{
              transform: [{ rotate: isRTL() ? '180deg' : '0deg' }],
            }}
          >
            {isDark ? (
              <RightArrowSvg color={colors.mainDarkMode} />
            ) : (
              <RightArrowLightSvg color={colors.darkBlue} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        data={data}
        keyExtractor={(item) => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <FeaturedRewardslistItem {...item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  seeAllWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginRight: 6,
    marginLeft: 6,
    fontWeight: '600',
  },
  list: {
    marginTop: 4,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
});

export default FeaturedRewardsList;