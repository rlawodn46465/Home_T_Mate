import { useState, useEffect, useCallback } from "react";
import { fetchGoalDetail } from "../services/api/goalApi";
import type { GoalDetail } from "../types/goal";

interface UseGoalDetailReturn {
  goal: GoalDetail | null;
  loading: boolean;
  error: string | null;
  refetchDetail: () => Promise<void>;
}

// 특정 목표의 상세 정보 불러오기
export const useGoalDetail = (
  goalId: string | undefined,
  shouldFetch: boolean = true
): UseGoalDetailReturn => {
  const [goal, setGoal] = useState<GoalDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refetchDetail = useCallback(async () => {
    if (!goalId || !shouldFetch) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchGoalDetail(goalId);
      setGoal(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "알 수 없는 오류";
      console.error(`목표 상세 정보 로드 실패 (ID: ${goalId}): `, errorMessage);
      setError(`목표 상세 정보를 불러오는 데 실패했습니다: ${errorMessage}`);
      setGoal(null);
    } finally {
      setLoading(false);
    }
  }, [goalId, shouldFetch]);

  useEffect(() => {
    refetchDetail();
  }, [refetchDetail]);

  return { goal, loading, error, refetchDetail };
};
