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

/** The Zing tooth + spark glyph (mint), bolt optically centered. */
export function ZingMark(props: BrandProps) {
  return (
    <Svg viewBox="0 0 120 120" fill="none" {...sized(120, 120, props)}>
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
    </Svg>
  );
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

/** Sparky celebrating (arms up) — rewards, streaks, "perfect" moments. */
export function SparkyCheer(props: BrandProps) {
  return (
    <Svg viewBox="0 0 200 220" fill="none" {...sized(200, 220, props)}>
      <Defs>
        <LinearGradient id="cBody" x1="50" y1="24" x2="150" y2="200" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E9FBF5" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="100" cy="202" rx="54" ry="10" fill="#0F2027" opacity={0.08} />
      <G strokeLinecap="round" fill="none">
        <Path d="M64 150 38 112" stroke="#C2EFE3" strokeWidth={18} />
        <Path d="M136 150 162 112" stroke="#C2EFE3" strokeWidth={18} />
        <Path d="M64 150 38 112" stroke="#FFFFFF" strokeWidth={12} />
        <Path d="M136 150 162 112" stroke="#FFFFFF" strokeWidth={12} />
      </G>
      <Circle cx="34" cy="108" r="12" fill="#FFFFFF" stroke="#C2EFE3" strokeWidth={3} />
      <Circle cx="166" cy="108" r="12" fill="#FFFFFF" stroke="#C2EFE3" strokeWidth={3} />
      <Path
        d="M100 24C58 24 32 52 32 92c0 40 8 72 27 92 7 10 22 8 25-5l5-18c2-7 12-7 14 0l5 18c3 13 18 15 25 5 19-20 27-52 27-92 0-40-26-68-68-68Z"
        fill="url(#cBody)"
        stroke="#C2EFE3"
        strokeWidth={3.2}
      />
      <Circle cx="66" cy="116" r="10" fill="#FF8FA0" opacity={0.55} />
      <Circle cx="134" cy="116" r="10" fill="#FF8FA0" opacity={0.55} />
      <Path d="M70 98c4-6 14-6 18 0" stroke="#0F2027" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M112 98c4-6 14-6 18 0" stroke="#0F2027" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path d="M84 118c4 7 28 7 32 0 -3 16 -11 24 -16 24 -5 0 -13 -8 -16 -24Z" fill="#3A2A2E" />
      <Ellipse cx="100" cy="136" rx="8" ry="5" fill="#FF8FA0" />
      <Path d="M30 150l4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10Z" fill="#FFCB3D" />
      <Path d="M170 152l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill="#4FC3F7" />
      <Circle cx="100" cy="14" r="5" fill="#FFCB3D" />
    </Svg>
  );
}

/** Sparky waving — onboarding & empty states. */
export function SparkyWave(props: BrandProps) {
  return (
    <Svg viewBox="0 0 160 200" fill="none" {...sized(160, 200, props)}>
      <Defs>
        <LinearGradient id="wBody" x1="40" y1="22" x2="120" y2="180" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E9FBF5" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="80" cy="184" rx="44" ry="9" fill="#0F2027" opacity={0.08} />
      <G strokeLinecap="round" fill="none">
        <Path d="M112 132 138 100" stroke="#C2EFE3" strokeWidth={16} />
        <Path d="M112 132 138 100" stroke="#FFFFFF" strokeWidth={11} />
      </G>
      <Circle cx="140" cy="96" r="11" fill="#FFFFFF" stroke="#C2EFE3" strokeWidth={3} />
      <G strokeLinecap="round" fill="none">
        <Path d="M50 134 36 156" stroke="#C2EFE3" strokeWidth={16} />
        <Path d="M50 134 36 156" stroke="#FFFFFF" strokeWidth={11} />
      </G>
      <Circle cx="34" cy="158" r="10" fill="#FFFFFF" stroke="#C2EFE3" strokeWidth={3} />
      <Path
        d="M80 22C46 22 26 44 26 76c0 33 7 59 22 76 6 8 18 6 20-4l4-15c2-6 10-6 12 0l4 15c2 10 14 12 20 4 15-17 22-43 22-76 0-32-20-54-54-54Z"
        fill="url(#wBody)"
        stroke="#C2EFE3"
        strokeWidth={3}
      />
      <Circle cx="54" cy="96" r="9" fill="#FF8FA0" opacity={0.55} />
      <Circle cx="106" cy="96" r="9" fill="#FF8FA0" opacity={0.55} />
      <Circle cx="68" cy="80" r="10" fill="#0F2027" />
      <Circle cx="92" cy="80" r="10" fill="#0F2027" />
      <Circle cx="71.5" cy="76" r="3.4" fill="#FFFFFF" />
      <Circle cx="95.5" cy="76" r="3.4" fill="#FFFFFF" />
      <Path d="M69 99c3 5 22 5 24 0 -2 12 -8 18 -12 18 -4 0 -10 -6 -12 -18Z" fill="#3A2A2E" />
      <Ellipse cx="80" cy="113" rx="6.5" ry="4.5" fill="#FF8FA0" />
      <Path d="M132 60l4 11 11 4-11 4-4 11-4-11-11-4 11-4 4-11Z" fill="#FFCB3D" />
    </Svg>
  );
}
