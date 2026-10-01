import React, { memo, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { TypographyText } from '../Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import StartIcon from '../../assets/star.svg';
import { sized } from '../../Svg';
import FullScreenLoader from '../Loaders/FullScreenLoader';
import { getFlexDirection, isRTL } from '../../../utils';
import { colors } from '../colors';
import { useTheme } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import useIsGuest from '../../hooks/useIsGuest';

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
  } = parentProps;

  const { t } = useTranslation();
  const { isDark } = useTheme();
  const isGuest = useIsGuest();
  const isRtl = isRTL();

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
            {
              backgroundColor: isDark ? colors.white : colors.highlatedGrey,
              marginLeft: isRtl ? 14 : 0,
              marginRight: isRtl ? 0 : 14,
            },
          ]}
        >
          <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="contain"
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
        </View>

        <View
          style={[
            styles.rightBlock,
            {
              alignItems: isRtl ? 'flex-start' : 'flex-end',
              justifyContent:
                (endDate || distance) && !loadingDescription
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
            {!!endDate && !loadingDescription && (
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
                  title={`${t('PremiumPartner.validTill')} ${endDate}`}
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
