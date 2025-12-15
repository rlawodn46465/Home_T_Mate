import api from "./api";

const API_STATS_PATH = "/api/v1/stats";

// 이번주 운동 통계
export const fetchWeekly = async () => {
  const response = await api.get(`${API_STATS_PATH}/weekly`);
  return response.data.data;
};

// 이번주 부위별 무게 통계
export const fetchWeight = async () => {
  const response = await api.get(`${API_STATS_PATH}/weight`);
  return response.data.data;
};
