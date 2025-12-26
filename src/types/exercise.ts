export interface ExerciseMaster {
  _id: string;
  name: string;
  category: string[];
  targetMuscles: string[];
  equipment: string[];
  description?: {
    setup: { step: number; text: string }[];
    movement: { step: number; text: string }[];
    breathing: { step: number; text: string }[];
    tips: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseLog {
  id: string;
  type: string;
  name: string;
  date: string | null;
  sets: { set: number; weight: number; reps: number }[];
  duration: number;
}

export interface ExerciseStats {
  best: { weight: number; volume: number; reps: number; time: number };
  total: { weight: number; reps: number; volume: number; time: number };
  memo: string;
}

export interface ExerciseDetailResponse {
  exercise: ExerciseMaster;
  myStats: ExerciseStats;
  recentLogs: ExerciseLog[];
}

export interface ExerciseFilters {
  search?: string;
  part?: string;
  tool?: string;
}
