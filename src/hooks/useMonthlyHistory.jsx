// hooks/useMonthlyWorkoutDots.js

import { useState, useEffect, useCallback } from "react";
import { fetchMonthlyHistory } from "../services/api/historyApi";

export const useMonthlyHistory = (year, month) => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (y, m) => {
    if (!y || !m) return;

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
  }, []);

  useEffect(() => {
    loadData(year, month);
  }, [year, month, loadData]);

  const refetch = () => loadData(year, month);

  return { historyData, isLoading, error, refetch };
};