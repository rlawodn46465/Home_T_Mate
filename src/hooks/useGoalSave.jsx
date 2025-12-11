import { useState, useCallback } from "react";

import { createGoal, updateGoal } from "../services/api/goalApi";
import { parseApiError } from "../utils/parseApiError";

// 루틴 저장(생성/수정)
export const useGoalSave = (isEditMode, goalId) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveGoalHandler = useCallback(
    async (goalDataToSave) => {
      setIsSaving(true);
      setError(null);
      try {
        if (isEditMode && goalId) {
          // 수정 (PUT)
          await updateGoal(goalId, goalDataToSave);
          return {
            success: true,
            id: goalId,
          };
        } else {
          // 생성 (POST)
          const newId = await createGoal(goalDataToSave);
          return {
            success: true,
            id: newId,
          };
        }
      } catch (err) {
        const msg = parseApiError(err);
        setError(msg);
        throw new Error(msg);
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
