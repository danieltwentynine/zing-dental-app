import { BadgeCard } from 'zing-ds';

const row = { display: 'flex', gap: 12, flexWrap: 'wrap', width: 520 } as const;

export const Shelf = () => (
  <div style={row}>
    <BadgeCard type="firstSession" earned />
    <BadgeCard type="streak" earned />
    <BadgeCard type="perfect" earned={false} />
    <BadgeCard type="weeklyGoal" earned={false} />
  </div>
);

export const Earned = () => <BadgeCard type="perfect" earned caption="All 10 zones!" />;

export const Locked = () => <BadgeCard type="weeklyGoal" earned={false} caption="Brush 7 days" />;
