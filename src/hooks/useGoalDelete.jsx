import { useState, useCallback } from "react";
import { deleteGoal } from "../services/api/goalApi";

// 루틴 삭제 기능
export const useGoalDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteGoalHandler = useCallback(async (goalId) => {
    setIsDeleting(true);
    setError(null);

    try {
      if (!goalId) {
        throw new Error("삭제할 루틴 ID가 필요합니다.");
      }

      await deleteGoal(goalId);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "알 수 없는 오류";
      setError(errorMessage);
      console.log(`루틴 삭제 실패 (ID: ${goalId}): `, err);

      throw new Error(`루틴 삭제 실패: ${errorMessage}`);
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
