import { ZingLockup, ZingMark, ZingWordmark } from 'zing-ds';

export const Lockup = () => <ZingLockup height={56} />;

export const Parts = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
    <ZingMark width={72} />
    <ZingWordmark width={180} />
  </div>
);
