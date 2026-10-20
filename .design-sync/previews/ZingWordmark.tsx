import { ZingWordmark } from 'zing-ds';

export const Default = () => <ZingWordmark height={56} />;

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <ZingWordmark height={32} />
    <ZingWordmark height={56} />
    <ZingWordmark width={240} />
  </div>
);
