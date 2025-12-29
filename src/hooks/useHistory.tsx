import { useEffect, useCallback } from "react";
import type { SaveWorkoutRequest } from "../types/history";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createHistoryThunk,
  deleteHistoryThunk,
  fetchMonthlyHistoryThunk,
  fetchSingleHistoryThunk,
  updateHistoryThunk,
} from "../store/slices/historySlice";

// 월별 운동 기록 조회
export const useMonthlyHistory = (year?: number, month?: number) => {
  const dispatch = useAppDispatch();

  const { monthly, fetchMonthly } = useAppSelector((state) => state.history);

  const refetch = useCallback(() => {
    if (year && month) {
      dispatch(fetchMonthlyHistoryThunk({ year, month }));
    }
  }, [dispatch, year, month]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    historyData: monthly,
    isLoading: fetchMonthly.status === "loading",
    error: fetchMonthly.error,
    refetch,
  };
};

// 단일 기록 조회
export const useSingleHistory = (recordId?: string) => {
  const dispatch = useAppDispatch();
  const { single, fetchSingle } = useAppSelector((state) => state.history);

  useEffect(() => {
    if (recordId) {
      dispatch(fetchSingleHistoryThunk(recordId));
    }
  }, [dispatch, recordId]);

  return {
    record: single,
    isLoading: fetchSingle.status === "loading",
    error: fetchSingle.error,
  };
};

// 운동 기록 저장
export const useCreateHistory = () => {
  const dispatch = useAppDispatch();
  const save = useAppSelector((state) => state.history.save);

  const createHistory = async (data: SaveWorkoutRequest) => {
    if (save.status === "loading") return false;
    await dispatch(createHistoryThunk(data)).unwrap();
    return true;
  };

  return {
    isSaving: save.status === "loading",
    saveError: save.error,
    createHistory,
  };
};

// 운동 기록 수정
export const useUpdateHistory = (recordId: string | undefined) => {
  const dispatch = useAppDispatch();
  const save = useAppSelector((state) => state.history.save);

  const updateHistory = async (data: Partial<SaveWorkoutRequest>) => {
    if (!recordId || save.status === "loading") return false;
    await dispatch(updateHistoryThunk({ recordId, data })).unwrap();
    return true;
  };

  return {
    isUpdating: save.status === "loading",
    updateError: save.error,
    updateHistory,
  };
};

// 운동 기록 삭제
export const useDeleteActions = (refetch?: () => void) => {
  const dispatch = useAppDispatch();
  const save = useAppSelector((state) => state.history.save);

  const deleteHistory = async (recordId: string) => {
    if (save.status === "loading") return false;
    await dispatch(deleteHistoryThunk(recordId)).unwrap();
    refetch?.();
    return true;
  };

  return {
    isProcessing: save.status === "loading",
    error: save.error,
    deleteHistory,
  };
};
