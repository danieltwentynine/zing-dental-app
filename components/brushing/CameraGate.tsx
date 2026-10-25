import { Camera as CameraIcon } from 'phosphor-react-native';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { tokens } from '@/lib/tokens';

interface CameraGateProps {
  onAllow: () => void;
  onSkip: () => void;
}

/**
 * Parent-facing explainer shown BEFORE the system camera prompt (CLAUDE.md > Never:
 * no camera permission without explaining why first).
 */
export function CameraGate({ onAllow, onSkip }: CameraGateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, rowGap: 14 }}>
      <CameraIcon size={56} color={tokens.feedbackReward} weight="fill" />
      <Text className="font-display" style={{ fontSize: 28, color: tokens.textOnBrand, textAlign: 'center' }}>
        Let Zing watch the brushing
      </Text>
      <Text className="font-body" style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
        Parents: Zing uses the front camera to see your child's mouth while they brush. Video stays on this phone —
        it is never saved or sent anywhere.
      </Text>
      <View style={{ rowGap: 10, alignSelf: 'stretch', marginTop: 10 }}>
        <Button label="Turn on camera" onPress={onAllow} fullWidth />
        <Button label="Brush without camera" onPress={onSkip} variant="outline" fullWidth />
      </View>
    </View>
  );
}
