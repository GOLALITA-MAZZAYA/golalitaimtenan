import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../components/ThemeProvider';
import { colors } from '../../components/colors';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../redux/types';
import StampCardItem from './components/StampCardItem';
import StampHistoryItem from './components/StampHistoryItem';
import StampMerchantItem from './components/StampMerchantItem';
import { getCustomerStampsApi, getStampMerchantsListApi } from '../../api/stampCard';
import Svg, { Circle, Path } from 'react-native-svg';

const EmptyStampIcon = ({ size = 64, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
    <Path
      d="M12 7V12L15 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TABS = [
  { key: 'merchants', labelKey: 'StampCards.tabStores', defaultLabel: 'Merchants' },
  { key: 'active', labelKey: 'StampCards.tabActive', defaultLabel: 'Active Cards' },
  { key: 'history', labelKey: 'StampCards.tabHistory', defaultLabel: 'History' },
];

const StampCardsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('merchants'); // 'merchants' | 'active' | 'history'
  const [activeCards, setActiveCards] = useState([]);
  const [historyCards, setHistoryCards] = useState([]);
  const [merchantsList, setMerchantsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTabData = useCallback(async (tab = activeTab, isPull = false) => {
    try {
      if (isPull) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      if (tab === 'active') {
        const cards = await getCustomerStampsApi({ status: 'active' });
        if (__DEV__) console.log('[STAMP_SCREEN] Active cards count:', cards?.length);
        setActiveCards(Array.isArray(cards) ? cards : []);
      } else if (tab === 'history') {
        const cards = await getCustomerStampsApi({ status: 'history' });
        if (__DEV__) console.log('[STAMP_SCREEN] History cards count:', cards?.length);
        setHistoryCards(Array.isArray(cards) ? cards : []);
      } else if (tab === 'merchants') {
        const res = await getStampMerchantsListApi({ limit: 30, offset: 0 });
        const list = res?.data || res?.merchants || [];
        if (__DEV__) console.log('[STAMP_SCREEN] Merchants count:', list?.length);
        setMerchantsList(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error(`Failed to load stamp data for tab ${tab}:`, err);
      if (tab === 'active') setActiveCards([]);
      else if (tab === 'history') setHistoryCards([]);
      else if (tab === 'merchants') setMerchantsList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  const handleTabChange = (tabKey) => {
    if (tabKey === activeTab) return;
    setActiveTab(tabKey);
  };

  const backgroundColor = isDark ? colors.darkModeBackground : colors.white;
  const activeColor = colors.main || '#C29F54';
  const tabBg = isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6';

  const getCurrentData = () => {
    if (activeTab === 'active') return activeCards;
    if (activeTab === 'history') return historyCards;
    return merchantsList;
  };

  const renderItem = ({ item }) => {
    if (activeTab === 'active') {
      return <StampCardItem card={item} />;
    }
    if (activeTab === 'history') {
      return <StampHistoryItem card={item} />;
    }
    return <StampMerchantItem merchant={item} />;
  };

  const renderEmptyState = () => {
    if (loading) return null;

    let emptyTitle = '';
    let emptyDesc = '';

    if (activeTab === 'merchants') {
      emptyTitle = t('StampCards.noStores', 'No participating merchants found');
      emptyDesc = t('StampCards.noStoresDesc', 'Participating merchants will appear here soon.');
    } else if (activeTab === 'history') {
      emptyTitle = t('StampCards.noHistory', 'No redemption history yet');
      emptyDesc = t(
        'StampCards.noHistoryDesc',
        'Your completed stamp programs and redeemed discount receipts will appear here.'
      );
    } else {
      emptyTitle = t('StampCards.noCards', 'No stamp cards yet');
      emptyDesc = t(
        'StampCards.noCardsDesc',
        'Visit participating merchants and complete purchases to automatically collect stamps!'
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View
          style={[
            styles.emptyIconCircle,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6' },
          ]}
        >
          <EmptyStampIcon size={56} color={isDark ? '#6B7280' : '#9CA3AF'} />
        </View>
        <TypographyText
          title={emptyTitle}
          size={16}
          font={LUSAIL_BOLD}
          textColor={isDark ? colors.white : colors.black}
          style={styles.emptyTitle}
        />
        <TypographyText
          title={emptyDesc}
          size={13}
          font={LUSAIL_REGULAR}
          textColor={isDark ? '#9CA3AF' : '#6B7280'}
          style={styles.emptyDesc}
        />
      </View>
    );
  };

  const currentData = getCurrentData();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header
        label={t('StampCards.title', 'Loyalty Stamps')}
        btns={['back']}
        additionalBtnsProps={{
          back: {
            onPress: () => navigation.goBack(),
          },
        }}
      />

      {/* 3-Tab Segmented Control */}
      <View style={[styles.tabBarContainer, { backgroundColor: tabBg }]}>
        {TABS.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabBtn,
                isSelected && [styles.tabBtnActive, { backgroundColor: activeColor }],
              ]}
              onPress={() => handleTabChange(tab.key)}
              activeOpacity={0.8}
            >
              <TypographyText
                title={t(tab.labelKey, tab.defaultLabel)}
                size={12}
                font={isSelected ? LUSAIL_BOLD : LUSAIL_REGULAR}
                textColor={isSelected ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#4B5563')}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={activeColor} />
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item, index) =>
            String(item.card_id || item.merchant_id || item.rule_id || index)
          }
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            currentData.length === 0 && styles.emptyListContent,
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchTabData(activeTab, true)}
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
  tabBarContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  tabBtnActive: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
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

export default StampCardsScreen;

