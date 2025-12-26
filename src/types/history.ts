export type RecordType = "루틴" | "챌린지" | "개별운동";
export type RecordStatus = "진행중" | "완료" | "실패";

export interface SetRecord {
  setNumber: number;
  weight: number;
  reps: number;
  isCompleted: boolean;
}

export interface MonthlyHistoryItem {
  date: string;
  recordType: RecordType;
  goalId: string | null;
  title: string;
  totalSessionTime: number;
  categoryGroup: string[];
  exercises: {
    id: string;
    exerciseId: string;
    name: string;
    targetMuscles: string[];
    totalTime: number;
    sets: SetRecord[];
  }[];
}

export interface SingleRecordResponse {
  recordId: string;
  date: string;
  type: RecordType;
  title: string;
  totalTime: number;
  userGoalId: string | null;
  startDate: string | null;
  activeDays: string[];
  durationWeek: number;
  exercises: {
    exerciseId: string;
    name: string;
    targetMuscles: string[];
    sets: SetRecord[];
    restTime: number;
    days: string[];
  }[];
}

export interface SaveWorkoutRequest {
  date: string;
  userGoalId?: string;
  title: string;
  type: string;
  totalTime: number;
  exercises: {
    exerciseId: string;
    totalVolume: number;
    maxWeight: number;
    totalReps: number;
    sets: SetRecord[];
  }[];
}
