import { useState, useCallback } from "react";
import { createPost, updatePost } from "../services/api/postApi";
import type { SavePostRequest } from "../types/post";

type SavePostResult =
  | { id: string }
  | { postId: string; message: string }
  | null;

interface UsePostCreateReturn {
  savePost: (
    postData: SavePostRequest,
    postId?: string | null
  ) => Promise<SavePostResult>;
  isProcessing: boolean;
}

export const usePostCreate = (): UsePostCreateReturn => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const savePost = useCallback(
    async (
      postData: SavePostRequest,
      postId: string | null = null
    ): Promise<SavePostResult> => {
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
