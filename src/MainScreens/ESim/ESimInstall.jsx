import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton/CommonButton';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR, BALOO_SEMIBOLD } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { sized } from '../../Svg';
import EsimSvg from '../../assets/esim.svg';
import { getEsimProfile } from '../../api/esim';
import ESimSegmentedTabs from './ESimSegmentedTabs';
import {
  installEsimOnDevice,
  isSandboxEsimProfile,
  resolveEsimInstallDetails,
  resolveEsimLpa,
  translationList,
} from './esimUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;

const NumberedSteps = ({ steps, isDark }) =>
  steps.map((step, index) => (
    <View key={`${index}-${step}`} style={styles.stepRow}>
      <View
        style={[
          styles.stepIndex,
          { backgroundColor: isDark ? colors.mainDarkMode : colors.darkBlue },
        ]}
      >
        <TypographyText
          title={String(index + 1)}
          size={12}
          font={LUSAIL_REGULAR}
          textColor={isDark ? colors.black : colors.white}
          style={{ fontWeight: '700' }}
        />
      </View>
      <TypographyText
        title={step}
        size={14}
        font={LUSAIL_REGULAR}
        textColor={isDark ? colors.white : colors.black}
        style={styles.stepText}
      />
    </View>
  ));

const ESimInstall = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { orderReference, initialProfile } = route.params || {};
  const [profile, setProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(!resolveEsimLpa(initialProfile));
  const [tab, setTab] = useState('qr');
  const [tipIndex, setTipIndex] = useState(0);
  const [pageW, setPageW] = useState(SCREEN_WIDTH - 40);
  const qrWrapRef = useRef(null);
  const pendingSystemInstall = useRef(false);
  const accent = isDark ? colors.mainDarkMode : colors.darkBlue;
  const SimIcon = sized(EsimSvg, 56, 56, accent);
  const tips = useMemo(
    () => translationList(t, 'ESim.installTips'),
    [t],
  );
  const lpa = resolveEsimLpa(profile);
  const { smdp, activationCode } = resolveEsimInstallDetails(profile);
  const manualSteps = translationList(
    t,
    Platform.OS === 'ios' ? 'ESim.manualIosSteps' : 'ESim.manualAndroidSteps',
  );

  const loadProfile = useCallback(async () => {
    if (!orderReference) {
      setLoading(false);
      return;
    }
    try {
      const next = await getEsimProfile(orderReference);
      setProfile(next);
    } catch (error) {
      if (!initialProfile) {
        Alert.alert(t('General.error'), error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [initialProfile, orderReference, t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const showInstallFallback = useCallback(() => {
    Alert.alert(
      t('ESim.installSettingsErrorTitle'),
      t('ESim.installSettingsErrorBody'),
      [
        {
          text: t('ESim.installUseQr'),
          onPress: () => setTab('qr'),
        },
        {
          text: t('ESim.installUseManual'),
          onPress: () => setTab('manual'),
        },
        { text: t('General.close'), style: 'cancel' },
      ],
    );
  }, [t]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active' || !pendingSystemInstall.current) {
        return;
      }
      pendingSystemInstall.current = false;
      showInstallFallback();
    });
    return () => sub.remove();
  }, [showInstallFallback]);

  const copyValue = value => {
    if (!value) {
      return;
    }
    Clipboard.setString(String(value));
    Alert.alert(t('General.copied'));
  };

  const shareQr = async () => {
    if (!lpa) {
      return;
    }
    const message = [profile?.iccid && `ICCID: ${profile.iccid}`, `LPA: ${lpa}`]
      .filter(Boolean)
      .join('\n');
    try {
      if (qrWrapRef.current) {
        const uri = await captureRef(qrWrapRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });
        await Share.open({
          url: uri,
          message,
          title: t('ESim.shareQr'),
        });
        return;
      }
      await Share.open({ message, title: t('ESim.shareQr') });
    } catch (error) {
      if (error?.message !== 'User did not share') {
        Alert.alert(t('General.error'), error?.message);
      }
    }
  };

  const installOnDevice = async () => {
    if (isSandboxEsimProfile(profile)) {
      Alert.alert(t('ESim.installFailed'), t('ESim.sandboxInstallBody'));
      return;
    }
    try {
      pendingSystemInstall.current = false;
      await installEsimOnDevice({
        lpa,
        appleUrl: profile?.direct_apple_installation_url,
      });
      pendingSystemInstall.current = Platform.OS === 'android';
    } catch (error) {
      pendingSystemInstall.current = false;
      showInstallFallback();
    }
  };

  const secondaryBtn = {
    marginTop: 12,
    backgroundColor: isDark ? '#2E2E2E' : '#E5E7EB',
  };

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESim.installation')} btns={['back']} />}
      headerHeight={50}
      contentStyle={styles.content}
    >
      <ESimSegmentedTabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'qr', label: t('ESim.qrCode') },
          { value: 'manual', label: t('ESim.manual') },
        ]}
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={accent} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {tab === 'qr' ? (
            <>
              <View
                onLayout={event => {
                  const width = event.nativeEvent.layout.width;
                  if (width > 0 && Math.abs(width - pageW) > 1) {
                    setPageW(width);
                  }
                }}
              >
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={event => {
                    const next = Math.round(
                      event.nativeEvent.contentOffset.x / pageW,
                    );
                    setTipIndex(next);
                  }}
                >
                  {tips.map((item, index) => (
                    <View key={`${index}`} style={[styles.tipPage, { width: pageW }]}>
                      <SimIcon />
                      <TypographyText
                        title={item}
                        size={15}
                        font={LUSAIL_REGULAR}
                        textColor={isDark ? colors.white : colors.black}
                        style={styles.tipText}
                      />
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.dots}>
                  {tips.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            index === tipIndex
                              ? accent
                              : isDark
                              ? '#3A3A3C'
                              : '#D1D5DB',
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
              {lpa ? (
                <View ref={qrWrapRef} collapsable={false} style={styles.qrWrap}>
                  <QRCode value={lpa} size={180} />
                  <TypographyText
                    title={t('ESim.scanToInstall')}
                    size={14}
                    font={LUSAIL_REGULAR}
                    textColor={isDark ? '#B1B1B4' : '#616060'}
                    style={{ marginTop: 12, textAlign: 'center' }}
                  />
                </View>
              ) : (
                <TypographyText
                  title={t('ESim.usageUnavailable')}
                  size={14}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? '#B1B1B4' : '#616060'}
                  style={{ textAlign: 'center', marginVertical: 24 }}
                />
              )}
              {lpa ? (
                <>
                  <CommonButton
                    label={t('ESim.shareQr')}
                    textColor={isDark ? colors.black : colors.white}
                    onPress={shareQr}
                  />
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={installOnDevice}
                      style={[styles.installBtn, secondaryBtn]}
                    >
                      <TypographyText
                        title={t('ESim.installOnDevice')}
                        size={18}
                        font={BALOO_SEMIBOLD}
                        textColor={isDark ? colors.white : colors.darkBlue}
                        numberOfLines={2}
                        style={styles.installBtnLabel}
                      />
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <>
              <TypographyText
                title={t('ESim.manualIntro')}
                size={14}
                font={LUSAIL_REGULAR}
                textColor={isDark ? '#B1B1B4' : '#616060'}
                style={{ lineHeight: 20, marginBottom: 16 }}
              />
              {(smdp || activationCode) ? (
                <View
                  style={[
                    styles.card,
                    { backgroundColor: isDark ? '#1C1C1E' : '#F3F4F6' },
                  ]}
                >
                  {smdp ? (
                    <TouchableOpacity
                      onPress={() => copyValue(smdp)}
                      style={styles.manualField}
                    >
                      <TypographyText
                        title={t('ESim.smdpAddress')}
                        size={12}
                        font={LUSAIL_REGULAR}
                        textColor={isDark ? '#8E8E93' : '#6B7280'}
                      />
                      <TypographyText
                        title={smdp}
                        size={14}
                        font={LUSAIL_REGULAR}
                        textColor={isDark ? colors.white : colors.black}
                        style={{ marginTop: 6, lineHeight: 20 }}
                      />
                      <TypographyText
                        title={t('General.copy')}
                        size={13}
                        font={LUSAIL_REGULAR}
                        textColor={accent}
                        style={{ fontWeight: '700', marginTop: 8 }}
                      />
                    </TouchableOpacity>
                  ) : null}
                  {activationCode ? (
                    <TouchableOpacity
                      onPress={() => copyValue(activationCode)}
                      style={[
                        styles.manualField,
                        smdp && styles.manualFieldSpaced,
                        {
                          borderTopColor: isDark
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(0,0,0,0.06)',
                        },
                      ]}
                    >
                      <TypographyText
                        title={t('ESim.activationCode')}
                        size={12}
                        font={LUSAIL_REGULAR}
                        textColor={isDark ? '#8E8E93' : '#6B7280'}
                      />
                      <TypographyText
                        title={activationCode}
                        size={14}
                        font={LUSAIL_REGULAR}
                        textColor={isDark ? colors.white : colors.black}
                        style={{ marginTop: 6, lineHeight: 20 }}
                      />
                      <TypographyText
                        title={t('General.copy')}
                        size={13}
                        font={LUSAIL_REGULAR}
                        textColor={accent}
                        style={{ fontWeight: '700', marginTop: 8 }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
              <NumberedSteps steps={manualSteps} isDark={isDark} />
            </>
          )}
          <TouchableOpacity
            style={styles.helpLink}
            onPress={() => navigation.navigate('ESimHelp')}
          >
            <TypographyText
              title={t('ESim.helpCenter')}
              size={15}
              font={LUSAIL_REGULAR}
              textColor={accent}
              style={{ fontWeight: '700', textAlign: 'center' }}
            />
          </TouchableOpacity>
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
  tipPage: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tipText: {
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  qrWrap: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    padding: 16,
    borderRadius: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  manualField: {
    paddingBottom: 4,
  },
  manualFieldSpaced: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stepIndex: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginEnd: 10,
  },
  stepText: {
    flex: 1,
    lineHeight: 20,
  },
  helpLink: {
    marginTop: 24,
    paddingVertical: 8,
  },
  installBtn: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  installBtnLabel: {
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: 12,
    marginTop: 5,
  },
});

export default ESimInstall;
