import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import CommonButton from '../../components/CommonButton/CommonButton';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';

const ESimReady = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { orderReference, initialStatus } = route.params || {};

  const goToOrder = () => {
    navigation.replace('ESimOrderStatus', {
      orderReference,
      initialStatus,
    });
  };

  return (
    <MainLayout
      outsideScroll
      headerChildren={
        <Header
          label={t('ESim.brandTitle')}
          btns={['back']}
          additionalBtnsProps={{
            back: { onPress: goToOrder },
          }}
        />
      }
      headerHeight={50}
      contentStyle={styles.content}
    >
      <View style={styles.hero}>
        <View style={styles.checkWrap}>
          <TypographyText
            title="✓"
            size={40}
            font={LUSAIL_REGULAR}
            textColor={colors.white}
            style={{ fontWeight: '700', marginTop: 4 }}
          />
        </View>
        <TypographyText
          title={t('ESim.readyTitle')}
          size={22}
          font={LUSAIL_REGULAR}
          textColor={isDark ? colors.white : colors.black}
          style={styles.title}
        />
        <TypographyText
          title={t('ESim.readyBody')}
          size={15}
          font={LUSAIL_REGULAR}
          textColor={isDark ? '#B1B1B4' : '#616060'}
          style={styles.body}
        />
      </View>
      <View style={styles.actions}>
        {Platform.OS === 'ios' ? (
          <CommonButton
            label={t('ESim.installEsim')}
            textColor={isDark ? colors.black : colors.white}
            onPress={() =>
              navigation.navigate('ESimInstall', { orderReference })
            }
          />
        ) : (
          <CommonButton
            label={t('ESim.qrCode')}
            textColor={isDark ? colors.black : colors.white}
            onPress={() =>
              navigation.navigate('ESimInstall', { orderReference })
            }
          />
        )}
        <CommonButton
          label={t('ESim.maybeLater')}
          style={{
            marginTop: 12,
            backgroundColor: isDark ? '#2E2E2E' : '#E5E7EB',
          }}
          textColor={isDark ? colors.white : colors.darkBlue}
          onPress={goToOrder}
        />
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  checkWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    paddingBottom: 32,
  },
});

export default ESimReady;
