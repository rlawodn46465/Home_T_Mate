import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as goalApi from "../../services/api/goalApi";
import type { GoalDetail, TodayGoal } from "../../types/goal";

export interface GoalState {
  goals: GoalDetail[];
  todayGoals: TodayGoal[];
  selectedGoal: GoalDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GoalState = {
  goals: [],
  todayGoals: [],
  selectedGoal: null,
  status: "idle",
  error: null,
};

export const fetchGoalsThunk = createAsyncThunk("goals/fetchAll", async () => {
  return await goalApi.fetchGoals();
});

export const fetchGoalDetailThunk = createAsyncThunk(
  "goals/fetchDetail",
  async (id: string) => {
    return await goalApi.fetchGoalDetail(id);
  }
);

export const deleteGoalThunk = createAsyncThunk(
  "goals/delete",
  async (id: string, { dispatch }) => {
    await goalApi.deleteGoal(id);
    return id;
  }
);

export const fetchTodayGoalsThunk = createAsyncThunk(
  "goals/fetchToday",
  async () => {
    return await goalApi.fetchTodayGoals();
  }
);

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    clearSelectedGoal: (state) => {
      state.selectedGoal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 목록 조회
      .addCase(fetchGoalsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGoalsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goals = action.payload;
      })
      // 상세 조회
      .addCase(fetchGoalDetailThunk.fulfilled, (state, action) => {
        state.selectedGoal = action.payload;
      })
      // 오늘 목표 조회
      .addCase(fetchTodayGoalsThunk.fulfilled, (state, action) => {
        state.todayGoals = action.payload;
      })
      // 삭제 처리
      .addCase(deleteGoalThunk.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
        if (state.selectedGoal?.id === action.payload) {
          state.selectedGoal = null;
        }
      });
  },
});

export const { clearSelectedGoal } = goalSlice.actions;
export default goalSlice.reducer;