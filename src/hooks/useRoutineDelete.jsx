import { useState, useCallback } from "react";
import { deleteRoutine } from "../services/api/routineApi";

// 루틴 삭제 기능
export const useRoutineDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteRoutineHandler = useCallback(async (routineId) => {
    setIsDeleting(true);
    setError(null);

    try {
      if (!routineId) {
        throw new Error("삭제할 루틴 ID가 필요합니다.");
      }

      await deleteRoutine(routineId);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "알 수 없는 오류";
      setError(errorMessage);
      console.log(`루틴 삭제 실패 (ID: ${routineId}): `, err);

      throw new Error(`루틴 삭제 실패: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    isDeleting,
    error,
    deleteRoutineHandler,
  };
};
