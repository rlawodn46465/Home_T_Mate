export interface CommentAuthor {
  id: string | null;
  nickname: string;
}

export interface CommentDTO  {
  id: string;
  content: string;
  author: CommentAuthor;
  isDeleted: boolean;
  createdAt: string;
  postId?: string;
  updatedAt?: string;
}

export interface CreateCommentData {
  content: string;
}
