import { useState, useEffect, useCallback } from "react";
import { fetchGoals, fetchTodayGoals } from "../services/api/goalApi";
import type { GoalDetail, TodayGoal } from "../types/goal";

// 목표 목록 상태 관리, API 통신 훅
export const useGoals = () => {
  const [goals, setGoals] = useState<GoalDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGoals();
      setGoals(data);
    } catch (err) {
      console.error("목표 목록 로드 실패:", err.response?.data || err.message);
      setError("목표 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 데이터 로드
    refreshGoals();
  }, [refreshGoals]);

  return { goals, loading, error, refreshGoals };
};

export const useTodayGoals = () => {
  const [goals, setGoals] = useState<TodayGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodayGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTodayGoals();
      setGoals(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayGoals();
  }, [loadTodayGoals]);

  return { goals, isLoading, error, loadTodayGoals };
};