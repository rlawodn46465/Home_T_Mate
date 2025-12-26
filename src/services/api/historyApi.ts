import api from "./api";
import type {
  MonthlyHistoryItem,
  SingleRecordResponse,
  SaveWorkoutRequest,
} from "../../types/history";

const API_HISTORY_PATH = "/api/v1/history";

// 운동 기록 목록
export const fetchHistorys = async (): Promise<any[]> => {
  const response = await api.get<{ data: any[] }>(API_HISTORY_PATH);
  return response.data.data;
};

// 운동 기록 저장
export const saveExerciseSession = async (
  workoutData: SaveWorkoutRequest
): Promise<{ message: string }> => {
  const response = await api.post(API_HISTORY_PATH, workoutData);
  return response.data;
};

// 단일 운동 기록 조회
export const fetchSingleRecord = async (
  recordId: string
): Promise<SingleRecordResponse> => {
  const response = await api.get<{ data: SingleRecordResponse }>(
    `${API_HISTORY_PATH}/${recordId}`
  );
  return response.data.data;
};

// 운동 기록 삭제
export const deleteExerciseSession = async (
  recordId: string
): Promise<{ message: string }> => {
  const response = await api.delete(`${API_HISTORY_PATH}/${recordId}`);
  return response.data;
};

// 운동 기록 수정
export const updateExerciseSession = async (
  recordId: string,
  updatedData: Partial<SaveWorkoutRequest>
): Promise<{ message: string }> => {
  const response = await api.put(
    `${API_HISTORY_PATH}/${recordId}`,
    updatedData
  );
  return response.data;
};

// 날짜별 운동 기록 조회
export const fetchMonthlyHistory = async (
  year: number,
  month: number
): Promise<MonthlyHistoryItem[]> => {
  const response = await api.get<{ data: MonthlyHistoryItem[] }>(
    `${API_HISTORY_PATH}/calendar`,
    { params: { year, month } }
  );
  return response.data.data;
};
