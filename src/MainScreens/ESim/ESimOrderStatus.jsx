import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton/CommonButton';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import {
  checkoutEsim,
  getEsimOrderStatus,
  getEsimPackageHistory,
  getEsimProfile,
  getEsimReturnUrl,
  getEsimTopupHistory,
} from '../../api/esim';
import {
  formatEsimDate,
  formatEsimDateTime,
  formatPrice,
  formatRemainingData,
  getRememberedEsimCheckout,
  hideCancelledEsimOrder,
  esimStatusTone,
  formatEsimProviderStatus,
  isEsimPaid,
  pickActiveUsage,
  rememberEsimCheckout,
  resolveEsimLpa,
} from './esimUtils';

const CopyRow = ({ label, value, copyLabel, isDark, onCopy }) => {
  if (!value) {
    return null;
  }
  return (
    <TouchableOpacity
      style={[
        styles.copyRow,
        {
          borderBottomColor: isDark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.06)',
        },
      ]}
      onPress={() => onCopy(value)}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <TypographyText
          title={label}
          size={12}
          font={LUSAIL_REGULAR}
          textColor={isDark ? '#8E8E93' : '#6B7280'}
        />
        <TypographyText
          title={value}
          size={13}
          font={LUSAIL_REGULAR}
          textColor={isDark ? colors.white : colors.black}
          style={{ marginTop: 4 }}
        />
      </View>
      <TypographyText
        title={copyLabel}
        size={13}
        font={LUSAIL_REGULAR}
        textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
        style={{ fontWeight: '700' }}
      />
    </TouchableOpacity>
  );
};

const ESimOrderStatus = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const userId = useSelector(state => state.authReducer.userId);
  const { orderReference, initialStatus } = route.params || {};
  const [status, setStatus] = useState(initialStatus || null);
  const [profile, setProfile] = useState(null);
  const [usage, setUsage] = useState(null);
  const [topupHistory, setTopupHistory] = useState([]);
  const [loading, setLoading] = useState(!initialStatus);
  const [retrying, setRetrying] = useState(false);

  const paid = isEsimPaid(status);
  const remembered = getRememberedEsimCheckout(orderReference);
  const payUrl = status?.payment?.pay_url || remembered?.payUrl;
  const canRetry =
    !paid && (status?.can_retry_payment || !!payUrl || !!remembered?.packageId);
  const accent = isDark ? colors.mainDarkMode : colors.darkBlue;

  const loadPaidExtras = useCallback(
    async reference => {
      const [esim, history, topups] = await Promise.all([
        getEsimProfile(reference).catch(() => null),
        getEsimPackageHistory(reference).catch(() => null),
        getEsimTopupHistory(reference).catch(() => null),
      ]);
      setProfile(esim);
      setUsage(pickActiveUsage(history?.items));
      setTopupHistory(topups?.items || []);
    },
    [],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const next = initialStatus || (await getEsimOrderStatus(orderReference));
        if (!mounted) {
          return;
        }
        setStatus(next);
        if (isEsimPaid(next)) {
          await loadPaidExtras(orderReference);
        }
      } catch (error) {
        if (mounted) {
          Alert.alert(t('General.error'), error.message);
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
  }, [initialStatus, loadPaidExtras, orderReference, t]);

  const copyValue = value => {
    if (!value) {
      return;
    }
    Clipboard.setString(String(value));
    Alert.alert(t('General.copied'));
  };

  const shareEsim = async () => {
    const iccid = profile?.iccid;
    const lpa = resolveEsimLpa(profile);
    const message = [iccid && `ICCID: ${iccid}`, lpa && `LPA: ${lpa}`]
      .filter(Boolean)
      .join('\n');
    try {
      await Share.open({ message, title: t('ESim.shareEsim') });
    } catch (error) {
      if (error?.message !== 'User did not share') {
        Alert.alert(t('General.error'), error?.message);
      }
    }
  };

  const retryPayment = async () => {
    if (payUrl) {
      navigation.navigate('ESimPayment', {
        payUrl,
        orderReference,
        packageTitle: status?.package?.title,
      });
      return;
    }
    const packageId = remembered?.packageId;
    if (!packageId) {
      Alert.alert(t('General.error'), t('ESim.retryUnavailable'));
      return;
    }
    setRetrying(true);
    try {
      const data = await checkoutEsim(packageId, getEsimReturnUrl());
      rememberEsimCheckout(data?.order_reference || orderReference, {
        payUrl: data?.payment?.pay_url,
        packageId,
      });
      navigation.navigate('ESimPayment', {
        payUrl: data?.payment?.pay_url,
        orderReference: data?.order_reference || orderReference,
        packageTitle: data?.package?.title || status?.package?.title,
      });
    } catch (error) {
      Alert.alert(t('General.error'), error.message || t('ESim.checkoutFailed'));
    } finally {
      setRetrying(false);
    }
  };

  const cancelPayment = () => {
    Alert.alert(t('ESim.cancelPayment'), t('ESim.cancelPaymentBody'), [
      { text: t('General.close'), style: 'cancel' },
      {
        text: t('ESim.cancelPayment'),
        style: 'destructive',
        onPress: async () => {
          await hideCancelledEsimOrder(orderReference, userId);
          navigation.navigate('ESimOrders');
        },
      },
    ]);
  };

  const secondaryBtn = {
    marginTop: 12,
    backgroundColor: isDark ? '#2E2E2E' : '#E5E7EB',
  };
  const statusTone = esimStatusTone(usage);
  const packageStatus = formatEsimProviderStatus(usage, t);
  const coverage =
    status?.package?.destination_name ||
    status?.package?.destination ||
    status?.package?.country_name ||
    status?.destination?.name ||
    '';
  const purchasedAt =
    status?.paid_at ||
    status?.created_at ||
    status?.create_date ||
    status?.payment?.paid_at;
  const lastUpdated =
    usage?.updated_at || usage?.last_updated || status?.updated_at;
  const lpa = resolveEsimLpa(profile);

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESim.orderStatus')} btns={['back']} />}
      headerHeight={50}
      contentStyle={styles.content}
    >
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={accent} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <TypographyText
            title={
              paid ? t('ESim.paymentSuccess') : t('ESim.paymentPending')
            }
            size={20}
            font={LUSAIL_REGULAR}
            textColor={isDark ? colors.white : colors.black}
            style={{ fontWeight: '700', marginBottom: 8 }}
          />
          <TypographyText
            title={status?.package?.title || ''}
            size={15}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#B1B1B4' : '#616060'}
          />
          <TypographyText
            title={orderReference}
            size={13}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#8E8E93' : '#6B7280'}
            style={{ marginTop: 4, marginBottom: 20 }}
          />

          {paid ? (
            <View
              style={[
                styles.caution,
                {
                  backgroundColor: isDark
                    ? 'rgba(221,189,107,0.16)'
                    : '#FDF6E3',
                },
              ]}
            >
              <TypographyText
                title={t('ESim.installOnceCaution')}
                size={13}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                style={{ lineHeight: 18 }}
              />
            </View>
          ) : null}

          {paid ? (
            <View
              style={[
                styles.card,
                { backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6' },
              ]}
            >
              <TypographyText
                title={t('ESim.packages')}
                size={16}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.white : colors.black}
                style={{ fontWeight: '700', marginBottom: 12 }}
              />
              <View style={styles.packageRow}>
                <TypographyText
                  title={status?.package?.title || ''}
                  size={14}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? colors.white : colors.black}
                  style={{ flex: 1, paddingRight: 8 }}
                />
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        statusTone === 'success'
                          ? 'rgba(84,194,97,0.18)'
                          : statusTone === 'ended'
                          ? isDark
                            ? 'rgba(255,255,255,0.12)'
                            : 'rgba(0,0,0,0.08)'
                          : isDark
                          ? 'rgba(221,189,107,0.2)'
                          : 'rgba(148,0,55,0.1)',
                    },
                  ]}
                >
                  <TypographyText
                    title={packageStatus}
                    size={12}
                    font={LUSAIL_REGULAR}
                    textColor={
                      statusTone === 'success'
                        ? colors.success
                        : statusTone === 'ended'
                        ? isDark
                          ? '#B1B1B4'
                          : '#6B7280'
                        : isDark
                        ? colors.mainDarkMode
                        : colors.darkBlue
                    }
                    style={{ fontWeight: '700' }}
                  />
                </View>
              </View>
            </View>
          ) : null}

          {paid ? (
            <View
              style={[
                styles.card,
                { backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6' },
              ]}
            >
              <TypographyText
                title={t('ESim.dataUsage')}
                size={16}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.white : colors.black}
                style={{ fontWeight: '700', marginBottom: 8 }}
              />
              <TypographyText
                title={formatRemainingData(usage, t)}
                size={18}
                font={LUSAIL_REGULAR}
                textColor={accent}
                style={{ fontWeight: '700' }}
              />
              {usage?.expired_at ? (
                <TypographyText
                  title={`${t('ESim.expires')}: ${formatEsimDate(
                    usage.expired_at,
                  )}`}
                  size={13}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? '#B1B1B4' : '#616060'}
                  style={{ marginTop: 4 }}
                />
              ) : null}
            </View>
          ) : null}

          {paid && (coverage || purchasedAt || lastUpdated) ? (
            <View
              style={[
                styles.card,
                { backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6' },
              ]}
            >
              <TypographyText
                title={t('ESim.details')}
                size={16}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.white : colors.black}
                style={{ fontWeight: '700', marginBottom: 8 }}
              />
              {coverage ? (
                <TypographyText
                  title={`${t('ESim.coverage')}: ${coverage}`}
                  size={13}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? '#B1B1B4' : '#616060'}
                  style={{ marginTop: 4 }}
                />
              ) : null}
              {purchasedAt ? (
                <TypographyText
                  title={`${t('ESim.purchasedDate')}: ${formatEsimDate(
                    purchasedAt,
                  )}`}
                  size={13}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? '#B1B1B4' : '#616060'}
                  style={{ marginTop: 4 }}
                />
              ) : null}
              {lastUpdated ? (
                <TypographyText
                  title={t('ESim.lastUpdated', {
                    time: formatEsimDateTime(lastUpdated),
                  })}
                  size={13}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? '#B1B1B4' : '#616060'}
                  style={{ marginTop: 4 }}
                />
              ) : null}
            </View>
          ) : null}

          {paid ? (
            <>
              <CopyRow
                label={t('ESim.iccid')}
                value={profile?.iccid}
                copyLabel={t('General.copy')}
                isDark={isDark}
                onCopy={copyValue}
              />
              <CopyRow
                label={t('ESim.lpa')}
                value={lpa}
                copyLabel={t('General.copy')}
                isDark={isDark}
                onCopy={copyValue}
              />
            </>
          ) : null}

          {paid && topupHistory.length ? (
            <View style={{ marginTop: 20 }}>
              <TypographyText
                title={t('ESim.topupHistory')}
                size={16}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.white : colors.black}
                style={{ fontWeight: '700', marginBottom: 8 }}
              />
              {topupHistory.map(item => (
                <View
                  key={item.topup_reference}
                  style={[
                    styles.historyRow,
                    {
                      borderBottomColor: isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.06)',
                    },
                  ]}
                >
                  <TypographyText
                    title={item.title}
                    size={14}
                    font={LUSAIL_REGULAR}
                    textColor={isDark ? colors.white : colors.black}
                    style={{ flex: 1, fontWeight: '600' }}
                  />
                  <TypographyText
                    title={formatPrice(item.amount, item.currency)}
                    size={13}
                    font={LUSAIL_REGULAR}
                    textColor={accent}
                    style={{ fontWeight: '700' }}
                  />
                </View>
              ))}
            </View>
          ) : null}

          {paid ? (
            <>
              <CommonButton
                label={
                  Platform.OS === 'ios'
                    ? t('ESim.installEsim')
                    : t('ESim.qrCode')
                }
                style={{ marginTop: 24 }}
                textColor={isDark ? colors.black : colors.white}
                onPress={() =>
                  navigation.navigate('ESimInstall', {
                    orderReference,
                    initialProfile: profile,
                  })
                }
              />
              <CommonButton
                label={t('ESim.howToActivate')}
                style={secondaryBtn}
                textColor={isDark ? colors.white : colors.darkBlue}
                onPress={() =>
                  navigation.navigate('ESimActivation', {
                    orderReference,
                    initialProfile: profile,
                  })
                }
              />
              {lpa || profile?.iccid ? (
                <CommonButton
                  label={t('ESim.shareEsim')}
                  style={secondaryBtn}
                  textColor={isDark ? colors.white : colors.darkBlue}
                  onPress={shareEsim}
                />
              ) : null}
              {profile && profile.recharge_eligible !== false ? (
                <CommonButton
                  label={t('ESim.topUp')}
                  style={secondaryBtn}
                  textColor={isDark ? colors.white : colors.darkBlue}
                  onPress={() =>
                    navigation.navigate('ESimTopups', { orderReference })
                  }
                />
              ) : null}
            </>
          ) : (
            <>
              {canRetry ? (
                <CommonButton
                  label={t('ESim.retryPayment')}
                  style={{ marginTop: 24 }}
                  loading={retrying}
                  onPress={retryPayment}
                />
              ) : null}
              <CommonButton
                label={t('ESim.cancelPayment')}
                style={canRetry ? secondaryBtn : { marginTop: 24 }}
                textColor={isDark ? colors.white : colors.darkBlue}
                onPress={cancelPayment}
              />
            </>
          )}

          <CommonButton
            label={t('ESim.myEsims')}
            style={secondaryBtn}
            textColor={isDark ? colors.white : colors.darkBlue}
            onPress={() => navigation.navigate('ESimOrders')}
          />
          <CommonButton
            label={t('ESim.buyNew')}
            style={secondaryBtn}
            textColor={isDark ? colors.white : colors.darkBlue}
            onPress={() => navigation.navigate('ESimCountries')}
          />
        </ScrollView>
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  caution: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  packageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});

export default ESimOrderStatus;
