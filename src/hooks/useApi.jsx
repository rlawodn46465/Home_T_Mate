import { useState, useCallback, useEffect, useRef } from "react";
import { parseApiError } from "../utils/parseApiError";

export const useApi = (apiFn, options = {}) => {
  const { immediate = false, defaultParams = null } = options;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (params = defaultParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFn(params);
        if (mountedRef.current) setData(result);
        return result;
      } catch (err) {
        const parsed = parseApiError(err);
        if (mountedRef.current) setError(parsed);
        throw err;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [apiFn, defaultParams]
  );

  useEffect(() => {
    if (immediate) execute(defaultParams).catch(() => {});
  }, [execute, immediate, defaultParams]);

  return { data, isLoading, error, execute, setData };
};
