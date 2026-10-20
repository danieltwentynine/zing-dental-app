import { BrushTimer } from 'zing-ds';

const row = { display: 'flex', gap: 24, alignItems: 'center' } as const;

export const Start = () => <BrushTimer remaining={120} total={120} size={240} />;

export const MidSession = () => <BrushTimer remaining={47} total={120} size={240} label="Top teeth" />;

export const Compact = () => (
  <div style={row}>
    <BrushTimer remaining={90} total={120} size={150} />
    <BrushTimer remaining={12} total={120} size={150} />
  </div>
);
