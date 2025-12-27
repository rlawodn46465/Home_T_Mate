import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import goalReducer from "./slices/goalSlice";

export const store = configureStore({
  reducer: {
    // 여기에 각 도메인별 리듀서(보관함 칸)를 등록
    auth: authReducer,
    goals: goalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // 미들웨어 설정 등을 여기서 확장할 수 있다.
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
