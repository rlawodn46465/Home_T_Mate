import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  ExerciseDetailResponse,
  ExerciseFilters,
  ExerciseMaster,
} from "../../types/exercise";
import {
  fetchExerciseDetail,
  fetchExercises,
} from "../../services/api/exerciseApi";

interface AsyncState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface ExerciseState {
  list: ExerciseMaster[];
  detailMap: Record<string, ExerciseDetailResponse>;

  fetchList: AsyncState;
  fetchDetail: AsyncState;
}

const initialAsyncState: AsyncState = {
  status: "idle",
  error: null,
};

const initialState: ExerciseState = {
  list: [],
  detailMap: {},

  fetchList: initialAsyncState,
  fetchDetail: initialAsyncState,
};

// 운동 목록 조회
export const fetchExercisesThunk = createAsyncThunk<
  ExerciseMaster[],
  ExerciseFilters | undefined,
  { rejectValue: string }
>("exercise/fetchList", async (filters = {}, { rejectWithValue }) => {
  try {
    return await fetchExercises(filters);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// 운동 상세 조회
export const fetchExerciseDetailThunk = createAsyncThunk<
  { exerciseId: string; data: ExerciseDetailResponse },
  string,
  { rejectValue: string }
>("exercise/fetchDetail", async (exerciseId, { rejectWithValue }) => {
  try {
    const data = await fetchExerciseDetail(exerciseId);
    return { exerciseId, data };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    clearExerciseDetail(state, action: PayloadAction<string>) {
      delete state.detailMap[action.payload];
    },
    clearAllExerciseDetail(state) {
      state.detailMap = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // 목록
      .addCase(fetchExercisesThunk.pending, (state) => {
        state.fetchList.status = "loading";
        state.fetchList.error = null;
      })
      .addCase(fetchExercisesThunk.fulfilled, (state, action) => {
        state.fetchList.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchExercisesThunk.rejected, (state, action) => {
        state.fetchList.status = "failed";
        state.list = [];
        state.fetchList.error = action.payload ?? "목록 조회 실패";
      })
      // 상세
      .addCase(fetchExerciseDetailThunk.pending, (state) => {
        state.fetchDetail.status = "loading";
        state.fetchDetail.error = null;
      })
      .addCase(fetchExerciseDetailThunk.fulfilled, (state, action) => {
        state.fetchDetail.status = "succeeded";
        state.detailMap[action.payload.exerciseId] = action.payload.data;
      })
      .addCase(fetchExerciseDetailThunk.rejected, (state, action) => {
        state.fetchDetail.status = "failed";
        state.fetchDetail.error = action.payload ?? "상세 조회 실패";
      });
  },
});

export const { clearExerciseDetail } = exerciseSlice.actions;
export default exerciseSlice.reducer;
