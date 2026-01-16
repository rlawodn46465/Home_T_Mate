export type GoalType = "ROUTINE" | "CHALLENGE" | "PERSONAL";
export type GoalStatus = "진행중" | "부분완료" | "완료" | "실패";

export interface SetInfo {
  setNumber: number;
  weight: number;
  reps: number;
  isCompleted?: boolean;
}

export interface CustomExercise {
  exerciseId: string;
  name?: string;
  targetMuscles?: string[];
  days: string[];
  restTime: number;
  sets: SetInfo[];
}

export interface CreateGoalRequest {
  name: string;
  goalType: GoalType;
  exercises: CustomExercise[];
  durationWeek?: number;
  isUserPublic?: boolean;
}

export interface UpdateGoalRequest {
  durationWeek?: number;
  exercises?: CustomExercise[];
}

export interface GoalDetail {
  id: string;
  name: string;
  goalType: GoalType;
  parts: string[];
  creator: string;
  creatorId: string;
  status: GoalStatus;
  startDate: string;
  currentWeek: number;
  durationWeek?: number;
  progress: number;
  exercises: CustomExercise[];
  createdAt: string;
}

export interface DailyRecord {
  id: string;
  recordId: string;
  exerciseId: string;
  exerciseName: string;
  recordType: GoalType;
  goalName?: string;
  parts: string[];
  sets: {
    setNumber: number;
    weight: number;
    reps: number;
    isCompleted: boolean;
  }[];
  totalTime: number;
  isCompleted: boolean;
  totalVolume: number;
  maxWeight: number;
  totalReps?: number;
  date: string;
}

export interface TodayGoal {
  userGoalId: string;
  name: string;
}