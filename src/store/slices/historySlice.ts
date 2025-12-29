import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  MonthlyHistoryItem,
  SaveWorkoutRequest,
  SingleRecordResponse,
} from "../../types/history";
import {
  deleteExerciseSession,
  fetchHistorys,
  fetchMonthlyHistory,
  fetchSingleRecord,
  saveExerciseSession,
  updateExerciseSession,
} from "../../services/api/historyApi";

type Status = "idle" | "loading" | "succeeded" | "failed";

export interface HistoryState {
  list: MonthlyHistoryItem[];
  monthly: MonthlyHistoryItem[];

  single: SingleRecordResponse | null;
  fetchList: { status: Status; error: string | null };
  fetchMonthly: { status: Status; error: string | null };
  fetchSingle: { status: Status; error: string | null };
  save: { status: Status; error: string | null };
}

const initialState: HistoryState = {
  list: [],
  monthly: [],
  single: null,

  fetchList: { status: "idle", error: null },
  fetchMonthly: { status: "idle", error: null },
  fetchSingle: { status: "idle", error: null },
  save: { status: "idle", error: null },
};

export const fetchHistoryThunk = createAsyncThunk(
  "history/fetchList",
  async () => {
    return await fetchHistorys();
  }
);

export const fetchMonthlyHistoryThunk = createAsyncThunk(
  "history/fetchMonthly",
  async ({ year, month }: { year: number; month: number }) => {
    return await fetchMonthlyHistory(year, month);
  }
);

export const fetchSingleHistoryThunk = createAsyncThunk(
  "history/fetchSingle",
  async (recordId: string) => {
    return await fetchSingleRecord(recordId);
  }
);

export const createHistoryThunk = createAsyncThunk(
  "history/create",
  async (data: SaveWorkoutRequest) => {
    return await saveExerciseSession(data);
  }
);

export const updateHistoryThunk = createAsyncThunk(
  "history/update",
  async ({
    recordId,
    data,
  }: {
    recordId: string;
    data: Partial<SaveWorkoutRequest>;
  }) => {
    return await updateExerciseSession(recordId, data);
  }
);

export const deleteHistoryThunk = createAsyncThunk(
  "history/delete",
  async (recordId: string) => {
    await deleteExerciseSession(recordId);
    return recordId;
  }
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 전체 기록
      .addCase(fetchHistoryThunk.pending, (state) => {
        state.fetchList.status = "loading";
      })
      .addCase(fetchHistoryThunk.fulfilled, (state, action) => {
        state.fetchList.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchHistoryThunk.rejected, (state, action) => {
        state.fetchList.status = "failed";
        state.fetchList.error = action.error.message || null;
      })
      // 월별 기록
      .addCase(fetchMonthlyHistoryThunk.pending, (state) => {
        state.fetchMonthly.status = "loading";
      })
      .addCase(fetchMonthlyHistoryThunk.fulfilled, (state, action) => {
        state.fetchMonthly.status = "succeeded";
        state.monthly = action.payload;
      })
      .addCase(fetchMonthlyHistoryThunk.rejected, (state, action) => {
        state.fetchMonthly.status = "failed";
        state.fetchMonthly.error = action.error.message || null;
      })
      // 단일 기록
      .addCase(fetchSingleHistoryThunk.pending, (state) => {
        state.fetchSingle.status = "loading";
        state.fetchSingle.error = null;
        state.single = null;
      })
      .addCase(fetchSingleHistoryThunk.fulfilled, (state, action) => {
        state.fetchSingle.status = "succeeded";
        state.single = action.payload;
      })
      .addCase(fetchSingleHistoryThunk.rejected, (state, action) => {
        state.fetchSingle.status = "failed";
        state.fetchSingle.error = action.error.message || null;
      })
      // 생성
      .addCase(createHistoryThunk.pending, (state) => {
        state.save.status = "loading";
      })
      .addCase(createHistoryThunk.fulfilled, (state) => {
        state.save.status = "succeeded";
      })
      .addCase(createHistoryThunk.rejected, (state, action) => {
        state.save.status = "failed";
        state.save.error = action.error.message || null;
      })
      // 수정
      .addCase(updateHistoryThunk.pending, (state) => {
        state.save.status = "loading";
      })
      .addCase(updateHistoryThunk.fulfilled, (state) => {
        state.save.status = "succeeded";
      })
      .addCase(updateHistoryThunk.rejected, (state, action) => {
        state.save.status = "failed";
        state.save.error = action.error.message || null;
      })
      // 삭제
      .addCase(deleteHistoryThunk.pending, (state) => {
        state.save.status = "loading";
      })
      .addCase(deleteHistoryThunk.fulfilled, (state) => {
        state.save.status = "succeeded";
      })
      .addCase(deleteHistoryThunk.rejected, (state, action) => {
        state.save.status = "failed";
        state.save.error = action.error.message || null;
      });
  },
});

export default historySlice.reducer;
