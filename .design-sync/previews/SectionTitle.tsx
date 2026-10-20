import { SectionTitle } from 'zing-ds';

export const Default = () => (
  <div style={{ width: 320 }}>
    <SectionTitle>Today's brushing</SectionTitle>
  </div>
);

export const Headings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
    <SectionTitle>This week</SectionTitle>
    <SectionTitle>Badges</SectionTitle>
    <SectionTitle>Recent sessions</SectionTitle>
  </div>
);
