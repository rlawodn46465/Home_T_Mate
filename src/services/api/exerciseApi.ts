import api from "./api";
import type {
  ExerciseMaster,
  ExerciseFilters,
  ExerciseDetailResponse,
} from "../../types/exercise";

const API_EXERCISE_PATH = "/api/v1/exercises";

// 운동 목록 조회
export const fetchExercises = async (
  filters: ExerciseFilters = {}
): Promise<ExerciseMaster[]> => {
  const params = new URLSearchParams(
    filters as Record<string, string>
  ).toString();
  const response = await api.get<{ data: ExerciseMaster[] }>(
    `${API_EXERCISE_PATH}?${params}`
  );
  return response.data.data;
};

// 특정 운동 상세 정보 조회
export const fetchExerciseDetail = async (
  exerciseId: string
): Promise<ExerciseDetailResponse> => {
  if (!exerciseId) throw new Error("운동 ID가 필요합니다.");
  const response = await api.get<{ data: ExerciseDetailResponse }>(
    `${API_EXERCISE_PATH}/${exerciseId}`
  );
  return response.data.data;
};