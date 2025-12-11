import {
  deleteExerciseSession,
  updateExerciseSession,
} from "../services/api/historyApi";
import { useApi } from "./useApi";

export const useHistoryActions = (refetchHistory) => {
  const { loading, error, execute } = useApi();

  const handleDelete = async (recordId) => {
    return execute(() => deleteExerciseSession(recordId))
      .then(() => refetchHistory?.())
      .then(() => true)
      .catch(() => false);
  };

  const handleUpdate = async (recordId, updatedData) => {
    return execute(() => updateExerciseSession(recordId, updatedData))
      .then(() => refetchHistory?.())
      .then(() => true)
      .catch(() => false);
  };

  return {
    isProcessing: loading,
    error,
    handleDelete,
    handleUpdate,
  };
};
