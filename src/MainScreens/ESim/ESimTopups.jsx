import React, { useEffect, useState } from 'react';
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
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton/CommonButton';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import ListNoData from '../../components/ListNoData';
import { checkoutEsimTopup, getEsimReturnUrl, getEsimTopups } from '../../api/esim';
import { formatPlanLabel, formatPrice, rememberEsimCheckout, topupPrice } from './esimUtils';

const ESimTopups = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const orderReference = route.params?.orderReference;
  const isAuthorized = useSelector(state => state.authReducer.isAuthorized);
  const [items, setItems] = useState([]);
  const [canTopup, setCanTopup] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getEsimTopups(orderReference);
        if (!mounted) {
          return;
        }
        const list = data?.items || [];
        setItems(list);
        setCanTopup(data?.can_topup !== false);
        if (list.length) {
          setSelectedId(list[0].topup_package_id || list[0].id);
        }
      } catch (error) {
        if (mounted) {
          setItems([]);
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
  }, [orderReference]);

  const selected = items.find(
    item => (item.topup_package_id || item.id) === selectedId,
  );
  const accent = isDark ? colors.mainDarkMode : colors.darkBlue;

  const pay = async () => {
    if (!selected) {
      return;
    }
    if (!isAuthorized) {
      Alert.alert(t('ESim.loginRequired'), t('ESim.loginRequiredBody'));
      return;
    }
    setPaying(true);
    try {
      const data = await checkoutEsimTopup({
        order_reference: orderReference,
        topup_package_id: selected.topup_package_id,
        return_url: getEsimReturnUrl(),
      });
      rememberEsimCheckout(orderReference, {
        payUrl: data?.payment?.pay_url,
      });
      navigation.navigate('ESimPayment', {
        payUrl: data?.payment?.pay_url,
        orderReference: data?.original_order_reference || orderReference,
        topupReference: data?.topup_reference,
        packageTitle: selected.title,
      });
    } catch (error) {
      Alert.alert(t('General.error'), error.message || t('ESim.checkoutFailed'));
    } finally {
      setPaying(false);
    }
  };

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESim.topUp')} btns={['back']} />}
      headerHeight={50}
      contentStyle={styles.content}
    >
      {loading ? (
        <View style={styles.list}>
          <ActivityIndicator style={{ marginTop: 40 }} color={accent} />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={item => String(item.topup_package_id || item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <ListNoData
              text={
                canTopup ? t('ESim.noTopups') : t('ESim.topupUnavailable')
              }
            />
          }
          renderItem={({ item }) => {
            const id = item.topup_package_id || item.id;
            const active = id === selectedId;
            const price = topupPrice(item);
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
                  title={item.title || formatPlanLabel(item, t)}
                  size={15}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? colors.white : colors.black}
                  style={styles.planLabel}
                />
                <TypographyText
                  title={formatPrice(price.amount, price.currency)}
                  size={15}
                  font={LUSAIL_REGULAR}
                  textColor={active ? accent : isDark ? colors.white : colors.black}
                  style={styles.planPrice}
                />
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: active
                        ? accent
                        : isDark
                        ? '#8E8E93'
                        : '#9CA3AF',
                    },
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
          }}
        />
      )}

      <View style={styles.footer}>
        <CommonButton
          label={t('ESim.continueToPayment')}
          onPress={pay}
          loading={paying}
          disabled={!selected || !canTopup}
        />
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
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
});

export default ESimTopups;
