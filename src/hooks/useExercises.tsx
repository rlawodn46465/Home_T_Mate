import { useState, useEffect, useCallback } from "react";
import { fetchExerciseDetail, fetchExercises } from "../services/api/goalApi";
import type { ExerciseMaster, ExerciseFilters } from "../types/exercise";

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

// 특정 운동 상세 정보 조회
export const useExerciseDetail = (exerciseId: string | number) => {
  const [detailData, setDetailData] = useState<ExerciseDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [persistedMemo, setPersistedMemo] = useState<string>("");

  const loadDetail = useCallback(async () => {
    if (!exerciseId) {
      setError("유효한 운동 ID가 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchExerciseDetail(String(exerciseId));
      setDetailData(data as unknown as ExerciseDetailData);

      // 기존 메모가 존재한다면 상태에 동기화
      if (data.myStats?.memo) {
        setPersistedMemo(data.myStats.memo);
      }
    } catch (err: any) {
      console.error("운동 상세 로드 실패:", err);
      setError(err.message || "정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  // 메모 업데이트 핸들러 (로컬 상태 업데이트)
  const handleMemoUpdate = (newMemo: string) => {
    setPersistedMemo(newMemo);
    // 참고: 실제 DB 반영이 필요한 경우 여기서 추가 API 호출 가능
  };

  return {
    detailData,
    isLoading,
    error,
    persistedMemo,
    handleMemoUpdate,
    refetch: loadDetail,
  };
};
