import { Text } from 'react-native';

import { tokens } from '@/lib/tokens';

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="font-display" style={{ fontSize: 22, color: tokens.textPrimary, marginBottom: 12 }}>
      {children}
    </Text>
  );
}
