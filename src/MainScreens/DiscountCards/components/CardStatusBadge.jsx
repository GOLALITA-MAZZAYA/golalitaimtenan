import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TypographyText } from '../../../components/Typography';
import { LUSAIL_BOLD } from '../../../redux/types';
import { STATUS_COLORS } from '../cardStatus';

const STATUS_LABELS = {
  active: ['DiscountCards.statusActive', 'Active'],
  used: ['DiscountCards.statusUsed', 'Used'],
  expired: ['DiscountCards.expired', 'Expired'],
};

const CardStatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const color = STATUS_COLORS[status] || STATUS_COLORS.used;
  const [key, fallback] = STATUS_LABELS[status] || [null, String(status || '')];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}26` }]}>
      <TypographyText
        title={key ? t(key, fallback) : fallback}
        size={11}
        font={LUSAIL_BOLD}
        textColor={color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});

export default CardStatusBadge;
