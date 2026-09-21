import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton/CommonButton';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import ListNoData from '../../components/ListNoData';
import { checkoutEsim, getEsimPackages, getEsimReturnUrl } from '../../api/esim';
import { formatPlanLabel, formatPrice, getDestinationDisplayName, rememberEsimCheckout } from './esimUtils';
import { sized } from '../../Svg';
import InfoSvg from '../../assets/info.svg';
import { isRTL } from '../../../utils';

const ESimPlans = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const destination = route.params?.destination || {};
  const destinationName = getDestinationDisplayName(destination, i18n.language);
  const isAuthorized = useSelector(state => state.authReducer.isAuthorized);
  const [tab, setTab] = useState('standard');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getEsimPackages({
          country_code: destination.country_code,
          destination_id: destination.id,
          package_type: 'sim',
          sort: 'price_asc',
          page: 1,
          limit: 50,
        });
        if (mounted) {
          setPackages(data?.items || []);
        }
      } catch (error) {
        if (mounted) {
          setPackages([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [destination.country_code, destination.id]);

  const filtered = useMemo(() => {
    return packages.filter(pkg =>
      tab === 'unlimited' ? !!pkg.is_unlimited : !pkg.is_unlimited,
    );
  }, [packages, tab]);

  useEffect(() => {
    if (!filtered.length) {
      setSelectedId(null);
      return;
    }
    const still = filtered.find(
      pkg => (pkg.package_id || pkg.id) === selectedId,
    );
    if (!still) {
      setSelectedId(filtered[0].package_id || filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find(
    pkg => (pkg.package_id || pkg.id) === selectedId,
  );

  const accent = isDark ? colors.mainDarkMode : colors.darkBlue;
  const HelpIcon = sized(InfoSvg, 22, 22, accent);

  const openPayment = () => {
    if (!selected) {
      return;
    }
    setSheetVisible(true);
  };

  const payWithSkipCash = async () => {
    if (!selected) {
      return;
    }
    if (!isAuthorized) {
      Alert.alert(t('ESim.loginRequired'), t('ESim.loginRequiredBody'));
      return;
    }
    setPaying(true);
    try {
      const data = await checkoutEsim(
        selected.package_id,
        getEsimReturnUrl(),
      );
      rememberEsimCheckout(data?.order_reference, {
        payUrl: data?.payment?.pay_url,
        packageId: selected.package_id,
      });
      setSheetVisible(false);
      navigation.navigate('ESimPayment', {
        payUrl: data?.payment?.pay_url,
        orderReference: data?.order_reference,
        packageTitle: data?.package?.title || selected.title,
      });
    } catch (error) {
      Alert.alert(t('General.error'), error.message || t('ESim.checkoutFailed'));
    } finally {
      setPaying(false);
    }
  };

  const renderPlan = ({ item }) => {
    const id = item.package_id || item.id;
    const active = id === selectedId;
    return (
      <TouchableOpacity
        style={[
          styles.planRow,
          {
            borderBottomColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.06)',
          },
        ]}
        onPress={() => setSelectedId(id)}
        activeOpacity={0.7}
      >
        <TypographyText
          title={formatPlanLabel(item, t)}
          size={15}
          font={LUSAIL_REGULAR}
          textColor={isDark ? colors.white : colors.black}
          style={styles.planLabel}
        />
        <TypographyText
          title={formatPrice(item.total_price ?? item.price, item.currency)}
          size={15}
          font={LUSAIL_REGULAR}
          textColor={active ? accent : isDark ? colors.white : colors.black}
          style={styles.planPrice}
        />
        <View
          style={[
            styles.radio,
            { borderColor: active ? accent : isDark ? '#8E8E93' : '#9CA3AF' },
            active && { backgroundColor: accent },
          ]}
        >
          {active ? (
            <View
              style={[
                styles.radioDot,
                { backgroundColor: isDark ? '#000' : colors.white },
              ]}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout
      outsideScroll
      headerChildren={
        <Header
          label={destinationName || t('ESim.title')}
          btns={['back']}
          rightChildren={
            <TouchableOpacity
              onPress={() => navigation.navigate('ESimHelp')}
              accessibilityRole="button"
              accessibilityLabel={t('ESim.helpCenter')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.helpBtn}
            >
              <HelpIcon />
            </TouchableOpacity>
          }
        />
      }
      headerHeight={50}
      contentStyle={styles.content}
    >
      <View
        style={[
          styles.tabs,
          { flexDirection: isRTL() ? 'row-reverse' : 'row' },
        ]}
      >
        {[
          { value: 'standard', label: t('ESim.standard') },
          { value: 'unlimited', label: t('ESim.unlimited') },
        ].map(item => {
          const active = tab === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.tab,
                active &&
                  (isDark ? styles.tabActiveDark : styles.tabActiveLight),
              ]}
              onPress={() => setTab(item.value)}
            >
              <TypographyText
                title={item.label}
                size={13}
                font={LUSAIL_REGULAR}
                textColor={
                  active
                    ? isDark
                      ? colors.mainDarkModeText
                      : colors.white
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
        <View style={styles.list}>
          <ActivityIndicator
            style={{ marginTop: 40 }}
            color={accent}
          />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={item => String(item.package_id || item.id)}
          renderItem={renderPlan}
          ListEmptyComponent={<ListNoData />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.footer}>
        <CommonButton
          label={t('ESim.continueToPayment')}
          onPress={openPayment}
          disabled={!selected}
        />
      </View>

      <Modal
        isVisible={sheetVisible}
        onBackdropPress={() => setSheetVisible(false)}
        style={styles.modal}
        backdropOpacity={0.5}
      >
        <View
          style={[
            styles.sheet,
            { backgroundColor: isDark ? '#1C1C1E' : colors.white },
          ]}
        >
          <TypographyText
            title={t('ESim.planSheetTitle')}
            size={20}
            font={LUSAIL_REGULAR}
            textColor={isDark ? colors.white : colors.black}
            style={{ fontWeight: '700' }}
          />
          <TypographyText
            title={`${destination.name || ''} • ${
              selected ? formatPlanLabel(selected, t) : ''
            }`}
            size={14}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#B1B1B4' : '#616060'}
            style={{ marginTop: 6, marginBottom: 20 }}
          />

          <TypographyText
            title={t('ESim.payment')}
            size={16}
            font={LUSAIL_REGULAR}
            textColor={isDark ? colors.white : colors.black}
            style={{ fontWeight: '700', marginBottom: 10 }}
          />

          <View
            style={[
              styles.payRow,
              { backgroundColor: isDark ? '#2E2E2E' : '#F3F4F6' },
            ]}
          >
            <TypographyText
              title={t('ESim.skipCash')}
              size={16}
              font={LUSAIL_REGULAR}
              textColor={isDark ? colors.white : colors.black}
            />
          </View>

          <View style={styles.sheetFooter}>
            <TypographyText
              title={formatPrice(
                selected?.total_price ?? selected?.price,
                selected?.currency,
              )}
              size={20}
              font={LUSAIL_REGULAR}
              textColor={isDark ? colors.white : colors.black}
              style={{ fontWeight: '700' }}
            />
            <View style={{ width: 180 }}>
              <CommonButton
                label={t('ESim.pay')}
                loading={paying}
                onPress={payWithSkipCash}
              />
            </View>
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  helpBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  tabActiveLight: {
    backgroundColor: colors.darkBlue,
  },
  tabActiveDark: {
    backgroundColor: colors.mainDarkMode,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  planLabel: {
    flex: 1,
    fontWeight: '600',
  },
  planPrice: {
    fontWeight: '700',
    marginRight: 10,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },
  payRow: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
});

export default ESimPlans;
