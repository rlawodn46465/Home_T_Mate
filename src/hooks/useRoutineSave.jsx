import { useState, useCallback } from "react";

import { createRoutine, updateRoutine } from "../services/api/routineApi";

// 루틴 저장(생성/수정)
export const useRoutineSave = (isEditMode, routineId) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveRoutineHandler = useCallback(
    async (routineDataToSave) => {
      setIsSaving(true);
      setError(null);
      let result = null;

      try {
        if (isEditMode && routineId) {
          // 수정 (PUT)
          await updateRoutine(routineId, routineDataToSave);
          result = {
            success: true,
            message: "루틴이 성공적으로 수정되었습니다.",
            id: routineId,
          };
        } else {
          // 생성 (POST)
          const newId = await createRoutine(routineDataToSave);
          result = {
            success: true,
            message: "새 루틴이 성공적으로 생성되었습니다.",
            id: newId,
          };
        }

        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "알 수 없는 오류";
        setError(errorMessage);

        throw new Error(`저장 실패: ${errorMessage}`);
      } finally {
        setIsSaving(false);
      }
    },
    [isEditMode, routineId]
  );

  return {
    isSaving,
    error,
    saveRoutineHandler,
  };
};
