import { ZingMascot } from 'zing-ds';

export const Sparky = () => <ZingMascot width={180} />;

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
    <ZingMascot width={72} />
    <ZingMascot width={120} />
    <ZingMascot width={180} />
  </div>
);
