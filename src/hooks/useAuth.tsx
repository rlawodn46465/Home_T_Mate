import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadUserThunk, logoutThunk } from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, status } = useAppSelector(
    (state) => state.auth
  );

  // 사용자 정보 로드
  const loadUser = useCallback(
    async (token?: string) => {
      const resultAction = await dispatch(loadUserThunk(token));
      if (loadUserThunk.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload as string);
      }
    },
    [dispatch]
  );

  // 로그아웃
  const handleLogout = useCallback(async () => {
    await dispatch(logoutThunk());
    navigate("/");
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    isAuthLoading: status === "loading",
    loadUser,
    handleLogout,
  };
};
