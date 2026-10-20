import { CoachCard } from 'zing-ds';

const wide = { width: 360 } as const;

export const WithScore = () => (
  <div style={wide}>
    <CoachCard score={92} message="You did it, Leo! Keep brushing every day and your teeth will sparkle." style={{ width: '100%' }} />
  </div>
);

export const MissedBackTeeth = () => (
  <div style={wide}>
    <CoachCard score={74} message="Awesome job, Maya! Tomorrow, try to reach all the way to your back teeth." style={{ width: '100%' }} />
  </div>
);

export const NoScore = () => (
  <div style={wide}>
    <CoachCard message="Great brushing today, Sam! Your smile is getting stronger every day." style={{ width: '100%' }} />
  </div>
);
