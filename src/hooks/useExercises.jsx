import { useEffect } from "react";
import { fetchExercises } from "../services/api/goalApi";
import { useApi } from "./useApi";

// 운동 마스터 목록 관리
export const useExercises = (filters) => {
  const { data, isLoading, error, execute } = useApi(
    (params) => fetchExercises(params),
    { immediate: !!filters, defaultParams: filters }
  );

  // 자동 로드가 필요하면 filters가 바뀔 때마다 호출
  useEffect(() => {
    if (filters) execute(filters).catch(() => {});
  }, [filters]);

  return {
    exercises: data || [],
    isLoading,
    error,
    refetch: () => execute(filters),
  };
};