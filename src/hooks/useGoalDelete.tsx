import { useState, useCallback } from "react";
import { deleteGoal } from "../services/api/goalApi";

interface UseGoalDeleteReturn {
  isDeleting: boolean;
  error: string | null;
  deleteGoalHandler: (goalId: string) => Promise<void>;
}

// 목표 삭제 기능
export const useGoalDelete = (): UseGoalDeleteReturn => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGoalHandler = useCallback(async (goalId: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      if (!goalId) {
        throw new Error("삭제할 목표 ID가 필요합니다.");
      }

      await deleteGoal(goalId);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "알 수 없는 오류";
      setError(errorMessage);
      console.log(`목표 삭제 실패 (ID: ${goalId}): `, err);

      throw new Error(`목표 삭제 실패: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    isDeleting,
    error,
    deleteGoalHandler,
  };
};
