import { useState, useEffect, useCallback } from "react";
import { fetchHistorys } from "../services/api/historyApi";

// 루틴 목록 상태 관리, API 통신 훅
export const useHistorys = () => {
  const [historys, setHistorys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshHistorys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistorys();
      setHistorys(data);
    } catch (err) {
      console.error("운동 기록 불러오기 실패:", err.response?.data || err.message);
      setError("운동 기록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHistorys();
  }, [refreshHistorys]);

  return { historys, loading, error, refreshHistorys };
};
