import { StreakDisplay } from 'zing-ds';

const wide = { width: 360 } as const;

export const CardLayout = () => <div style={wide}><StreakDisplay days={5} best={9} /></div>;

export const FirstDay = () => <div style={wide}><StreakDisplay days={0} best={0} /></div>;

export const ChipLayout = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <StreakDisplay days={1} layout="chip" />
    <StreakDisplay days={12} layout="chip" />
  </div>
);
