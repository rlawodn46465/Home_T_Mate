import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { fetchDailyExerciseRecords } from "../services/api/goalApi";
import type { DailyRecord } from "../types/goal";

interface UseDailyExerciseRecordsReturn {
  records: DailyRecord[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// 특정 날짜의 모든 운동 기록 불러오기
const useDailyExerciseRecords = (
  selectedDate: Date | null
): UseDailyExerciseRecordsReturn => {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // selectedDate를 'YYYY-MM-DD' 문자열로 변환
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const fetchRecords = useCallback(async (date: string | null) => {
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
  }, []);

  useEffect(() => {
    // 날짜가 변경될 때마다 데이터를 다시 불러옵니다.
    fetchRecords(dateString);
  }, [dateString, fetchRecords]);

  // 수동으로 데이터를 다시 불러오는 함수 (예: 운동 기록 후)
  const refetch = () => {
    fetchRecords(dateString);
  };

  return { records, isLoading, error, refetch };
};

export default useDailyExerciseRecords;
