import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  CreateGoalRequest,
  GoalDetail,
  TodayGoal,
  UpdateGoalRequest,
} from "../../types/goal";
import {
  createGoal,
  finishGoal,
  deleteGoal,
  fetchGoalDetail,
  fetchGoals,
  fetchTodayGoals,
  updateGoal,
} from "../../services/api/goalApi";

interface AsyncState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface GoalsState {
  list: GoalDetail[];
  today: TodayGoal[];
  detailMap: Record<string, GoalDetail>;
  fetchList: AsyncState;
  fetchToday: AsyncState;
  fetchDetail: AsyncState;
  save: AsyncState;
}
const initialAsync: AsyncState = {
  status: "idle",
  error: null,
};

const initialState: GoalsState = {
  list: [],
  today: [],
  detailMap: {},
  fetchList: { ...initialAsync },
  fetchToday: { ...initialAsync },
  fetchDetail: { ...initialAsync },
  save: { ...initialAsync },
};

// 목표 목록
export const fetchGoalsThunk = createAsyncThunk(
  "goals/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchGoals();
    } catch {
      return rejectWithValue("목표 목록을 불러오는 데 실패했습니다.");
    }
  }
);
// 오늘 목표
export const fetchTodayGoalsThunk = createAsyncThunk(
  "goals/fetchToday",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTodayGoals();
    } catch {
      return rejectWithValue("오늘의 목표를 불러오는 데 실패했습니다.");
    }
  }
);
// 목표 상세
export const fetchGoalDetailThunk = createAsyncThunk(
  "goals/fetchDetail",
  async (goalId: string, { rejectWithValue }) => {
    try {
      return await fetchGoalDetail(goalId);
    } catch {
      return rejectWithValue("상세 정보를 불러오는 데 실패했습니다.");
    }
  }
);
// 목표 생성
export const createGoalThunk = createAsyncThunk(
  "goals/create",
  async (payload: CreateGoalRequest, { rejectWithValue }) => {
    try {
      const id = await createGoal(payload);
      return { id };
    } catch {
      return rejectWithValue("목표 생성에 실패했습니다.");
    }
  }
);
// 목표 종료
export const finishGoalThunk = createAsyncThunk(
  "goals/finish",
  async (goalId: string, { rejectWithValue }) => {
    try {
      const result = await finishGoal(goalId);
      return result;
    } catch {
      return rejectWithValue("목표를 종료하는 데 실패했습니다.");
    }
  }
);
// 목표 수정
export const updateGoalThunk = createAsyncThunk(
  "goals/update",
  async (
    { goalId, data }: { goalId: string; data: UpdateGoalRequest },
    { rejectWithValue }
  ) => {
    try {
      await updateGoal(goalId, data);
      return { goalId, data };
    } catch {
      return rejectWithValue("목표 수정에 실패했습니다.");
    }
  }
);
// 목표 삭제
export const deleteGoalThunk = createAsyncThunk(
  "goals/delete",
  async (goalId: string, { rejectWithValue }) => {
    try {
      await deleteGoal(goalId);
      return goalId;
    } catch {
      return rejectWithValue("목표 삭제에 실패했습니다.");
    }
  }
);

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    resetGoalsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // 목록
      .addCase(fetchGoalsThunk.pending, (state) => {
        state.fetchList.status = "loading";
        state.fetchList.error = null;
      })
      .addCase(
        fetchGoalsThunk.fulfilled,
        (state, action: PayloadAction<GoalDetail[]>) => {
          state.fetchList.status = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(fetchGoalsThunk.rejected, (state, action) => {
        state.fetchList.status = "failed";
        state.fetchList.error = action.payload as string;
      })
      // 오늘
      .addCase(fetchTodayGoalsThunk.pending, (state) => {
        state.fetchToday.status = "loading";
      })
      .addCase(fetchTodayGoalsThunk.fulfilled, (state, action) => {
        state.fetchToday.status = "succeeded";
        state.today = action.payload;
      })
      .addCase(fetchTodayGoalsThunk.rejected, (state, action) => {
        state.fetchToday.status = "failed";
        state.fetchToday.error = action.payload as string;
      })
      // 상세
      .addCase(fetchGoalDetailThunk.pending, (state) => {
        state.fetchDetail.status = "loading";
      })
      .addCase(
        fetchGoalDetailThunk.fulfilled,
        (state, action: PayloadAction<GoalDetail>) => {
          state.fetchDetail.status = "succeeded";
          state.detailMap[action.payload.id] = action.payload;
        }
      )
      .addCase(fetchGoalDetailThunk.rejected, (state, action) => {
        state.fetchDetail.status = "failed";
        state.fetchDetail.error = action.payload as string;
      })
      // 생성
      .addCase(createGoalThunk.pending, (state) => {
        state.save.status = "loading";
        state.save.error = null;
      })
      .addCase(createGoalThunk.fulfilled, (state) => {
        state.save.status = "succeeded";
      })
      .addCase(createGoalThunk.rejected, (state, action) => {
        state.save.status = "failed";
        state.save.error = action.payload as string;
      })
      // 종료
      .addCase(finishGoalThunk.pending, (state) => {
        state.save.status = "loading";
        state.save.error = null;
      })
      .addCase(finishGoalThunk.fulfilled, (state, action) => {
        state.save.status = "succeeded";
        const { id, status } = action.payload;

        const idx = state.list.findIndex((g) => g.id === id);
        if (idx !== -1) {
          state.list[idx].status = status;
        }

        if (state.detailMap[id]) {
          state.detailMap[id].status = status;
        }
      })
      .addCase(finishGoalThunk.rejected, (state, action) => {
        state.save.status = "failed";
        state.save.error = action.payload as string;
      })
      // 수정
      .addCase(updateGoalThunk.pending, (state) => {
        state.save.status = "loading";
        state.save.error = null;
      })
      .addCase(updateGoalThunk.fulfilled, (state, action) => {
        state.save.status = "succeeded";
        const { goalId, data } = action.payload;

        // list 동기화
        const idx = state.list.findIndex((g) => g.id === goalId);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], ...data };
        }

        // detail 동기화
        if (state.detailMap[goalId]) {
          state.detailMap[goalId] = {
            ...state.detailMap[goalId],
            ...data,
          };
        }
      })
      .addCase(updateGoalThunk.rejected, (state, action) => {
        state.save.status = "failed";
        state.save.error = action.payload as string;
      })
      // 삭제
      .addCase(deleteGoalThunk.pending, (state) => {
        state.save.status = "loading";
        state.save.error = null;
      })
      .addCase(deleteGoalThunk.fulfilled, (state, action) => {
        state.save.status = "succeeded";
        const goalId = action.payload;
        state.list = state.list.filter((g) => g.id !== goalId);
        delete state.detailMap[goalId];
      })
      .addCase(deleteGoalThunk.rejected, (state, action) => {
        state.save.status = "failed";
        state.save.error = action.payload as string;
      });
  },
});

export const { resetGoalsState } = goalsSlice.actions;
export default goalsSlice.reducer;
