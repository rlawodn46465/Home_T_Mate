import { useEffect, useCallback } from "react";
import type { GoalDetail } from "../types/goal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearSelectedGoal,
  fetchGoalDetailThunk,
} from "../store/slices/goalSlice";

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
  const dispatch = useAppDispatch();
  const { selectedGoal, status, error } = useAppSelector(
    (state) => state.goals
  );

  const refetchDetail = useCallback(async () => {
    if (!goalId || !shouldFetch) return;

    try {
      await dispatch(fetchGoalDetailThunk(goalId)).unwrap();
    } catch (err) {
      console.error(`모표 로드 실패:`, err);
    }
  }, [goalId, shouldFetch, dispatch]);

  useEffect(() => {
    refetchDetail();
    return () => {
      dispatch(clearSelectedGoal());
    };
  }, [refetchDetail, dispatch]);

  return {
    goal: selectedGoal,
    loading: status === "loading",
    error: error,
    refetchDetail,
  };
};
