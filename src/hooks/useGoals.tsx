import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchGoalsThunk,
  fetchTodayGoalsThunk,
} from "../store/slices/goalSlice";

// 목표 목록 상태 관리, API 통신 훅
export const useGoals = () => {
  const dispatch = useAppDispatch();
  const { goals, status, error } = useAppSelector((state) => state.goals);

  const refreshGoals = useCallback(() => {
    dispatch(fetchGoalsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") refreshGoals();
  }, [status, refreshGoals]);

  return { goals, loading: status === "loading", error, refreshGoals };
};

export const useTodayGoals = () => {
  const dispatch = useAppDispatch();
  const { todayGoals, status } = useAppSelector((state) => state.goals);

  const loadTodayGoals = useCallback(() => {
    dispatch(fetchTodayGoalsThunk());
  }, [dispatch]);

  return { goals: todayGoals, isLoading: status === "loading", loadTodayGoals };
};
