import { useState, useCallback } from "react";
import { createPost } from "../services/api/postApi";

export const usePostCreate = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createPosting = useCallback(async (postData) => {
    if (isCreating) return null;

    setIsCreating(true);
    try {
      const result = await createPost(postData);

      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "게시글 작성 중 알 수 없는 오류가 발생했습니다.";
      alert(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [isCreating]);

  return {
    createPosting,
    isCreating,
  };
};
