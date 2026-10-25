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
    <Badge tone="sky" label="Morning" />
    <Badge tone="sunny" label="3-day streak" />
    <Badge tone="coral" label="Evening" />
    <Badge tone="grape" label="New badge" />
    <Badge tone="warning" label="Missed back teeth" />
    <Badge tone="neutral" label="Not yet" />
  </div>
);

export const Solid = () => (
  <div style={row}>
    <Badge tone="cobalt" solid label="Perfect" />
    <Badge tone="sky" solid label="Done" />
    <Badge tone="grape" solid label="Weekly star" />
  </div>
);
