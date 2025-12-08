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
  return response.data;
};

// 단일 운동 기록 조회
export const fetchSingleRecord = async (recordId) => {
  // GET /api/v1/history/:recordId
  const response = await api.get(`${API_HISTORY_PATH}/${recordId}`);
  return response.data.data;
};

// 운동 기록 삭제
export const deleteExerciseSession = async (recordId) => {
  // DELETE /api/v1/history/:recordId
  const response = await api.delete(`${API_HISTORY_PATH}/${recordId}`);
  return response.data;
};

// 운동 기록 수정
export const updateExerciseSession = async (recordId, updatedData) => {
  // PUT /api/v1/history/:recordId
  const response = await api.put(
    `${API_HISTORY_PATH}/${recordId}`,
    updatedData
  );
  return response.data;
};

// 날짜별 운동 기록 조회
export const fetchMonthlyHistory = async (year, month) => {
  const response = await api.get(`${API_HISTORY_PATH}/calendar`, {
    params: { year, month },
  });
  return response.data.data;
};
