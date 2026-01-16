import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GoalDetail, CustomExercise } from "../../types/goal";

interface WorkoutSetResult {
  setNumber: number;
  weight: number;
  reps: number;
}

interface ExerciseResult {
  exerciseId: string;
  sets: WorkoutSetResult[];
}

export interface WorkoutState {
  isActive: boolean;
  goalInfo: { id: string; title: string; type: string } | null;
  todayExercises: CustomExercise[];
  currentExerciseIndex: number;
  currentSetIndex: number;
  workoutResults: ExerciseResult[]; 
  startTime: string | null;
  timerMode: "READY" | "WORK" | "REST";
}

const initialState: WorkoutState = {
  isActive: false,
  goalInfo: null,
  todayExercises: [],
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  workoutResults: [],
  startTime: null,
  timerMode: "READY",
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    // 운동 세션 시작
    startWorkoutSession: (
      state,
      action: PayloadAction<{
        goal: GoalDetail;
        todayExercises: CustomExercise[];
      }>
    ) => {
      const { goal, todayExercises } = action.payload;
      state.isActive = true;
      state.goalInfo = { id: goal.id, title: goal.name, type: goal.goalType };
      state.todayExercises = todayExercises;
      state.currentExerciseIndex = 0;
      state.currentSetIndex = 0;
      state.startTime = new Date().toISOString();
      state.timerMode = "READY";

      // 결과 저장을 위한 구조 미리 생성
      state.workoutResults = todayExercises.map((ex) => ({
        exerciseId: String(ex.exerciseId),
        sets: ex.sets.map((s) => ({ ...s })),
      }));
    },

    // 타이머 모드 변경
    setTimerMode: (state, action: PayloadAction<WorkoutState["timerMode"]>) => {
      state.timerMode = action.payload;
    },

    // 현재 세트의 무게/횟수 수정
    updateCurrentSet: (
      state,
      action: PayloadAction<{ weight?: number; reps?: number }>
    ) => {
      const { weight, reps } = action.payload;
      const currentExResults = state.workoutResults[state.currentExerciseIndex];
      if (currentExResults) {
        const currentSet = currentExResults.sets[state.currentSetIndex];
        if (weight !== undefined) currentSet.weight = Math.max(0, weight);
        if (reps !== undefined) currentSet.reps = Math.max(0, reps);
      }
    },

    // 다음 단계로 (세트 종료 -> 휴식 시작 / 휴식 종료 -> 다음 세트)
    moveToNextStep: (state) => {
      const currentEx = state.todayExercises[state.currentExerciseIndex];

      // 현재 운동의 세트가 더 남았는지 확인
      if (state.currentSetIndex < currentEx.sets.length - 1) {
        state.currentSetIndex += 1;
        state.timerMode = "READY"; // 다음 세트 준비 상태
      } else {
        // 다음 운동으로 이동
        if (state.currentExerciseIndex < state.todayExercises.length - 1) {
          state.currentExerciseIndex += 1;
          state.currentSetIndex = 0;
          state.timerMode = "READY";
        } else {
          // 모든 운동 종료 (isActive는 유지하고 Page에서 종료 처리)
          state.timerMode = "READY";
        }
      }
    },

    stopWorkoutSession: () => initialState,
  },
});

export const {
  startWorkoutSession,
  setTimerMode,
  updateCurrentSet,
  moveToNextStep,
  stopWorkoutSession,
} = workoutSlice.actions;

export default workoutSlice.reducer;
