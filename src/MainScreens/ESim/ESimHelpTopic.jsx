import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { getHelpCategory, HELP_SPECIAL } from './esimHelpArticles';
import ESimHelpRow from './ESimHelpRow';

const ESimHelpTopic = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const category = getHelpCategory(route.params?.categoryId);

  const openArticle = articleId => {
    if (HELP_SPECIAL[articleId] === 'devices') {
      navigation.navigate('ESimHelpDevices');
      return;
    }
    navigation.navigate('ESimHelpArticle', { articleId });
  };

  const articleTitle = articleId =>
    articleId === 'searchDevices'
      ? t('ESimHelp.searchDevices')
      : t(`ESimHelp.articles.${articleId}.title`);

  return (
    <MainLayout
      outsideScroll
      headerChildren={<Header label={t('ESimHelp.help')} btns={['back']} />}
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
          style={{ fontWeight: '700' }}
        />
        <TypographyText
          title={category ? t(category.titleKey) : ''}
          size={20}
          font={LUSAIL_REGULAR}
          textColor={isDark ? colors.white : colors.black}
          style={{ fontWeight: '700', marginBottom: 16, marginTop: 4 }}
        />
        {(category?.articles || []).map(articleId => (
          <ESimHelpRow
            key={articleId}
            title={articleTitle(articleId)}
            isDark={isDark}
            onPress={() => openArticle(articleId)}
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

export default ESimHelpTopic;
