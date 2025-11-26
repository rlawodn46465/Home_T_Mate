// hooks/useMonthlyWorkoutDots.js

import { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
// 💡 서버에 월별 기록을 불러오는 API가 없다고 가정하고,
//    기존 일별 API를 활용하여 전체 월 기록을 가져오도록 서버 코드를 수정할 수도 있지만,
//    여기서는 클라이언트 측에서 처리 가능한 형태로 DUMMY 데이터를 대체하는 함수를 가정합니다.
// import { fetchMonthlyExerciseSummary } from "../services/api/routineApi";

const useMonthlyWorkoutDots = (currentMonth) => {
  const [monthlyDots, setMonthlyDots] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // API 호출에 필요한 월/년 문자열
  const monthYearKey = useMemo(
    () => (currentMonth ? format(currentMonth, "yyyy-MM") : null),
    [currentMonth]
  );

  useEffect(() => {
    if (!monthYearKey) return;

    const loadMonthlySummary = async () => {
      setIsLoading(true);
      try {
        // --- 🚨 실제 API 코드가 들어갈 곳 🚨 ---
        // const data = await fetchMonthlyExerciseSummary(monthYearKey);
        // setMonthlyDots(data);
        // --- 🚨 /실제 API 코드가 들어갈 곳 🚨 ---
      } catch (err) {
        console.error("월별 기록 로드 실패", err);
        setMonthlyDots({});
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthlySummary();
  }, [monthYearKey, currentMonth]);

  return { monthlyDots, isLoading };
};

export default useMonthlyWorkoutDots;

// 💡 DUMMY_WORKOUT_DATA는 ExerciseListPage.js에서 복사하여 사용합니다.
// const DUMMY_WORKOUT_DATA = {
//   "2025-09-03": ["가슴", "등", "어깨", "하체", "팔", "코어"],
//   "2025-09-04": ["가슴", "등", "어깨", "하체", "팔", "코어"],
//   "2025-09-10": ["하체", "코어"],
//   "2025-09-08": ["가슴"],
//   "2025-08-31": ["팔"],
//   "2025-10-04": ["코어"],
//   "2025-11-19": ["코어"],
// };
