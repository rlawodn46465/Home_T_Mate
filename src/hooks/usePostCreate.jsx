import { useState, useCallback } from "react";
import { createPost, updatePost } from "../services/api/postApi";

export const usePostCreate = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const savePost = useCallback(
    async (postData, postId = null) => {
      if (isProcessing) return null;

      setIsProcessing(true);
      try {
        const result = postId
          ? await updatePost(postId, postData)
          : await createPost(postData);
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "저장 중 오류가 발생했습니다.";
        alert(errorMessage);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  return {
    savePost,
    isProcessing,
  };
};
