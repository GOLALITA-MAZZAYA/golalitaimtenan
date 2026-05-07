import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const EnlargeIcon = ({ size = 24, color = '#000000', strokeWidth = 2, style }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      style={style}
    >
      {/* Outer Circle */}
      <Circle cx="12" cy="12" r="11" />
      {/* Top Right Bracket */}
      <Path d="M13 8 h3 v3" />
      {/* Bottom Left Bracket */}
      <Path d="M11 16 h-3 v-3" />
    </Svg>
  );
};

export default EnlargeIcon;
