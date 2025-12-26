import { useState, useCallback } from "react";
import { createGoal, updateGoal } from "../services/api/goalApi";
import type { CreateGoalRequest, UpdateGoalRequest } from "../types/goal";

interface SaveResult {
  success: boolean;
  message: string;
  id: string;
}

interface UseGoalSaveReturn {
  isSaving: boolean;
  error: string | null;
  saveGoalHandler: (
    goalDataToSave: CreateGoalRequest | UpdateGoalRequest
  ) => Promise<SaveResult>;
}

// 목표 저장(생성/수정)
export const useGoalSave = (
  isEditMode: boolean,
  goalId: string | undefined
): UseGoalSaveReturn => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveGoalHandler = useCallback(
    async (
      goalDataToSave: CreateGoalRequest | UpdateGoalRequest
    ): Promise<SaveResult> => {
      setIsSaving(true);
      setError(null);

      try {
        if (isEditMode && goalId) {
          // 수정 (PUT)
          await updateGoal(goalId, goalDataToSave as UpdateGoalRequest);
          return {
            success: true,
            message: "목표가 성공적으로 수정되었습니다.",
            id: goalId,
          };
        } else {
          // 생성 (POST)
          const newId = await createGoal(goalDataToSave as CreateGoalRequest);
          return {
            success: true,
            message: "새 목표가 성공적으로 생성되었습니다.",
            id: newId,
          };
        }
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
