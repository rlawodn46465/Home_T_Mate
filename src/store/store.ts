import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import goalsReducer from "./slices/goalsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
