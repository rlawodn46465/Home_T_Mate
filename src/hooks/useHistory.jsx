import { useState, useEffect, useCallback } from "react";
import {
  fetchHistorys,
  saveExerciseSession,
  updateExerciseSession,
} from "../services/api/historyApi";
import { useApi } from "./useApi";

// 루틴 목록 상태 관리, API 통신 훅
export const useHistorys = () => {
  const { data, isLoading, error, execute } = useApi(fetchHistorys, {
    immediate: true,
  });
  return {
    historys: data || [],
    loading: isLoading,
    error,
    refreshHistorys: () => execute(),
  };
};

// 운동 기록 저장
export const useCreateHistory = () => {
  const { loading, error, execute } = useApi(saveExerciseSession);

  const createHistory = async (workoutData) => {
    return execute(workoutData)
      .then(() => true)
      .catch(() => false);
  };

  return {
    isSaving: loading,
    saveError: error,
    createHistory,
  };
};

// 운동 기록 수정
export const useUpdateHistory = (recordId) => {
  const { loading, error, execute } = useApi((data) =>
    updateExerciseSession(recordId, data)
  );

  const updateHistory = async (data) => {
    if (!recordId) return false;
    return execute(data)
      .then(() => true)
      .catch(() => false);
  };

  return {
    isUpdating: loading,
    updateError: error,
    updateHistory,
  };
};
