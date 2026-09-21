import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { getEsimProfile } from '../../api/esim';
import ESimSegmentedTabs from './ESimSegmentedTabs';
import { translationList } from './esimUtils';

const defaultDevice = Platform.OS === 'ios' ? 'iphone' : 'samsung';

const ESimActivation = ({ route }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { orderReference, initialProfile } = route.params || {};
  const [profile, setProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(!initialProfile);
  const [device, setDevice] = useState(defaultDevice);
  const accent = isDark ? colors.mainDarkMode : colors.darkBlue;
  const apn = profile?.apn || t('ESim.apnPlaceholder');

  const loadProfile = useCallback(async () => {
    if (!orderReference) {
      setLoading(false);
      return;
    }
    try {
      const next = await getEsimProfile(orderReference);
      setProfile(next);
    } catch (error) {
      // Steps still work with the APN placeholder.
    } finally {
      setLoading(false);
    }
  }, [orderReference]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const steps = useMemo(() => {
    const key =
      device === 'samsung'
        ? 'ESim.samsungSteps'
        : device === 'pixel'
        ? 'ESim.pixelSteps'
        : 'ESim.iphoneSteps';
    return translationList(t, key, { apn }).map(step =>
      String(step).replace(/\{\{apn\}\}/g, apn),
    );
  }, [apn, device, t]);

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESim.activation')} btns={['back']} />}
      headerHeight={50}
      contentStyle={styles.content}
    >
      <ESimSegmentedTabs
        value={device}
        onChange={setDevice}
        tabs={[
          { value: 'iphone', label: t('ESim.iphone') },
          { value: 'samsung', label: t('ESim.samsung') },
          { value: 'pixel', label: t('ESim.pixel') },
        ]}
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={accent} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <TypographyText
            title={t('ESim.validityStarts')}
            size={14}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#B1B1B4' : '#616060'}
            style={{ lineHeight: 20, marginBottom: 20 }}
          />
          <TypographyText
            title={t('ESim.accessData')}
            size={18}
            font={LUSAIL_REGULAR}
            textColor={isDark ? colors.white : colors.black}
            style={{ fontWeight: '700', marginBottom: 16 }}
          />
          {steps.map((step, index) => (
            <View key={`${device}-${index}`} style={styles.stepRow}>
              <View
                style={[
                  styles.stepIndex,
                  { backgroundColor: accent },
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
          ))}
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
});

export default ESimActivation;
