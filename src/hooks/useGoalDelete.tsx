import { useState, useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import { deleteGoalThunk } from "../store/slices/goalSlice";

interface UseGoalDeleteReturn {
  isDeleting: boolean;
  error: string | null;
  deleteGoalHandler: (goalId: string) => Promise<void>;
}

// 목표 삭제 기능
export const useGoalDelete = (): UseGoalDeleteReturn => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGoalHandler = useCallback(
    async (goalId: string) => {
      if (!goalId) return;

      setIsDeleting(true);
      setError(null);

      try {
        await dispatch(deleteGoalThunk(goalId)).unwrap();
      } catch (err: any) {
        const errorMessage = err?.message || "목표 삭제에 실패했습니다.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
    [dispatch]
  );

  return { isDeleting, error, deleteGoalHandler };
};
