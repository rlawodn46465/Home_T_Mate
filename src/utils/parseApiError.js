export const parseApiError = (err) => {
  if (!err) return "알 수 없는 오류";
  if (err.response) {
    return (
      err.response.data?.message || `서버 오류 (status: ${err.response.status})`
    );
  }
  if (err.request) return "네트워크 오류 또는 서버 응답 없음";
  return err.message || "알 수 없는 오류";
};
