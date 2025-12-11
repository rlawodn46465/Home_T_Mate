import { useCallback } from "react";
import { fetchGoals, fetchTodayGoals } from "../services/api/goalApi";
import { useApi } from "./useApi";

// 루틴 목록 상태 관리, API 통신 훅
export const useGoals = () => {
  const { data, isLoading, error, execute } = useApi(fetchGoals, {
    immediate: true,
  });
  const refreshGoals = useCallback(() => execute().catch(() => {}), [execute]);
  return { goals: data || [], loading: isLoading, error, refreshGoals };
};

export const useTodayGoals = () => {
  const { data, isLoading, error, execute } = useApi(fetchTodayGoals, {
    immediate: true,
  });
  return {
    goals: data || [],
    isLoading,
    error,
    loadTodayGoals: () => execute(),
  };
};
