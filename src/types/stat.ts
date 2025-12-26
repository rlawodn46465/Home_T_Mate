export interface WeeklyDayData {
  date: number;
  day: string;
  minutes: number;
  isToday: boolean;
  isWorkout: boolean;
}

export interface WeeklyStatsResponse {
  currentWeek: WeeklyDayData[];
  todayMinutes: number;
  weeklyAverageMinutes: number;
  weeklyTargetMuscles: string[];
}

export interface WeightStatItem {
  part: string;
  current: number;
  max: number;
}