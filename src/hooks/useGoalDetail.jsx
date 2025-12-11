import { useEffect, useCallback } from "react";
import { fetchGoalDetail } from "../services/api/goalApi";
import { useApi } from "./useApi";

// 특정 루틴의 상세 정보 불러오기
export const useGoalDetail = (goalId, shouldFetch = true) => {
  const { data, loading, error, execute, setData } = useApi(fetchGoalDetail);

  const refetchDetail = useCallback(() => {
    if (!goalId || !shouldFetch) return;
    return execute(goalId);
  }, [goalId, shouldFetch, execute]);

  useEffect(() => {
    refetchDetail();
  }, [refetchDetail]);

  return {
    goal: data,
    loading,
    error,
    refetchDetail,
    setGoal: setData,
  };
};
