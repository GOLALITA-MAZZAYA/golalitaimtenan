import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import ESimHelpRichText from './ESimHelpRichText';

const ESimHelpArticle = ({ route }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const articleId = route.params?.articleId;
  const title = t(`ESimHelp.articles.${articleId}.title`);
  const body = t(`ESimHelp.articles.${articleId}.body`);

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
          title={title}
          size={22}
          font={LUSAIL_REGULAR}
          textColor={isDark ? colors.white : colors.black}
          style={{ fontWeight: '700', marginBottom: 16 }}
        />
        <ESimHelpRichText text={body} isDark={isDark} />
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

export default ESimHelpArticle;
