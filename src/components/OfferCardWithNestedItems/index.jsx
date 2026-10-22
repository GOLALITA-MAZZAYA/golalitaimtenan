import React, { memo, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { TypographyText } from '../Typography';
import { LUSAIL_REGULAR, BALOO_BOLD} from '../../redux/types';
import StartIcon from '../../assets/star.svg';
import { sized } from '../../Svg';
import FullScreenLoader from '../Loaders/FullScreenLoader';
import { getFlexDirection, isRTL } from '../../../utils';
import { colors } from '../colors';
import { useTheme } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import useIsGuest from '../../hooks/useIsGuest';
import { rewriteAssetUrl } from '../../utils/rewriteAssetUrl';

const IMAGE_SIZE = 64;

const CardWithNesetedItems = ({ parentProps }) => {
  const {
    uri,
    name,
    description,
    endDate,
    loadingDescription,
    isSaved,
    onPress,
    onPressFavourite,
    distance,
    expiryDate,
    offerCount,
    offersLabel,
    imageAspectRatio,
  } = parentProps;

  const date = endDate || expiryDate;

  const { t } = useTranslation();
  const { isDark } = useTheme();
  const isGuest = useIsGuest();
  const isRtl = isRTL();

  // Prefer an explicit offersLabel from the list API (offer_count). Never invent
  // a bare "Offers" label when the count is missing or zero.
  const displayOffersLabel = useMemo(() => {
    if (
      offersLabel !== undefined &&
      offersLabel !== null &&
      offersLabel !== ''
    ) {
      return offersLabel;
    }
    if (offerCount === undefined || offerCount === null) {
      return null;
    }
    const num = Number(offerCount);
    if (num <= 0) {
      return null;
    }
    if (isRtl) return `${num} عروض`;
    return `${num} ${num === 1 ? 'Offer' : 'Offers'}`;
  }, [offersLabel, offerCount, isRtl]);

  const StarIconSmall = useMemo(() => sized(StartIcon, 20, 20), []);
  const starColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? colors.darkBlue : colors.white,
          borderBottomColor: isDark ? colors.borderGrey : colors.highlatedGrey,
        },
      ]}
    >
      <View style={[styles.row, getFlexDirection()]}>
        <View
          style={[
            styles.imageWrapper,
            imageAspectRatio
              ? {
                  width: 112,
                  height: undefined,
                  aspectRatio: imageAspectRatio,
                }
              : null,
            {
              backgroundColor: isDark ? colors.white : '#F5F5F5',
              marginLeft: isRtl ? 14 : 0,
              marginRight: isRtl ? 0 : 14,
            },
          ]}
        >
          <Image
            source={{ uri: rewriteAssetUrl(uri) }}
            style={styles.image}
            resizeMode={imageAspectRatio ? 'cover' : 'contain'}
          />
        </View>

        <View style={styles.infoWrapper}>
          <TypographyText
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={16}
            font={LUSAIL_REGULAR}
            title={name}
            numberOfLines={2}
            style={styles.name}
          />

          {loadingDescription && (
            <FullScreenLoader
              style={{ alignSelf: 'flex-start', marginTop: 4 }}
            />
          )}

          {!!description && !loadingDescription && (
            <TypographyText
              textColor={isDark ? colors.white : colors.darkBlue}
              size={14}
              font={LUSAIL_REGULAR}
              title={description}
              numberOfLines={1}
              style={[
                styles.description,
                {
                  alignSelf: isRtl ? 'flex-end' : 'flex-start',
                },
              ]}
            />
          )}

          {!!displayOffersLabel && (
            <View
              style={[
                styles.offersLinkToggle,
                {
                  alignSelf: isRtl ? 'flex-end' : 'flex-start',
                },
              ]}
            >
              <TypographyText
                textColor="#E32251"
                size={13}
                font={BALOO_BOLD}
                title={displayOffersLabel}
                style={styles.offersLinkText}
              />
            </View>
          )}
        </View>

        <View
          style={[
            styles.rightBlock,
            {
              alignItems: isRtl ? 'flex-start' : 'flex-end',
              justifyContent:
                (date || distance) && !loadingDescription
                  ? 'space-between'
                  : 'center',
              paddingLeft: isRtl ? 0 : 10,
              paddingRight: isRtl ? 10 : 0,
            },
          ]}
        >
          {!isGuest && (
            <TouchableOpacity
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
              style={[
                styles.favoriteButton,
                {
                  alignSelf: isRtl ? 'flex-start' : 'flex-end',
                },
              ]}
              onPress={onPressFavourite}
            >
              <StarIconSmall
                color={starColor}
                fill={isSaved ? starColor : 'transparent'}
              />
            </TouchableOpacity>
          )}

          <View style={{ alignItems: isRtl ? 'flex-start' : 'flex-end' }}>
            {!!distance && (
              <TypographyText
                textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                size={11}
                font={LUSAIL_REGULAR}
                title={distance}
                numberOfLines={1}
                style={{ fontWeight: '700', marginBottom: 2 }}
              />
            )}
            {!!date && date !== '...' && !loadingDescription && (
              <View
                style={[
                  styles.endDateBlock,
                  { alignItems: isRtl ? 'flex-start' : 'flex-end' },
                ]}
              >
                <TypographyText
                  textColor={
                    isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'
                  }
                  size={11}
                  font={LUSAIL_REGULAR}
                  title={`${t('PremiumPartner.validTill')} ${date}`}
                  numberOfLines={1}
                  style={[
                    styles.endDate,
                    { textAlign: isRtl ? 'left' : 'right' },
                  ]}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: IMAGE_SIZE,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
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
    alignSelf: 'stretch',
  },
  name: {
    fontWeight: '700',
    lineHeight: 22,
  },
  description: {
    marginTop: 4,
    fontWeight: '400',
  },
  rightBlock: {
    justifyContent: 'space-between',
    minHeight: IMAGE_SIZE,
    alignSelf: 'stretch',
  },
  offersLinkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    marginTop: 4,
  },
  offersLinkText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  favoriteButton: {
    padding: 2,
  },
  endDateBlock: {
    justifyContent: 'flex-end',
  },
  endDate: {
    fontWeight: '400',
  },
});

export default memo(CardWithNesetedItems);
