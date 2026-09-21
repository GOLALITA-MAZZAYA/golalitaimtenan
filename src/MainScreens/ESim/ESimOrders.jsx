import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import ListNoData from '../../components/ListNoData';
import { getEsimOrders } from '../../api/esim';
import {
  formatPrice,
  getCancelledEsimOrders,
  isEsimPaid,
  unhideCancelledEsimOrder,
  withoutCancelledEsimOrders,
} from './esimUtils';
import { isRTL } from '../../../utils';

const PAGE_SIZE = 20;
const FILTERS = [
  { value: 'all', labelKey: 'ESim.filterAll' },
  { value: 'paid', labelKey: 'ESim.filterPaid' },
  { value: 'pending', labelKey: 'ESim.filterPending' },
];

const matchesFilter = (item, filter) => {
  if (filter === 'all') {
    return true;
  }
  const paid = isEsimPaid(item);
  return filter === 'paid' ? paid : !paid;
};

const ESimOrders = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const userId = useSelector(state => state.authReducer.userId);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async (nextPage, nextFilter, append) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setItems([]);
    }
    try {
      const data = await getEsimOrders({
        page: nextPage,
        limit: PAGE_SIZE,
        payment_state: nextFilter === 'all' ? undefined : nextFilter,
      });
      const cancelled = await getCancelledEsimOrders(userId);
      const filtered = (data?.items || []).filter(item =>
        matchesFilter(item, nextFilter),
      );
      const incoming = withoutCancelledEsimOrders(filtered, cancelled);
      incoming.forEach(item => {
        if (isEsimPaid(item) && cancelled.has(item.order_reference)) {
          unhideCancelledEsimOrder(item.order_reference, userId);
        }
      });
      const hiddenCount = filtered.length - incoming.length;
      setTotal(Math.max(0, (data?.total ?? incoming.length) - hiddenCount));
      setItems(prev => (append ? [...prev, ...incoming] : incoming));
      setPage(nextPage);
    } catch (error) {
      if (!append) {
        setItems([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load(1, filter, false);
    }, [filter, load]),
  );

  const accent = isDark ? colors.mainDarkMode : colors.darkBlue;
  const hasMore = items.length < total;

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESim.myEsims')} btns={['back']} />}
      headerHeight={50}
      contentStyle={styles.content}
    >
      <View
        style={[
          styles.tabs,
          {
            flexDirection: isRTL() ? 'row-reverse' : 'row',
            backgroundColor: isDark ? colors.navyBlue : '#F5F5F5',
          },
        ]}
      >
        {FILTERS.map(item => {
          const active = filter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.tab,
                active && {
                  backgroundColor: isDark ? colors.darkBlue : colors.white,
                },
              ]}
              onPress={() => setFilter(item.value)}
            >
              <TypographyText
                title={t(item.labelKey)}
                size={13}
                font={LUSAIL_REGULAR}
                textColor={
                  active
                    ? isDark
                      ? colors.white
                      : colors.darkBlue
                    : isDark
                    ? colors.white
                    : colors.darkBlue
                }
                style={active ? { fontWeight: '700' } : undefined}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={accent} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.order_reference}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (!loadingMore && hasMore && items.length > 0) {
              load(page + 1, filter, true);
            }
          }}
          ListEmptyComponent={<ListNoData text={t('ESim.noOrders')} />}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                style={{ marginVertical: 16 }}
                color={accent}
              />
            ) : null
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.navyBlue : '#F5F5F5',
                },
              ]}
              onPress={() =>
                navigation.navigate('ESimOrderStatus', {
                  orderReference: item.order_reference,
                })
              }
            >
              <TypographyText
                title={item.package_title || item.destination}
                size={16}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.white : colors.black}
                style={{ fontWeight: '700' }}
              />
              <TypographyText
                title={`${item.destination || ''} • ${item.data || ''}`}
                size={13}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.lightGrey : '#616060'}
                style={{ marginTop: 4 }}
              />
              <View style={styles.meta}>
                <TypographyText
                  title={formatPrice(item.total_price, item.currency)}
                  size={14}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? colors.white : colors.darkBlue}
                  style={{ fontWeight: '700' }}
                />
                <TypographyText
                  title={
                    isEsimPaid(item)
                      ? t('ESim.filterPaid')
                      : t('ESim.filterPending')
                  }
                  size={12}
                  font={LUSAIL_REGULAR}
                  textColor={
                    isEsimPaid(item)
                      ? isDark
                        ? colors.lightGreen
                        : colors.green
                      : isDark
                      ? colors.orange
                      : '#B45309'
                  }
                  style={{ fontWeight: '700' }}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabs: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: 12,
    padding: 3,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default ESimOrders;
