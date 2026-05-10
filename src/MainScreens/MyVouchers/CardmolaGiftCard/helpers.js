import i18next from 'i18next';

export const getDescription = (translations) => {
  if (!translations) {
    return '';
  }

  const currentLang = i18next.language;

  const description = translations.find(
    (item) => item.lang === currentLang,
  )?.terms;

  return description || '';
};
