import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { HELP_CATEGORIES } from './esimHelpArticles';
import ESimHelpRow from './ESimHelpRow';

const ESimHelp = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESim.helpCenter')} btns={['back']} />}
      headerHeight={50}
      contentStyle={styles.content}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TypographyText
          title={t('ESimHelp.help')}
          size={28}
          font={LUSAIL_REGULAR}
          textColor={isDark ? colors.white : colors.black}
          style={{ fontWeight: '700', marginBottom: 8 }}
        />
        <TypographyText
          title={t('ESim.helpIntro')}
          size={14}
          font={LUSAIL_REGULAR}
          textColor={isDark ? '#B1B1B4' : '#616060'}
          style={{ marginBottom: 16, lineHeight: 20 }}
        />
        {HELP_CATEGORIES.map(category => (
          <ESimHelpRow
            key={category.id}
            title={t(category.titleKey)}
            isDark={isDark}
            onPress={() =>
              navigation.navigate('ESimHelpTopic', { categoryId: category.id })
            }
          />
        ))}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ESimHelp;
