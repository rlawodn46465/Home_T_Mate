import api from "./api";

const API_GOALS_PATH = "/api/v1/goals";
const API_EXERCISE_PATH = "/api/v1/exercises";

// --------------------
// 루틴/챌린지 관련 API
// --------------------

// 사용자 모든 루틴/챌린지 목록 조회
export const fetchRoutines = async () => {
  const response = await api.get(API_GOALS_PATH);
  return response.data.data;
};

// 특정 날짜의 운동 기록 조회
export const fetchDailyExerciseRecords = async (dateString) => {
  if (!dateString) {
    throw new Error("날짜 정보가 필요합니다.");
  }

  const response = await api.get(`${API_GOALS_PATH}/records`, {
    params: { date: dateString },
  });

  return response.data.data;
};

// 루틴/챌린지 목록의 운동 기록 통합 조회
export const fetchGoalsAndDailyRecords = async () => {
  // GET /api/v1/goals/all 호출
  const response = await api.get(`${API_GOALS_PATH}/all`);
  // 서버에서 반환한 { goals: [...], dailyRecords: [...] } 구조를 그대로 반환
  return response.data.data;
};

// 특정 루틴/챌린지 상세 정보 조회
export const fetchRoutineDetail = async (id) => {
  const response = await api.get(`${API_GOALS_PATH}/${id}`);
  return response.data.data;
};

// 새 루틴/챌린지 생성
export const createRoutine = async (data) => {
  const response = await api.post(API_GOALS_PATH, data);
  return response.data.id;
};

// 기존 루틴/챌린지 수정
export const updateRoutine = async (id, data) => {
  await api.put(`${API_GOALS_PATH}/${id}`, data);
};

// 특정 루틴/챌린지 삭제
export const deleteRoutine = async (id) => {
  await api.delete(`${API_GOALS_PATH}/${id}`);
};

// --------------------------
// 운동 마스터 데이터 관련 API
// --------------------------

// 운동 마스터 목록 조회
export const fetchExercises = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`${API_EXERCISE_PATH}?${params}`);
  return response.data.data;
};
