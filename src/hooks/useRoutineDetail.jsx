import { useState, useEffect, useCallback } from "react";
import { fetchRoutineDetail } from "../services/api/routineApi";

// 특정 루틴의 상세 정보 불러오기
export const useRoutineDetail = (routineId, shouldFetch = true) => {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetchDetail = useCallback(async () => {
    if (!routineId || !shouldFetch) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoutineDetail(routineId);
      setRoutine(data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "알 수 없는 오류";
      console.error(
        `루틴 상세 정보 로드 실패 (ID: ${routineId}): `,
        errorMessage
      );
      setError(`루틴 상세 정보를 불러오는 데 실패했습니다: ${errorMessage}`);
      setRoutine(null);
    } finally {
      setLoading(false);
    }
  }, [routineId, shouldFetch]);

  useEffect(() => {
    refetchDetail();
  }, [refetchDetail]);

  return { routine, loading, error, refetchDetail };
};
