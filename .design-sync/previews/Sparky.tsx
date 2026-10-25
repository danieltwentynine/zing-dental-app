import { Sparky, SparkyBrushing, SparkyCheer, SparkyWave } from 'zing-ds';

export const Poses = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
    <Sparky width={120} />
    <SparkyWave width={170} />
    <SparkyCheer width={170} />
    <SparkyBrushing width={170} />
  </div>
);
