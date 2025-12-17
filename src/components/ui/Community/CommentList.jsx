import { useAuth } from "../../../hooks/useAuth"; // 로그인된 사용자 ID를 가져오기 위해 필요
import Spinner from "../../common/Spinner";
import "./CommentList.css";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const CommentList = ({ comments, isLoading, onDelete }) => {
  const { user, isAuthenticated } = useAuth();
  const currentUserId = user?.user.id;

  if (isLoading) {
    return <Spinner text={"댓글 로딩 중..."}/>;
  }

  if (!comments || comments.length === 0) {
    return <div className="comment-no-data">첫 댓글을 작성해보세요!</div>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-author-section">
            <span className="comment-icon">👤</span>
            <span className="comment-author">
              {comment.author?.nickname || "알 수 없는 사용자"}
            </span>
            {isAuthenticated &&
              !comment.isDeleted &&
              currentUserId === comment.author?.id && (
                <button
                  className="comment-delete-btn"
                  onClick={() => {
                    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
                      onDelete(comment.id, comment.author.id);
                    }
                  }}
                >
                  삭제
                </button>
              )}
          </div>
          <p
            className={`comment-content ${comment.isDeleted ? "deleted" : ""}`}
          >
            {comment.content}
          </p>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
