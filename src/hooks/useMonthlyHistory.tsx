// hooks/useMonthlyWorkoutDots.js

import { useState, useEffect, useCallback } from "react";
import { fetchMonthlyHistory } from "../services/api/historyApi";
import type { MonthlyHistoryItem } from "../types/history";

interface UseMonthlyHistoryReturn {
  historyData: MonthlyHistoryItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMonthlyHistory = (
  year: number | undefined,
  month: number | undefined
): UseMonthlyHistoryReturn => {
  const [historyData, setHistoryData] = useState<MonthlyHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (y: number | undefined, m: number | undefined) => {
      if (y === undefined || m === undefined) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchMonthlyHistory(y, m);
        setHistoryData(data);
      } catch (err) {
        console.error("월별 기록 로딩 중 오류 발생:", err);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
        setHistoryData([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData(year, month);
  }, [year, month, loadData]);

  const refetch = () => loadData(year, month);

  return { historyData, isLoading, error, refetch };
};
