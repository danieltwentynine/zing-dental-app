import { MouthMap } from 'zing-ds';

export const Empty = () => <MouthMap size={220} />;

export const MidSession = () => (
  <MouthMap
    size={260}
    states={{
      'top-front': 'done',
      'top-left': 'done',
      'top-back-left': 'done',
      'top-right': 'active',
      'bottom-front': 'done',
    }}
  />
);

export const ResultsWithMissed = () => (
  <MouthMap
    size={200}
    states={{
      'top-front': 'done',
      'top-left': 'done',
      'top-right': 'done',
      'top-back-left': 'missed',
      'top-back-right': 'done',
      'bottom-front': 'done',
      'bottom-left': 'done',
      'bottom-right': 'done',
      'bottom-back-left': 'done',
      'bottom-back-right': 'missed',
    }}
  />
);

export const AllBrushed = () => (
  <MouthMap
    size={200}
    states={{
      'top-front': 'done', 'top-left': 'done', 'top-right': 'done', 'top-back-left': 'done', 'top-back-right': 'done',
      'bottom-front': 'done', 'bottom-left': 'done', 'bottom-right': 'done', 'bottom-back-left': 'done', 'bottom-back-right': 'done',
    }}
  />
);
