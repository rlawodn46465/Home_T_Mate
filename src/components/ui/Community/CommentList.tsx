import { memo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import Spinner from "../../common/Spinner";
import styles from "./CommentList.module.css";
import type { CommentDTO } from "../../../types/comment";

interface CommentListProps {
  comments: CommentDTO[];
  isLoading: boolean;
  onDelete: (commentId: string, authorId: string) => Promise<void>;
}

interface CommentItemProps {
  comment: CommentDTO;
  isOwner: boolean;
  onDelete: (commentId: string, authorId: string) => Promise<void>;
}

// 날짜 포맷팅 유틸리티
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const CommentList = ({ comments, isLoading, onDelete }: CommentListProps) => {
  const { user, isAuthenticated } = useAuth();
  const currentUserId = user?.id;

  if (isLoading) {
    return <Spinner text="댓글 로딩 중..." />;
  }

  if (!comments || comments.length === 0) {
    return <div className={styles.noData}>첫 댓글을 작성해보세요!</div>;
  }

  return (
    <div className={styles.list}>
      {comments.map((comment) => {
        const isOwner =
          isAuthenticated &&
          String(currentUserId) === String(comment.author?.id);

        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwner={isOwner}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

const CommentItem = memo(({ comment, isOwner, onDelete }: CommentItemProps) => {
  const handleDelete = () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      onDelete(comment.id, String(comment.author?.id));
    }
  };

  const contentClassName = `${styles.content} ${
    comment.isDeleted ? styles.deleted : ""
  }`;

  return (
    <div className={styles.item}>
      <div className={styles.authorSection}>
        <span className={styles.icon} role="img" aria-label="user">
          👤
        </span>
        <span className={styles.author}>
          {comment.author?.nickname || "알 수 없는 사용자"}
        </span>

        {isOwner && !comment.isDeleted && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleDelete}
          >
            삭제
          </button>
        )}
      </div>

      <p className={contentClassName}>{comment.content}</p>

      <time className={styles.date}>{formatDate(comment.createdAt)}</time>
    </div>
  );
});

export default memo(CommentList);
