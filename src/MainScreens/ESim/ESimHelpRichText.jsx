import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { isRTL } from '../../../utils';

const splitBold = (value, isDark, size, extraStyle) => {
  const parts = String(value || '').split(/(\*\*[^*]+\*\*)/g);
  const color = isDark ? colors.white : colors.black;
  return (
    <Text
      style={[
        {
          color,
          fontSize: size,
          fontFamily: LUSAIL_REGULAR,
          textAlign: isRTL() ? 'right' : 'left',
          lineHeight: size + 6,
        },
        extraStyle,
      ]}
    >
      {parts.map((part, index) => {
        const bold = part.startsWith('**') && part.endsWith('**');
        const text = bold ? part.slice(2, -2) : part;
        return (
          <Text key={`${index}-${text}`} style={bold ? { fontWeight: '700' } : undefined}>
            {text}
          </Text>
        );
      })}
    </Text>
  );
};

const ESimHelpRichText = ({ text, isDark }) => {
  const lines = String(text || '').split('\n');
  return (
    <View>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <View key={`sp-${index}`} style={{ height: 10 }} />;
        }
        if (trimmed.startsWith('## ')) {
          return (
            <TypographyText
              key={`h-${index}`}
              title={trimmed.slice(3)}
              size={17}
              font={LUSAIL_REGULAR}
              textColor={isDark ? colors.white : colors.black}
              style={styles.heading}
            />
          );
        }
        if (trimmed.startsWith('- ')) {
          return (
            <View
              key={`li-${index}`}
              style={[
                styles.bulletRow,
                { flexDirection: isRTL() ? 'row-reverse' : 'row' },
              ]}
            >
              <TypographyText
                title="•"
                size={16}
                font={LUSAIL_REGULAR}
                textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                style={styles.bulletMark}
              />
              <View style={{ flex: 1 }}>
                {splitBold(trimmed.slice(2), isDark, 15)}
              </View>
            </View>
          );
        }
        return (
          <View key={`p-${index}`} style={{ marginBottom: 4 }}>
            {splitBold(trimmed, isDark, 15)}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletMark: {
    width: 16,
    marginTop: 1,
  },
});

export default ESimHelpRichText;
