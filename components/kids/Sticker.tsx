import { Text, View } from 'react-native';

import { outline, palette, radius, tokens } from '@/lib/tokens';

interface StickerProps {
  label: string;
  bg?: string;
  tilt?: number;
}

/** Sticker — a hand-placed label. Only stickers tilt (±3–6°); sunny/bubblegum-500 take ink text. */
export function Sticker({ label, bg = palette.sunny[500], tilt = -4 }: StickerProps) {
  return (
    <View
      style={[
        {
          alignSelf: 'center',
          backgroundColor: bg,
          borderRadius: radius.pill,
          paddingHorizontal: 14,
          paddingVertical: 6,
          transform: [{ rotate: `${tilt}deg` }],
        },
        outline,
      ]}
    >
      <Text className="font-display-semi" style={{ fontSize: 15, color: tokens.textPrimary }}>
        {label}
      </Text>
    </View>
  );
}
