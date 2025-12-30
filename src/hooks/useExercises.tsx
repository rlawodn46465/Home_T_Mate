import { useState, useEffect, useCallback } from "react";
import type { ExerciseMaster, ExerciseFilters } from "../types/exercise";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  clearExerciseDetail,
  fetchExerciseDetailThunk,
  fetchExercisesThunk,
} from "../store/slices/exerciseSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

interface UseExercisesReturn {
  exercises: ExerciseMaster[];
  isLoading: boolean;
}

export interface ExerciseDetailData {
  exercise: {
    id?: string | number;
    name: string;
    description: {
      setup: { step: number; text: string }[];
      movement: { step: number; text: string }[];
      breathing: { step: number; text: string }[];
      tips: string[];
    };
    targetMuscles: string[];
    equipment: string;
  };
  myStats?: {
    memo?: string;
    best: number;
    total: number;
    [key: string]: any;
  };
  recentLogs?: any[];
}

// 운동 마스터 목록 관리
export const useExercises = (filters: ExerciseFilters) => {
  const dispatch = useAppDispatch();

  const exercises = useAppSelector((state) => state.exercise.list);
  const fetchList = useAppSelector((state) => state.exercise.fetchList);

  useEffect(() => {
    dispatch(fetchExercisesThunk(filters));
  }, [dispatch, filters]);

  const refreshExercises = useCallback(() => {
    dispatch(fetchExercisesThunk(filters));
  }, [dispatch, filters]);

  return {
    exercises,

    isLoading: fetchList.status === "loading",
    error: fetchList.error,

    refreshExercises,
  };
};

// 특정 운동 상세 정보 조회
export const useExerciseDetail = (exerciseId: string | number) => {
  const dispatch = useDispatch<AppDispatch>();

  const id = String(exerciseId);

  const detail = useAppSelector((state) => state.exercise.detailMap[id]);
  const fetchDetail = useAppSelector((state) => state.exercise.fetchDetail);

  useEffect(() => {
    if (!detail && fetchDetail.status !== "loading") {
      dispatch(fetchExerciseDetailThunk(id));
    }
  }, [dispatch, id, detail, fetchDetail.status]);

  const refetch = useCallback(() => {
    dispatch(fetchExerciseDetailThunk(id));
  }, [dispatch, id]);

  const clear = useCallback(() => {
    dispatch(clearExerciseDetail(id));
  }, [dispatch, id]);

  return {
    detailData: detail,

    isLoading: fetchDetail.status === "loading",
    error: fetchDetail.error,

    refetch,
    clear,
  };
};
