import { Card, SectionTitle, Avatar, StreakDisplay } from 'zing-ds';

const text = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--text-secondary)' } as const;

export const Plain = () => (
  <div style={{ width: 340 }}>
    <Card padding={18}>
      <span style={text}>No sessions yet — time for the first brushing adventure!</span>
    </Card>
  </div>
);

export const ChildHeader = () => (
  <div style={{ width: 360 }}>
    <Card tone="soft" padding={18} radius={32}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar avatarId="shark" size={62} />
        <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)' }}>Leo</div>
        <StreakDisplay days={4} layout="chip" />
      </div>
    </Card>
  </div>
);

export const Tones = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: 360 }}>
    {(['plain', 'soft', 'sky', 'sunken', 'cobalt', 'sunny'] as const).map((tone) => (
      <Card key={tone} tone={tone} padding={16}>
        <span style={text}>{tone}</span>
      </Card>
    ))}
  </div>
);

export const WithSectionTitle = () => (
  <div style={{ width: 340 }}>
    <Card padding={18}>
      <SectionTitle>This week</SectionTitle>
      <span style={text}>5 of 7 days brushed — nice rhythm!</span>
    </Card>
  </div>
);
