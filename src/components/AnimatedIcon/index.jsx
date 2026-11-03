import { Animated, View } from 'react-native';
import CompassSvg from '../../assets/compass.svg';
import { useTheme } from '../ThemeProvider';
import { useEffect } from 'react';
import { colors } from '../colors';
import { sized } from '../../Svg';

const animation = new Animated.Value(0);

const CompassIcon = sized(CompassSvg, 24, 23);

const Icon = ({ color }) => {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const iconColor = isDark ? colors.black : colors.white;

  return (
    <View
      style={{
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color ? color : backgroundColor,
          borderRadius: 15,
        }}
      >
        <CompassIcon color={iconColor} />
      </View>
    </View>
  );
};

const AnimatedIcon = ({ animated = true, color }) => {
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '270deg'],
  });

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [animated]);

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Icon color={color} />
    </Animated.View>
  );
};

export default AnimatedIcon;
