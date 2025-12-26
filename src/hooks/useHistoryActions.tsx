import { useState } from "react";
import {
  deleteExerciseSession,
  updateExerciseSession,
} from "../services/api/historyApi";
import type { SaveWorkoutRequest } from "../types/history";

interface UseHistoryActionsReturn {
  isProcessing: boolean;
  error: Error | null;
  handleDelete: (recordId: string) => Promise<boolean>;
  handleUpdate: (
    recordId: string,
    updatedData: Partial<SaveWorkoutRequest>
  ) => Promise<boolean>;
}

export const useHistoryActions = (
  refetchHistory?: () => void
): UseHistoryActionsReturn => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleDelete = async (recordId: string): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);
    try {
      await deleteExerciseSession(recordId);
      if (refetchHistory) {
        refetchHistory();
      }
      return true;
    } catch (err) {
      console.error("기록 삭제 실패:", err);
      setError(err);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async (
    recordId: string,
    updatedData: Partial<SaveWorkoutRequest>
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);
    try {
      await updateExerciseSession(recordId, updatedData);
      if (refetchHistory) {
        refetchHistory();
      }
      return true;
    } catch (err) {
      console.error("기록 수정 실패:", err);
      setError(err);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    error,
    handleDelete,
    handleUpdate,
  };
};
