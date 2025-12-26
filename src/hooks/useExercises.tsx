import { useState, useEffect } from "react";
import { fetchExercises } from "../services/api/goalApi";
import type { ExerciseMaster, ExerciseFilters } from "../types/exercise";

interface UseExercisesReturn {
  exercises: ExerciseMaster[];
  isLoading: boolean;
}

// 운동 마스터 목록 관리
export const useExercises = (filters: ExerciseFilters): UseExercisesReturn => {
  const [exercises, setExercises] = useState<ExerciseMaster[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!filters) return;

    let isCancelled = false;
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        // 필터 없이 전체 운동 마스터 목록 로드 (캐시 필요 시 여기에 로직 추가)
        const data = await fetchExercises(filters);
        if (!isCancelled) {
          setExercises(data);
        }
      } catch (err) {
        console.error("운동 마스터 목록 로드 실패:", err);
        setExercises([]);
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    };
    loadExercises();

    return () => {
      isCancelled = true;
    };
  }, [filters]);

  return { exercises, isLoading };
};
