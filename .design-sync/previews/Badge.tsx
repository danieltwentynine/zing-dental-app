import { Badge } from 'zing-ds';

const row = { display: 'flex', flexWrap: 'wrap', gap: 8, width: 360 } as const;

export const Score = () => (
  <div style={row}>
    <Badge tone="cobalt" solid label="92/100" />
    <Badge tone="warning" label="64/100" />
  </div>
);

export const Tones = () => (
  <div style={row}>
    <Badge tone="cobalt" label="Brushed" />
    <Badge tone="warning" label="Missed back teeth" />
  </div>
);

export const Solid = () => (
  <div style={row}>
    <Badge tone="cobalt" solid label="Perfect" />
  </div>
);
