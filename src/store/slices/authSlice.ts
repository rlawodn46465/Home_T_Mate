import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  handleSocialLoginSuccess,
  logoutUser,
} from "../../services/api/authService";
import type { LoginResponse, UserInfo } from "../../services/api/authService";
import { clearAuthTokens } from "../../services/api/api";

export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

// 사용자 정보 로드
export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      const data: LoginResponse = await handleSocialLoginSuccess(token);
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || "인증에 실패했습니다.");
    }
  }
);

// 로그아웃
export const logoutThunk = createAsyncThunk<null, void>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    } finally {
      clearAuthTokens();
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        loadUserThunk.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.status = "succeeded";
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      )
      .addCase(loadUserThunk.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
