import { deleteGoal } from "../services/api/goalApi";
import { useApi } from "./useApi";

// 루틴 삭제 기능
export const useGoalDelete = () => {
  const { loading, error, execute } = useApi(deleteGoal);

  const deleteGoalHandler = async (goalId) => {
    if (!goalId) throw new Error("삭제할 루틴 ID가 필요합니다.");
    return execute(goalId);
  };

  return {
    isDeleting: loading,
    error,
    deleteGoalHandler,
  };
};
