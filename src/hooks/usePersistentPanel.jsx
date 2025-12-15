import { useLocation, useNavigate } from "react-router-dom";

export const usePersistentPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 URL에 panel 쿼리가 없으면 대쉬보드를 기본값으로
  const getDefaultPanel = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("panel") || "dashboard";
  };

  // 특정 경로로 이동할 때 현재 쿼리 파라미터 자동 유지
  const navigateWithPanel = (to) => {
    const search = location.search;
    navigate(`${to}${search}`);
  };

  // 패널 쿼리값만 변경
  const navigateToPanel = (newSearchString, toPath = location.pathname) => {
    navigate(`${toPath}${newSearchString}`);
  };

  return {
    navigateWithPanel,
    navigateToPanel,
    getDefaultPanel,
    currentPath: location.pathname,
  };
};
