import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../components/ThemeProvider';
import { colors } from '../../components/colors';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../redux/types';
import StampCardItem from './components/StampCardItem';
import { fetchCustomerCards } from '../../redux/discountCard/discountCard-thunks';
import Svg, { Rect, Path } from 'react-native-svg';

const EmptyCardIcon = ({ size = 64, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="3"
      stroke={color}
      strokeWidth="1.5"
      strokeDasharray="4 4"
    />
    <Path d="M2 10H22" stroke={color} strokeWidth="1.5" strokeDasharray="4 4" />
    <Rect x="6" y="14" width="4" height="2" rx="1" fill={color} />
  </Svg>
);

const DiscountCardsListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const { cards, cardsLoading } = useSelector(
    (state) => state.discountCardReducer || { cards: [], cardsLoading: false }
  );

  const loadCards = useCallback(() => {
    dispatch(fetchCustomerCards());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards])
  );

  const handleCardPress = (card) => {
    navigation.navigate('DiscountCardDetail', {
      cardId: card.card_id,
      merchantName: card.merchant_name,
    });
  };

  const backgroundColor = isDark ? colors.darkModeBackground : colors.white;
  const activeColor = colors.main || '#C29F54';

  const renderEmptyState = () => {
    if (cardsLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6' }]}>
          <EmptyCardIcon size={56} color={isDark ? '#6B7280' : '#9CA3AF'} />
        </View>
        <TypographyText
          title={t('DiscountCards.noCards', "You don't have any discount cards yet")}
          size={16}
          font={LUSAIL_BOLD}
          textColor={isDark ? colors.white : colors.black}
          style={styles.emptyTitle}
        />
        <TypographyText
          title={t('DiscountCards.noCardsDesc', 'Cards issued by participating merchants will appear here.')}
          size={13}
          font={LUSAIL_REGULAR}
          textColor={isDark ? '#9CA3AF' : '#6B7280'}
          style={styles.emptyDesc}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header
        label={t('DiscountCards.title', 'Complimentary Coupons')}
        btns={['back']}
        additionalBtnsProps={{
          back: {
            onPress: () => navigation.goBack(),
          },
        }}
      />

      {cardsLoading && (!cards || cards.length === 0) ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={activeColor} />
        </View>
      ) : (
        <FlatList
          data={cards || []}
          keyExtractor={(item, index) => String(item?.card_id ?? index)}
          renderItem={({ item }) => (
            <StampCardItem
              card={item}
              onPress={() => handleCardPress(item)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            (!cards || cards.length === 0) && styles.emptyListContent,
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={cardsLoading}
              onRefresh={loadCards}
              tintColor={activeColor}
              colors={[activeColor]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: 12,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDesc: {
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default DiscountCardsListScreen;
