import { useState, useEffect, useCallback } from "react";
import { fetchRoutines } from "../services/api/routineApi";

// 루틴 목록 상태 관리, API 통신 훅
export const useRoutines = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshRoutines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoutines();
      setRoutines(data);
    } catch (err) {
      // 사용자님의 API 인터셉터가 401을 처리하므로, 여기서는 일반적인 에러만 처리
      console.error("루틴 목록 로드 실패:", err.response?.data || err.message);
      setError("루틴 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 데이터 로드
    refreshRoutines();
  }, [refreshRoutines]);

  return { routines, loading, error, refreshRoutines };
};
