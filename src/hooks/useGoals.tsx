import { useState, useEffect, useCallback } from "react";
import { createGoal, deleteGoal, fetchGoalDetail, fetchGoals, fetchTodayGoals, updateGoal } from "../services/api/goalApi";
import type { CreateGoalRequest, GoalDetail, TodayGoal, UpdateGoalRequest } from "../types/goal";

// 목표 목록 및 오늘 목표 조회
export const useGoals = () => {
  const [goals, setGoals] = useState<GoalDetail[]>([]);
  const [todayGoals, setTodayGoals] = useState<TodayGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGoals();
      setGoals(data);
    } catch (err: any) {
      setError("목표 목록을 불러오는 데 실패했습니다.");
    } finally { setLoading(false); }
  }, []);

  const loadTodayGoals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTodayGoals();
      setTodayGoals(data);
    } catch (err: any) {
      setError("오늘의 목표를 불러오는 데 실패했습니다.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { refreshGoals(); }, [refreshGoals]);

  return { goals, todayGoals, loading, error, refreshGoals, loadTodayGoals };
};

// 특정 목표의 상세 조회
export const useGoalDetail = (goalId: string | undefined, shouldFetch: boolean = true) => {
  const [goal, setGoal] = useState<GoalDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetchDetail = useCallback(async () => {
    if (!goalId || !shouldFetch) return;
    setLoading(true);
    try {
      const data = await fetchGoalDetail(goalId);
      setGoal(data);
    } catch (err: any) {
      setError("상세 정보를 불러오는 데 실패했습니다.");
    } finally { setLoading(false); }
  }, [goalId, shouldFetch]);

  useEffect(() => { refetchDetail(); }, [refetchDetail]);

  return { goal, loading, error, refetchDetail };
};

// 목표 저장(생성/수정)
export const useGoalSave = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveGoalHandler = async (
    goalData: CreateGoalRequest | UpdateGoalRequest,
    isEditMode: boolean,
    goalId?: string
  ) => {
    setIsSaving(true);
    try {
      if (isEditMode && goalId) {
        await updateGoal(goalId, goalData as UpdateGoalRequest);
        return { success: true, message: "수정되었습니다.", id: goalId };
      } else {
        const newId = await createGoal(goalData as CreateGoalRequest);
        return { success: true, message: "생성되었습니다.", id: newId };
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "저장 실패";
      throw new Error(msg);
    } finally { setIsSaving(false); }
  };

  return { isSaving, saveGoalHandler };
};

// 목표 삭제
export const useGoalDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteGoalHandler = async (goalId: string) => {
    if (!goalId) return;
    setIsDeleting(true);
    try {
      await deleteGoal(goalId);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "삭제 실패");
    } finally { setIsDeleting(false); }
  };

  return { isDeleting, deleteGoalHandler };
};