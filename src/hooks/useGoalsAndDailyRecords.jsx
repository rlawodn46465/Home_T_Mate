import { useState, useEffect } from "react";
import { fetchGoalsAndDailyRecords } from "../services/api/goalApi";

// 목표 목록의 운동 기록을 불러오는 커스텀 훅
const useGoalsAndDailyRecords = () => {
  const [allGoals, setAllGoals] = useState([]);
  // const [dailyRecords, setDailyRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 🛠️ 통합 API 호출
      const data = await fetchGoalsAndDailyRecords();

      setAllGoals(data || []);
    } catch (err) {
      console.error("목표 및 일일 기록 통합 로드 실패:", err);
      setError(err);
      setAllGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 수동으로 데이터를 다시 불러오는 함수
  const refetch = () => {
    loadData();
  };

  return { allGoals, isLoading, error, refetch };
};

export default useGoalsAndDailyRecords;
