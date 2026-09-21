import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton/CommonButton';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { sized } from '../../Svg';
import EsimSvg from '../../assets/esim.svg';
import PlanetSvg from '../../assets/planet.svg';

const ESimLanding = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const iconColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const GlobeIcon = sized(PlanetSvg, 72, 72, iconColor);
  const SimIcon = sized(EsimSvg, 40, 40, iconColor);

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESim.brandTitle')} btns={['back']} />}
      headerHeight={50}
      contentStyle={styles.content}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        <View style={styles.hero}>
          <View style={styles.iconRow}>
            <SimIcon />
            <GlobeIcon />
          </View>
          <TypographyText
            title={t('ESim.headline')}
            textColor={isDark ? colors.white : colors.black}
            size={22}
            font={LUSAIL_REGULAR}
            style={styles.headline}
          />
          <TypographyText
            title={t('ESim.subtitle')}
            textColor={isDark ? '#B1B1B4' : '#616060'}
            size={15}
            font={LUSAIL_REGULAR}
            style={styles.body}
          />
        </View>

        <View style={styles.actions}>
          <CommonButton
            label={t('ESim.buyNew')}
            onPress={() => navigation.navigate('ESimCountries')}
          />
          <CommonButton
            label={t('ESim.myEsims')}
            style={{
              marginTop: 12,
              backgroundColor: isDark ? '#1C1C1E' : '#E5E7EB',
            }}
            textColor={isDark ? colors.white : colors.darkBlue}
            onPress={() => navigation.navigate('ESimOrders')}
          />
          <CommonButton
            label={t('ESim.helpCenter')}
            style={{
              marginTop: 12,
              backgroundColor: isDark ? '#2E2E2E' : '#F3F4F6',
            }}
            textColor={isDark ? colors.white : colors.darkBlue}
            onPress={() => navigation.navigate('ESimHelp')}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 110,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headline: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
  },
});

export default ESimLanding;
