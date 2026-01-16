import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import goalsReducer from "./slices/goalsSlice";
import historyReducer from "./slices/historySlice";
import exerciseReducer from "./slices/exerciseSlice";
import commentReducer from "./slices/commentSlice";
import statReducer from "./slices/statSlice";
import postReducer from "./slices/postSlice";
import workoutReducer from "./slices/workoutSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalsReducer,
    history: historyReducer,
    exercise: exerciseReducer,
    comment: commentReducer,
    stat: statReducer,
    post: postReducer,
    workout: workoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
