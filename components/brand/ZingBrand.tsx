import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

/**
 * Brand marks, ported 1:1 from the design system's SVG assets
 * (zing-design-system/project/assets/*.svg) to react-native-svg.
 * The bespoke Zing mark (tooth + spark) and the "Sparky" mascot.
 */

interface BrandProps {
  width?: number;
  height?: number;
}

function sized(viewW: number, viewH: number, props: BrandProps) {
  const { width, height } = props;
  if (width && height) return { width, height };
  if (width) return { width, height: (width / viewW) * viewH };
  if (height) return { width: (height / viewH) * viewW, height };
  return { width: viewW, height: viewH };
}

/** Mark + "Zing" wordmark in Nunito ExtraBold (dark), lockup centered in its canvas. */
export function ZingWordmark(props: BrandProps) {
  return (
    <Svg viewBox="0 0 300 100" fill="none" {...sized(300, 100, props)}>
      <G transform="translate(43.4,12.5) scale(0.62)">
        <Path
          d="M55 9C31 9 17 24 17 48c0 24 6 43 17 58 5 7 16 6 19-3l4-13c1-3 5-3 6 0l4 13c3 9 14 10 19 3 11-15 17-34 17-58 0-24-14-39-38-39Z"
          fill="#00C9A7"
        />
        <Path
          d="M69.3 20.9 L48.3 54.9 H59.3 L53.3 78.9 L74.3 44.9 H63.3 Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth={6}
          strokeLinejoin="round"
        />
      </G>
      <SvgText
        x={126.4}
        y={65}
        fontFamily="Nunito_800ExtraBold"
        fontWeight="800"
        fontSize={60}
        fill="#0F2027"
        letterSpacing={-1.5}
      >
        Zing
      </SvgText>
    </Svg>
  );
}

/** Sparky hero pose holding a toothbrush — brushing & coaching. */
export function ZingMascot(props: BrandProps) {
  return (
    <Svg viewBox="0 0 240 280" fill="none" {...sized(240, 280, props)}>
      <Defs>
        <LinearGradient id="sBody" x1="60" y1="34" x2="180" y2="250" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E9FBF5" />
        </LinearGradient>
        <LinearGradient id="sHandle" x1="0" y1="-11" x2="0" y2="11" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#5BC8F8" />
          <Stop offset="1" stopColor="#2BAEEE" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="120" cy="258" rx="66" ry="12" fill="#0F2027" opacity={0.08} />
      <Path
        d="M120 30C72 30 42 62 42 110c0 48 10 86 32 110 8 12 26 10 30-6l6-22c2-9 14-9 16 0l6 22c4 16 22 18 30 6 22-24 32-62 32-110 0-48-30-80-82-80Z"
        fill="url(#sBody)"
        stroke="#C2EFE3"
        strokeWidth={3.5}
      />
      <Path
        d="M78 60c-9 9-15 24-15 42 0 6 7 8 9 2 3-12 9-24 18-33 5-5-7-16-12-11Z"
        fill="#FFFFFF"
        opacity={0.6}
      />
      <G strokeLinecap="round" fill="none">
        <Path d="M94 208 124 192" stroke="#C2EFE3" strokeWidth={20} />
        <Path d="M150 208 166 181" stroke="#C2EFE3" strokeWidth={20} />
        <Path d="M94 208 124 192" stroke="#FFFFFF" strokeWidth={14} />
        <Path d="M150 208 166 181" stroke="#FFFFFF" strokeWidth={14} />
      </G>
      <Circle cx="78" cy="140" r="12" fill="#FF8FA0" opacity={0.55} />
      <Circle cx="162" cy="140" r="12" fill="#FF8FA0" opacity={0.55} />
      <Circle cx="100" cy="118" r="13" fill="#0F2027" />
      <Circle cx="140" cy="118" r="13" fill="#0F2027" />
      <Circle cx="104.5" cy="113" r="4.5" fill="#FFFFFF" />
      <Circle cx="144.5" cy="113" r="4.5" fill="#FFFFFF" />
      <Path
        d="M101 141c4 6 34 6 38 0 -3 18 -12 27 -19 27 -7 0 -16 -9 -19 -27Z"
        fill="#3A2A2E"
      />
      <Ellipse cx="120" cy="160" rx="9" ry="6" fill="#FF8FA0" />
      <G transform="translate(64,208) rotate(-14.5)">
        <Rect x="3" y="-27" width="24" height="15" rx="4" fill="#00C9A7" />
        <G stroke="#FFFFFF" strokeWidth={1.6} opacity={0.8}>
          <Line x1="9" y1="-25" x2="9" y2="-13" />
          <Line x1="15" y1="-25" x2="15" y2="-13" />
          <Line x1="21" y1="-25" x2="21" y2="-13" />
        </G>
        <Rect x="0" y="-13" width="30" height="26" rx="9" fill="#EAF8FF" stroke="#C9E9F5" strokeWidth={2} />
        <Rect x="28" y="-7" width="20" height="14" rx="6" fill="#BDE9FF" />
        <Rect x="44" y="-11" width="92" height="22" rx="11" fill="url(#sHandle)" />
        <Rect x="52" y="-8" width="76" height="5" rx="2.5" fill="#9DDBFA" opacity={0.85} />
        <Circle cx="62" cy="0" r="14" fill="#FFFFFF" stroke="#C2EFE3" strokeWidth={3} />
        <Circle cx="104" cy="0" r="14" fill="#FFFFFF" stroke="#C2EFE3" strokeWidth={3} />
      </G>
      <Path d="M186 40l5 14 14 5-14 5-5 14-5-14-14-5 14-5 5-14Z" fill="#FFCB3D" />
      <Circle cx="52" cy="44" r="6" fill="#4FC3F7" />
    </Svg>
  );
}
