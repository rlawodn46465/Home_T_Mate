import { useState, useEffect, useCallback } from "react";
import { fetchHistorys } from "../services/api/historyApi";
import { saveExerciseSession } from "../services/api/historyApi";

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
      console.error(
        "운동 기록 불러오기 실패:",
        err.response?.data || err.message
      );
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

// 운동 기록 저장
export const useCreateHistory = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // 운동 기록을 서버에 저장
  const createHistory = async (workoutData) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const result = await saveExerciseSession(workoutData);
      console.log("운동 기록 저장 성공:", result.message);
      return true;
    } catch (error) {
      console.error("운동 기록 저장 실패:", error);
      let errorMessage = "알 수 없는 오류가 발생했습니다.";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `서버 오류 발생 (Status: ${error.response.status})`;
      } else if (error.request) {
        errorMessage = "네트워크 연결 오류 또는 서버 응답 없음.";
      } else {
        errorMessage = error.message;
      }
      setSaveError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveError, createHistory };
};
