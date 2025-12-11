// hooks/useMonthlyWorkoutDots.js

import { useEffect, useCallback } from "react";
import { fetchMonthlyHistory } from "../services/api/historyApi";
import { useApi } from "./useApi";

export const useMonthlyHistory = (year, month) => {
  const { data, loading, error, execute, setData } =
    useApi(fetchMonthlyHistory);

  const refetch = useCallback(() => {
    if (!year || !month) return;
    return execute(year, month);
  }, [year, month, execute]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    historyData: data || [],
    isLoading: loading,
    error,
    refetch,
    setHistoryData: setData,
  };
};
