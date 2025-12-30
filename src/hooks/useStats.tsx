import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchWeeklyThunk, fetchWeightThunk } from "../store/slices/statSlice";

export const useFetchWeekly = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { weekly, fetchWeekly } = useSelector((state: RootState) => state.stat);

  useEffect(() => {
    if (fetchWeekly.status === "idle") {
      dispatch(fetchWeeklyThunk());
    }
  }, [dispatch, fetchWeekly.status]);

  return {
    data: weekly,
    loading: fetchWeekly.status === "loading",
    error: fetchWeekly.error,
    refetch: () => dispatch(fetchWeeklyThunk()),
  };
};

export const useFetchWeight = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { weight, fetchWeight } = useSelector((state: RootState) => state.stat);

  useEffect(() => {
    if (fetchWeight.status === "idle") {
      dispatch(fetchWeightThunk());
    }
  }, [dispatch, fetchWeight.status]);

  return {
    data: weight,
    loading: fetchWeight.status === "loading",
    error: fetchWeight.error,
    refetch: () => dispatch(fetchWeightThunk()),
  };
};
