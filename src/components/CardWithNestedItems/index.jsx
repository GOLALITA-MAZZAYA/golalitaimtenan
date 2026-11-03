import { cloneElement, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Image from "../AppImage";
import { TypographyText } from '../Typography';
import { BALOO_2, BALOO_BOLD, BALOO_REGULAR, LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../colors';
import { useTheme } from '../ThemeProvider';
import ArrowSvg from '../../assets/arrow_right.svg';
import StartIcon from '../../assets/star.svg';
import DiscountLabel from '../../assets/discountLabel.svg';
import { sized } from '../../Svg';
import { useTranslation } from 'react-i18next';
import FullScreenLoader from '../Loaders/FullScreenLoader';
import { getFlexDirection, isRTL } from '../../../utils';

const IMAGE_SIZE = 64;

const CardWithNesetedItems = props => {
  const { parentProps, toggleBtns, children, footerAction } = props;

  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [openedIndex, setOpenedIndex] = useState(null);
  const isRtl = isRTL();

  const ArrowIconSmall = sized(
    ArrowSvg,
    14,
    14,
    isDark ? colors.mainDarkMode : colors.darkBlue,
  );

  const StartIconSmall = sized(
    StartIcon,
    20,
    20,
    isDark ? (parentProps?.isSaved ? colors.mainDarkMode : '#71717A') : (parentProps?.isSaved ? colors.darkBlue : '#A1A1AA'),
  );

  const DiscountIcon = sized(
    DiscountLabel,
    11,
    11,
    isDark ? colors.mainDarkMode : colors.darkBlue,
  );

  const renderToggleBtn = (item, index) => {
    const isActive = item.type === openedIndex;
    const isOffersLink = item.type === "offers" && !item.isBookNow;

    if (isOffersLink) {
      return (
        <View
          key={item.type}
          style={[
            styles.offersLinkToggle,
            {
              flexDirection: isRtl ? "row-reverse" : "row",
            },
          ]}
        >
          <TypographyText
            textColor="#E32251"
            size={13}
            font={BALOO_BOLD}
            title={item.showText}
            style={styles.offersLinkText}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.type}
        activeOpacity={0.7}
        onPress={() => setOpenedIndex(isActive ? null : item.type)}
        style={[
          styles.toggle,
          {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#F4F4F5",
          },
        ]}
      >
        <View
          style={{
            transform: [{ rotate: isActive ? "270deg" : "90deg" }],
            marginRight: isRtl ? 0 : 4,
            marginLeft: isRtl ? 4 : 0,
          }}
        >
          <ArrowIconSmall />
        </View>
        <TypographyText
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={12}
          font={BALOO_BOLD}
          title={isActive ? item.hideText : item.showText}
          style={{ fontWeight: "700" }}
        />
      </TouchableOpacity>
    );
  };

  const isStamp = Boolean(
    parentProps?.stamp ||
    parentProps?.isStampEnabled ||
    parentProps?.is_stamp_enabled
  );
  const isCoupon = Boolean(
    parentProps?.coupon ||
    parentProps?.isProvidingCoupon ||
    parentProps?.is_providing_coupon
  );

  const badges = [];
  if (parentProps?.new) {
    badges.push({
      key: 'new',
      title: t('MainScreen.new', 'New'),
    });
  }
  if (parentProps?.premium) {
    badges.push({
      key: 'premium',
      title: t('MainScreen.exclusive', 'Exclusive'),
    });
  }
  if (isStamp) {
    badges.push({
      key: 'stamp',
      title: parentProps?.stampTitle || t('MainScreen.stamp', 'Stamp'),
    });
  }
  if (isCoupon) {
    badges.push({
      key: 'coupon',
      title: parentProps?.couponTitle || t('MainScreen.coupons', 'Coupons'),
    });
  }
  if (parentProps?.goPoints) {
    badges.push({
      key: 'goPoints',
      title: t('MainScreen.goPoints', 'Go Points'),
    });
  }
  if (parentProps?.ribbonText) {
    badges.push({
      key: 'custom',
      title: parentProps.ribbonText,
    });
  }

  const hasBadge = badges.length > 0;

  const renderParent = (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => parentProps.onPress()}
        style={[styles.row, getFlexDirection()]}
      >
        {hasBadge && (
          <View
            pointerEvents="box-none"
            style={[
              styles.badgeContainer,
              {
                right: isRtl ? undefined : -12,
                left: isRtl ? -12 : undefined,
                flexDirection: isRtl ? 'row' : 'row-reverse',
              },
            ]}
          >
            {badges.map((badge, index) => {
              const isCornerBadge = index === 0;
              const badgeShapeStyle = isCornerBadge
                ? {
                    borderTopLeftRadius: isRtl ? 14 : 0,
                    borderBottomLeftRadius: isRtl ? 0 : 6,
                    borderTopRightRadius: isRtl ? 0 : 14,
                    borderBottomRightRadius: isRtl ? 6 : 0,
                  }
                : {
                    borderRadius: 6,
                  };

              return (
                <View
                  key={badge.key}
                  style={[styles.badgeItem, badgeShapeStyle]}
                >
                  <TypographyText
                    textColor={'#FFFFFF'}
                    size={11}
                    font={BALOO_BOLD}
                    title={badge.title}
                    style={styles.newText}
                  />
                </View>
              );
            })}
          </View>
        )}

        <View
          style={[
            styles.imageWrapper,
            {
              backgroundColor: '#FFFFFF',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
              marginLeft: isRtl ? 12 : 0,
              marginRight: isRtl ? 0 : 12,
            },
          ]}
        >
          <Image
            source={{ uri: parentProps.uri }}
            style={styles.image}
            contentFit="contain"
          />
        </View>

        <View style={styles.infoWrapper}>
          <TypographyText
            textColor={isDark ? '#FFFFFF' : '#111827'}
            size={16}
            font={BALOO_2}
            title={parentProps.name}
            numberOfLines={2}
            style={styles.merchantName}
          />

          {parentProps.loadingDescription && (
            <FullScreenLoader style={{ alignSelf: isRtl ? 'flex-end' : 'flex-start' }} />
          )}

          <View
            style={[
              styles.descriptionBlock,
              {
                flexDirection: isRtl ? 'row-reverse' : 'row',
                justifyContent: 'flex-start',
              },
            ]}
          >
            {!!parentProps.description && !parentProps.loadingDescription && (
              <View
                style={[
                  styles.discountBadge,
                  {
                    backgroundColor: isDark
                      ? 'rgba(221, 189, 107, 0.14)'
                      : 'rgba(162, 148, 117, 0.12)',
                    flexDirection: isRtl ? 'row-reverse' : 'row',
                  },
                ]}
              >
                <DiscountIcon />
                <TypographyText
                  textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                  size={12}
                  font={BALOO_BOLD}
                  title={parentProps?.description}
                  numberOfLines={1}
                  style={[
                    styles.discountText,
                    {
                      marginRight: isRtl ? 4 : 0,
                      marginLeft: isRtl ? 0 : 4,
                    },
                  ]}
                />
              </View>
            )}

            {parentProps.acceptGoLoyaltyPoint && (
              <Image
                source={require('../../assets/loyalty.jpg')}
                style={styles.loyaltyImage}
              />
            )}
          </View>
        </View>

        <View
          style={[
            styles.rightBlock,
            {
              paddingLeft: isRtl ? 0 : 8,
              paddingRight: isRtl ? 8 : 0,
              alignItems: isRtl ? 'flex-start' : 'flex-end',
            },
          ]}
        >
          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={[
              styles.favBtn,
              hasBadge && { marginTop: 14 },
            ]}
            onPress={() => parentProps.onPressFavourite()}
          >
            {parentProps.isSaved ? (
              <StartIconSmall
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
                fill={isDark ? colors.mainDarkMode : colors.darkBlue}
              />
            ) : (
              <StartIconSmall
                color={isDark ? '#71717A' : '#A1A1AA'}
              />
            )}
          </TouchableOpacity>

          {parentProps.distance && (
            <View style={styles.distanceBlock}>
              {!parentProps.distanceLoading ? (
                <TypographyText
                  textColor={isDark ? '#A1A1AA' : '#6B7280'}
                  size={12}
                  title={parentProps.distance}
                  font={BALOO_REGULAR}
                  style={styles.distanceText}
                /> 
              ) : (
                <ActivityIndicator size="small" />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? '#18181B' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {renderParent}

      {((toggleBtns && toggleBtns.length > 0) || footerAction) && (
        <View
          style={[
            styles.toggleBtn,
            {
              justifyContent:
                footerAction
                  ? "flex-start"
                  : toggleBtns.length > 1
                  ? "space-between"
                  : isRtl
                  ? "flex-end"
                  : "flex-start",
              paddingLeft: isRtl
                ? 0
                : toggleBtns?.some((b) => b.type === "offers" && !b.isBookNow)
                ? 76
                : 0,
              paddingRight: isRtl
                ? toggleBtns?.some((b) => b.type === "offers" && !b.isBookNow)
                  ? 76
                  : 0
                : 0,
            },
          ]}
        >
          {isRtl && footerAction && (
            <View style={styles.footerActionRtl}>{footerAction}</View>
          )}
          {toggleBtns?.map(renderToggleBtn)}
          {!isRtl && footerAction && (
            <View style={styles.footerAction}>{footerAction}</View>
          )}
        </View>
      )}

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.contentContainerStyle}
      >
        {Array.isArray(children)
          ? children.map((item, index) => {
              if (openedIndex !== item?.props?.type) {
                return null;
              }

              return cloneElement(item, { key: item?.props?.type ?? index });
            })
          : children && openedIndex === children?.props?.type
          ? children
          : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  merchantName: {
    fontWeight: '700',
    lineHeight: 22,
  },
  descriptionBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
  },
  discountText: {
    fontWeight: '700',
  },
  loyaltyImage: {
    width: 44,
    height: 22,
    marginHorizontal: 6,
  },
  badgeContainer: {
    position: 'absolute',
    top: -12,
    zIndex: 10,
    alignItems: 'center',
    gap: 4,
  },
  badgeItem: {
    backgroundColor: '#E32251',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  newIcon: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#E32251',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  newText: {
    color: '#fff',
    fontWeight: '700',
  },
  rightBlock: {
    justifyContent: 'space-between',
    minHeight: IMAGE_SIZE,
    alignSelf: 'stretch',
  },
  favBtn: {
    padding: 2,
  },
  distanceBlock: {
    justifyContent: 'flex-end',
  },
  distanceText: {
    fontWeight: '500',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  footerAction: {
    marginLeft: 'auto',
  },
  footerActionRtl: {
    marginRight: 'auto',
  },
  offersLinkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    marginTop: 2,
  },
  offersLinkText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
});

export default CardWithNesetedItems;
