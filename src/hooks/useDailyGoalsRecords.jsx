import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fetchDailyExerciseRecords } from "../services/api/routineApi";

// 특정 날짜의 모든 운동 기록 불러오기
const useDailyExerciseRecords = (selectedDate) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // selectedDate를 'YYYY-MM-DD' 문자열로 변환
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const fetchRecords = async (date) => {
    if (!date) {
      setRecords([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDailyExerciseRecords(date);
      setRecords(data);
    } catch (err) {
      console.error("일일 운동 기록 로드 실패:", err);
      setError(err);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 날짜가 변경될 때마다 데이터를 다시 불러옵니다.
    fetchRecords(dateString);
  }, [dateString]);

  // 수동으로 데이터를 다시 불러오는 함수 (예: 운동 기록 후)
  const refetch = () => {
    fetchRecords(dateString);
  };

  return { records, isLoading, error, refetch };
};

export default useDailyExerciseRecords;