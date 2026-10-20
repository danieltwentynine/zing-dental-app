import { SafeScreen, ZingWordmark, Button } from 'zing-ds';

export const Screen = () => (
  <div style={{ width: 360, height: 420, display: 'flex' }}>
    <SafeScreen>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
        <ZingWordmark height={44} />
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 18, color: 'var(--text-secondary)' }}>
          Your brushing buddy for bright, happy smiles.
        </span>
        <Button label="Get started" size="lg" onPress={() => {}} />
      </div>
    </SafeScreen>
  </div>
);
