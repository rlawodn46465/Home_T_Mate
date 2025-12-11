import { useState } from "react";
import {
  deleteExerciseSession,
  updateExerciseSession,
} from "../services/api/historyApi";

export const useHistoryActions = (refetchHistory) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (recordId) => {
    setIsProcessing(true);
    setError(null);
    try {
      await deleteExerciseSession(recordId);
      if (typeof refetchHistory === "function") {
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

  const handleUpdate = async (recordId, updatedData) => {
    setIsProcessing(true);
    setError(null);
    try {
      await updateExerciseSession(recordId, updatedData);
      if (typeof refetchHistory === "function") {
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
