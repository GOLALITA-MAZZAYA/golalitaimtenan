import { useEffect, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { TypographyText } from '../Typography';
import { colors } from '../colors';
import { useTheme } from '../ThemeProvider';
import { org } from '../../org/config';

const PrivacyOverlay = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(AppState.currentState !== 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      setIsVisible(nextState !== 'active');
    });

    return () => subscription.remove();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[
        styles.overlay,
        { backgroundColor: isDark ? colors.darkModeBackground : colors.darkBlue },
      ]}
    >
      <TypographyText
        title={org.displayName}
        textColor="#FFFFFF"
        size={24}
        style={styles.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
  },
});

export default PrivacyOverlay;
