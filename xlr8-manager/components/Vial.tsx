import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

interface VialProps {
  size?: number;
  color?: string;
}

export function Vial({ size = 24, color = '#FF5A1F' }: VialProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="2" rx="1" fill={color} />
      <Path
        d="M10 4v7l-4 8a2 2 0 0 0 1.8 2.9h8.4A2 2 0 0 0 18 19l-4-8V4h-4z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <Circle cx="12" cy="17" r="1.5" fill={color} opacity={0.6} />
    </Svg>
  );
}
