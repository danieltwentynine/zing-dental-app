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

export interface BrushingSession {
  id: string;
  childId: string;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds: number;
  zonesDetected: ToothZone[];
  zonesCoverage: Record<ToothZone, number>;
  score: number;
  coachMessage?: string;
  streak: number;
}

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

export type SessionState =
  | 'IDLE'
  | 'COUNTDOWN'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'RESULTS';
