import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { WeeklyStatsResponse, WeightStatItem } from "../../types/stat";
import { fetchWeekly, fetchWeight } from "../../services/api/statApi";

interface AsyncState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface StatState {
  weekly: WeeklyStatsResponse | null;
  weight: WeightStatItem[];

  fetchWeekly: AsyncState;
  fetchWeight: AsyncState;
}

const initialAsync: AsyncState = {
  status: "idle",
  error: null,
};

const initialState: StatState = {
  weekly: null,
  weight: [],

  fetchWeekly: initialAsync,
  fetchWeight: initialAsync,
};

// 이번 주 통계
export const fetchWeeklyThunk = createAsyncThunk<
  WeeklyStatsResponse,
  void,
  { rejectValue: string }
>("stat/fetchWeekly", async (_, { rejectWithValue }) => {
  try {
    return await fetchWeekly();
  } catch (err: any) {
    return rejectWithValue(err.message ?? "주간 통계 조회 실패");
  }
});

// 부위별 무게
export const fetchWeightThunk = createAsyncThunk<
  WeightStatItem[],
  void,
  { rejectValue: string }
>("stat/fetchWeight", async (_, { rejectWithValue }) => {
  try {
    return await fetchWeight();
  } catch (err: any) {
    return rejectWithValue(err.message ?? "무게 통계 조회 실패");
  }
});

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 이번 주 통계
      .addCase(fetchWeeklyThunk.pending, (state) => {
        state.fetchWeekly.status = "loading";
        state.fetchWeekly.error = null;
      })
      .addCase(fetchWeeklyThunk.fulfilled, (state, action) => {
        state.fetchWeekly.status = "succeeded";
        state.weekly = action.payload;
      })
      .addCase(fetchWeeklyThunk.rejected, (state, action) => {
        state.fetchWeekly.status = "failed";
        state.fetchWeekly.error = action.payload ?? "주간 통계 실패";
      })
      // 부위별 무게
      .addCase(fetchWeightThunk.pending, (state) => {
        state.fetchWeight.status = "loading";
        state.fetchWeight.error = null;
      })
      .addCase(fetchWeightThunk.fulfilled, (state, action) => {
        state.fetchWeight.status = "succeeded";
        state.weight = action.payload;
      })
      .addCase(fetchWeightThunk.rejected, (state, action) => {
        state.fetchWeight.status = "failed";
        state.fetchWeight.error = action.payload ?? "무게 통계 실패";
      });
  },
});

export default statSlice.reducer;
