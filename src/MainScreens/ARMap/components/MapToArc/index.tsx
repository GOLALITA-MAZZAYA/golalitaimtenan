// src\components\AR\components\MapTopArc.tsx
import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = { width: number; height: number; bg?: string };

export default function MapTopArc({ width, height, bg = "#000" }: Props) {
  const arcHeight = Math.min(60, Math.floor(height * 0.35));
  const w = width;
  const h = arcHeight;
  const d = `M0,${h} C ${w * 0.25},0 ${w * 0.75},0 ${w},${h} L ${w},${h + 40} L 0,${h + 40} Z`;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: -1,
        left: 0,
        right: 0,
        height: h + 40,
      }}
    >
      <Svg width={w} height={h + 40}>
        <Path d={d} fill={bg} />
      </Svg>
    </View>
  );
}
