import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

type Props = {
  size?: number;
};

/**
 * Custom filled phone/handset icon used for the "Continue with Phone"
 * sign-in option. Rendered as SVG with a subtle brand-green gradient so it
 * reads as a polished branded glyph rather than a thin outline.
 */
export default function PhoneIcon({ size = 22 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="phoneGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#2E8B57" />
          <Stop offset="1" stopColor="#1B6B3A" />
        </LinearGradient>
      </Defs>
      <Path
        fill="url(#phoneGrad)"
        d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1.02 1.02 0 0 1 1.05-.24c1.16.38 2.4.59 3.67.59a1 1 0 0 1 1 1v3.49a1 1 0 0 1-1 1A17.85 17.85 0 0 1 2.5 4.75a1 1 0 0 1 1-1H7a1 1 0 0 1 1 1c0 1.28.2 2.51.59 3.67a1 1 0 0 1-.25 1.05l-2.2 2.2z"
      />
    </Svg>
  );
}
