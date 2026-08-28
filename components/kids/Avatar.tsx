import {
  Butterfly,
  Cat,
  Dog,
  Fish,
  Heart,
  type IconProps,
  Robot,
  Rocket,
  Star,
} from 'phosphor-react-native';
import { useState, type ComponentType } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { motion, palette, radius, shadows, tokens } from '@/lib/tokens';

type AvatarConfig = { Icon: ComponentType<IconProps>; bg: string };

// Phosphor has no Shark in RN; Fish is the closest friendly substitute.
const AVATARS: Record<string, AvatarConfig> = {
  shark: { Icon: Fish, bg: palette.sky[400] },
  robot: { Icon: Robot, bg: palette.grape[500] },
  rocket: { Icon: Rocket, bg: palette.coral[500] },
  cat: { Icon: Cat, bg: palette.sunny[500] },
  dog: { Icon: Dog, bg: palette.mint[500] },
  butterfly: { Icon: Butterfly, bg: palette.sky[500] },
  star: { Icon: Star, bg: palette.warning[500] },
  heart: { Icon: Heart, bg: palette.coral[500] },
};

export const AVATAR_IDS = Object.keys(AVATARS);

interface AvatarProps {
  avatarId?: string;
  size?: number;
  ring?: boolean;
  style?: ViewStyle;
}

export function Avatar({ avatarId = 'dog', size = 56, ring = false, style }: AvatarProps) {
  const a = AVATARS[avatarId] ?? AVATARS.dog;
  const circle = (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: a.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        ring ? null : shadows.sm,
        style,
      ]}
    >
      <a.Icon size={size * 0.52} color="#fff" weight="fill" />
    </View>
  );

  if (!ring) return circle;
  // colored outer ring with a white gap (mirrors the design's double box-shadow)
  return (
    <View
      style={{
        padding: 3,
        borderRadius: radius.pill,
        borderWidth: 3,
        borderColor: a.bg,
        backgroundColor: tokens.surfaceCard,
      }}
    >
      {circle}
    </View>
  );
}

interface AvatarPickerProps {
  value?: string;
  onChange?: (id: string) => void;
}

/** AvatarPicker — the child chooses their character during onboarding. */
export function AvatarPicker({ value = 'dog', onChange }: AvatarPickerProps) {
  // Pressed state lives in React state because NativeWind's runtime drops
  // Pressable's function-form style prop (nativewind/nativewind#1105).
  const [pressedId, setPressedId] = useState<string | null>(null);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 }}>
      {AVATAR_IDS.map((id) => {
        const selected = id === value;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={`${id} character`}
            accessibilityState={{ selected }}
            onPress={() => onChange?.(id)}
            onPressIn={() => setPressedId(id)}
            onPressOut={() => setPressedId(null)}
            // Fixed 4-column cells, tall enough for the selected ring (56 + 12),
            // so choosing a character never reflows the grid.
            style={{ width: '25%', height: 84, alignItems: 'center', justifyContent: 'center' }}
          >
            <View
              style={{
                flex: 1,
                alignSelf: 'stretch',
                marginHorizontal: 4,
                borderRadius: radius.xl,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? tokens.surfaceMint : 'transparent',
                transform: [{ scale: pressedId === id ? motion.pressScale : 1 }],
              }}
            >
              <Avatar avatarId={id} size={56} ring={selected} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
