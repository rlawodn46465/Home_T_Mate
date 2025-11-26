import api from "./api";

const API_HISTORY_PATH = "/api/v1/history";

// 운동 기록 목록
export const fetchHistorys = async () => {
  const response = await api.get(API_HISTORY_PATH);
  return response.data.data;
};

// 운동 기록 저장
export const saveExerciseSession = async (workoutData) => {
  const response = await api.post(API_HISTORY_PATH, workoutData);
  return response.data.data;
};