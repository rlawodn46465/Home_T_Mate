import { useState, useCallback } from "react";

import { createGoal, updateGoal } from "../services/api/goalApi";

// 목표 저장(생성/수정)
export const useGoalSave = (isEditMode, goalId) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveGoalHandler = useCallback(
    async (goalDataToSave) => {
      setIsSaving(true);
      setError(null);
      let result = null;

      try {
        if (isEditMode && goalId) {
          // 수정 (PUT)
          await updateGoal(goalId, goalDataToSave);
          result = {
            success: true,
            message: "목표가 성공적으로 수정되었습니다.",
            id: goalId,
          };
        } else {
          // 생성 (POST)
          const newId = await createGoal(goalDataToSave);
          result = {
            success: true,
            message: "새 목표가 성공적으로 생성되었습니다.",
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
    [isEditMode, goalId]
  );

  return {
    isSaving,
    error,
    saveGoalHandler,
  };
};
