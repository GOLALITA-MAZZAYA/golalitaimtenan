import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import WebView from 'react-native-webview';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { getEsimOrderStatus, getEsimTopupStatus } from '../../api/esim';
import { isEsimPaid, isPaymentReturnUrl } from './esimUtils';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';

const ESimPayment = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { payUrl, orderReference, topupReference, packageTitle } =
    route.params || {};
  const [checking, setChecking] = useState(false);
  const handled = useRef(false);

  const goToResult = useCallback(async () => {
    if (handled.current) {
      return;
    }
    if (!orderReference && !topupReference) {
      return;
    }
    handled.current = true;
    setChecking(true);
    try {
      if (topupReference) {
        await getEsimTopupStatus(topupReference);
        navigation.replace('ESimOrderStatus', { orderReference });
        return;
      }
      const status = await getEsimOrderStatus(orderReference);
      if (isEsimPaid(status)) {
        navigation.replace('ESimReady', {
          orderReference,
          initialStatus: status,
        });
        return;
      }
      navigation.replace('ESimOrderStatus', {
        orderReference,
        initialStatus: status,
      });
    } catch (error) {
      handled.current = false;
      setChecking(false);
    }
  }, [navigation, orderReference, topupReference]);

  useEffect(() => {
    if (!payUrl && (orderReference || topupReference)) {
      goToResult();
    }
  }, [goToResult, orderReference, payUrl, topupReference]);

  const onNavChange = navState => {
    if (isPaymentReturnUrl(navState?.url)) {
      goToResult();
    }
  };

  return (
    <MainLayout
      outsideScroll
      headerChildren={
        <Header
          label={packageTitle || t('ESim.payment')}
          btns={['back']}
          additionalBtnsProps={{
            back: {
              onPress: goToResult,
            },
          }}
        />
      }
      headerHeight={50}
      contentStyle={{ flex: 1 }}
    >
      {payUrl ? (
        <WebView
          source={{ uri: payUrl }}
          startInLoadingState
          javaScriptEnabled
          mixedContentMode="always"
          onNavigationStateChange={onNavChange}
          style={{ flex: 1 }}
        />
      ) : (
        <View style={styles.center}>
          <ActivityIndicator
            color={isDark ? colors.mainDarkMode : colors.darkBlue}
          />
        </View>
      )}
      {checking ? (
        <View style={styles.overlay}>
          <ActivityIndicator
            color={isDark ? colors.mainDarkMode : colors.darkBlue}
          />
        </View>
      ) : null}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ESimPayment;
