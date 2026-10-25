export type ToothZone =
  | 'top-front'
  | 'top-left'
  | 'top-right'
  | 'top-back-left'
  | 'top-back-right'
  | 'bottom-front'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-back-left'
  | 'bottom-back-right';

export interface ChildProfile {
  id: string;
  parentUid: string;
  name: string;
  age: number;
  avatarId: string;
  streakCurrent: number;
  streakBest: number;
  totalSessions: number;
  badges: Badge[];
  createdAt: Date;
  lastSessionAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  earnedAt: Date;
  type: 'streak' | 'perfect' | 'firstSession' | 'weeklyGoal';
}
