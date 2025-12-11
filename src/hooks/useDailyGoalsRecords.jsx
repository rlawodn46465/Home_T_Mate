import { useEffect } from "react";
import { format } from "date-fns";
import { fetchDailyExerciseRecords } from "../services/api/goalApi";
import { useApi } from "./useApi";

// 특정 날짜의 모든 운동 기록 불러오기
const useDailyExerciseRecords = (selectedDate) => {
  // selectedDate를 'YYYY-MM-DD' 문자열로 변환
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const { data, isLoading, error, execute, setData } = useApi(
    fetchDailyExerciseRecords
  );

  useEffect(() => {
    if (!dateString) {
      setData([]);
      return;
    }
    execute(dateString).catch(() => {});
  }, [dateString]);

  const refetch = () => execute(dateString);

  return { records: data || [], isLoading, error, refetch };
};

export default useDailyExerciseRecords;